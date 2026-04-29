package com.kiwi.dream.exchangerate.service.serviceImpl;

import com.kiwi.dream.country.repository.CountryRepository;
import com.kiwi.dream.exchangerate.dto.request.SetExchangeRateRequestDto;
import com.kiwi.dream.exchangerate.dto.response.CurrencyApiResponse;
import com.kiwi.dream.exchangerate.dto.response.ExchangeRateResponseDto;
import com.kiwi.dream.exchangerate.entity.ExchangeRate;
import com.kiwi.dream.exchangerate.enums.ExchangeRateSource;
import com.kiwi.dream.exchangerate.exception.ExchangeRateNotFoundException;
import com.kiwi.dream.exchangerate.mapper.ExchangeRateMapper;
import com.kiwi.dream.exchangerate.repository.ExchangeRateRepository;
import com.kiwi.dream.exchangerate.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateServiceImpl implements ExchangeRateService {

    /** Base currency for the external API. All fetched rates are relative to USD. */
    private static final String API_BASE_CURRENCY = "USD";

    /**
     * The platform's origin currency (BDT).
     * All cross rates stored in DB are expressed as: 1 BDT = X destination currency.
     */
    private static final String ORIGIN_CURRENCY = "BDT";

    /**
     * Currency codes that are ALWAYS synced on every startup and nightly cron,
     * regardless of whether any countries exist in the DB yet.
     *
     * <p>This prevents the empty-table scenario on a fresh install:
     * if no countries are seeded yet, the sync used to skip entirely because
     * {@code countryRepository.findAll()} returned an empty list.
     * Now BDT↔NZD is guaranteed to be populated from day one.</p>
     */
    private static final List<String> PLATFORM_ESSENTIAL_CURRENCIES = List.of("NZD", "AUD", "CAD", "GBP");

    private final ExchangeRateRepository exchangeRateRepository;
    private final CountryRepository countryRepository;
    private final ExchangeRateMapper exchangeRateMapper;
    private final RestClient restClient;

    @Value("${app.exchange-rate.api.url}")
    private String apiUrl;

    // ─────────────────────────────────────────────────────────────────────────
    // Public read
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ExchangeRateResponseDto> listActive() {
        Map<String, ExchangeRateResponseDto> latestByPair = new LinkedHashMap<>();
        exchangeRateRepository.findByActiveTrueOrderByFromCurrencyAscToCurrencyAsc()
                .forEach(rate -> latestByPair.putIfAbsent(
                        rate.getFromCurrency() + ":" + rate.getToCurrency(),
                        exchangeRateMapper.toDto(rate)));
        return List.copyOf(latestByPair.values());
    }

    @Override
    @Transactional(readOnly = true)
    public ExchangeRateResponseDto getActive(String fromCurrency, String toCurrency) {
        return exchangeRateMapper.toDto(loadActiveOrThrow(fromCurrency, toCurrency));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExchangeRateResponseDto> getHistory(String fromCurrency, String toCurrency) {
        return exchangeRateRepository
                .findAllByPairOrderByEffectiveDateDesc(fromCurrency, toCurrency)
                .stream()
                .map(exchangeRateMapper::toDto)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin override
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ExchangeRateResponseDto setRate(SetExchangeRateRequestDto requestDto) {
        String from = requestDto.fromCurrency().toUpperCase().trim();
        String to   = requestDto.toCurrency().toUpperCase().trim();

        ExchangeRate saved = upsertLatestRate(from, to, requestDto.rateValue(),
                requestDto.effectiveDate(), requestDto.note(), ExchangeRateSource.ADMIN_OVERRIDE);

        log.info("Admin override rate saved: {} \u2192 {} = {} (effective {})",
                from, to, saved.getRateValue(), saved.getEffectiveDate());
        return exchangeRateMapper.toDto(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // API sync — called on startup and by nightly cron job
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public int syncRatesFromApi() {
        log.info("Starting exchange rate sync from external API: {}", apiUrl);

        // 1. Fetch USD-base rates from the free API
        CurrencyApiResponse apiResponse;
        try {
            apiResponse = restClient.get()
                    .uri(apiUrl)
                    .retrieve()
                    .body(CurrencyApiResponse.class);
        } catch (Exception ex) {
            log.error("Failed to fetch exchange rates from API: {}", ex.getMessage());
            return 0;
        }

        if (apiResponse == null || apiResponse.rates() == null || apiResponse.rates().isEmpty()) {
            log.warn("Exchange rate API returned empty or null response. Skipping sync.");
            return 0;
        }

        Map<String, BigDecimal> usdRates = apiResponse.rates();
        log.info("Fetched {} currency rates from API (base: USD, date: {})",
                usdRates.size(), apiResponse.date());

        // 2. Get the USD rate for our origin currency (BDT)
        BigDecimal usdToBdt = usdRates.get(ORIGIN_CURRENCY);
        if (usdToBdt == null || usdToBdt.compareTo(BigDecimal.ZERO) == 0) {
            log.error("BDT rate not found in API response. Skipping sync.");
            return 0;
        }

        // 3. Build destination currency list:
        //    - ALWAYS include PLATFORM_ESSENTIAL_CURRENCIES (NZD, AUD, CAD, GBP)
        //      so BDT↔NZD is synced even on a fresh install with no countries seeded yet.
        //    - Also merge in any currency codes from countries in the DB.
        List<String> dbCurrencies = countryRepository.findAll()
                .stream()
                .map(c -> c.getCurrencyCode().toUpperCase())
                .filter(code -> !code.equals(ORIGIN_CURRENCY))
                .distinct()
                .toList();

        List<String> destinationCurrencies = new ArrayList<>(PLATFORM_ESSENTIAL_CURRENCIES);
        for (String code : dbCurrencies) {
            if (!destinationCurrencies.contains(code)) {
                destinationCurrencies.add(code);
            }
        }
        log.info("Syncing {} destination currencies: {} ({} from DB countries)",
                destinationCurrencies.size(), destinationCurrencies, dbCurrencies.size());

        int updatedCount = 0;
        LocalDate today = LocalDate.now();
        String syncNote = "Auto-synced from ExchangeRate-API (USD base, " + apiResponse.date() + ")";

        for (String destCurrency : destinationCurrencies) {
            BigDecimal usdToDest = usdRates.get(destCurrency);
            if (usdToDest == null || usdToDest.compareTo(BigDecimal.ZERO) == 0) {
                log.warn("Currency {} not found in API response. Skipping.", destCurrency);
                continue;
            }

            // Cross rate: 1 BDT = ? destCurrency
            // Formula: (1/usdToBdt) USD * usdToDest = usdToDest / usdToBdt
            BigDecimal bdtToDest = usdToDest.divide(usdToBdt, 10, RoundingMode.HALF_UP);

            // Reverse: 1 destCurrency = ? BDT
            BigDecimal destToBdt = usdToBdt.divide(usdToDest, 10, RoundingMode.HALF_UP);

            // Check if an ADMIN_OVERRIDE is currently active — if so, skip it to preserve the override
            Optional<ExchangeRate> existingBdtToDest =
                    exchangeRateRepository.findActiveRate(ORIGIN_CURRENCY, destCurrency);

            if (existingBdtToDest.isPresent()
                    && existingBdtToDest.get().getSource() == ExchangeRateSource.ADMIN_OVERRIDE) {
                log.info("Skipping {} \u2192 {}: active ADMIN_OVERRIDE in place (rate: {}).",
                        ORIGIN_CURRENCY, destCurrency, existingBdtToDest.get().getRateValue());
            } else {
                upsertLatestRate(ORIGIN_CURRENCY, destCurrency, bdtToDest, today,
                        syncNote, ExchangeRateSource.AUTO_FETCH);
                updatedCount++;
            }

            // Same logic for reverse: destCurrency → BDT
            Optional<ExchangeRate> existingDestToBdt =
                    exchangeRateRepository.findActiveRate(destCurrency, ORIGIN_CURRENCY);

            if (existingDestToBdt.isPresent()
                    && existingDestToBdt.get().getSource() == ExchangeRateSource.ADMIN_OVERRIDE) {
                log.info("Skipping {} \u2192 {}: active ADMIN_OVERRIDE in place (rate: {}).",
                        destCurrency, ORIGIN_CURRENCY, existingDestToBdt.get().getRateValue());
            } else {
                upsertLatestRate(destCurrency, ORIGIN_CURRENCY, destToBdt, today,
                        syncNote, ExchangeRateSource.AUTO_FETCH);
                updatedCount++;
            }
        }

        log.info("Exchange rate sync complete. Updated {} currency pairs.", updatedCount);
        return updatedCount;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Conversion utility
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount.setScale(2, RoundingMode.HALF_UP);
        }
        ExchangeRate rate = loadActiveOrThrow(fromCurrency, toCurrency);
        return amount.multiply(rate.getRateValue()).setScale(2, RoundingMode.HALF_UP);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    private ExchangeRate loadActiveOrThrow(String fromCurrency, String toCurrency) {
        return exchangeRateRepository.findActiveRate(fromCurrency, toCurrency)
                .orElseThrow(() -> new ExchangeRateNotFoundException(fromCurrency, toCurrency));
    }

    private ExchangeRate upsertLatestRate(String from, String to, BigDecimal rateValue,
                                          LocalDate effectiveDate, String note,
                                          ExchangeRateSource source) {
        List<ExchangeRate> rows = exchangeRateRepository.findRowsForUpsert(from, to);
        ExchangeRate rate = rows.stream().findFirst()
                .orElseGet(() -> {
                    ExchangeRate created = new ExchangeRate();
                    created.setFromCurrency(from);
                    created.setToCurrency(to);
                    return created;
                });

        rate.setFromCurrency(from);
        rate.setToCurrency(to);
        rate.setRateValue(rateValue.setScale(6, RoundingMode.HALF_UP));
        rate.setEffectiveDate(effectiveDate);
        rate.setNote(note);
        rate.setSource(source);
        rate.setActive(true);

        List<ExchangeRate> staleRows = rows.stream()
                .filter(existing -> existing.getId() != null)
                .filter(existing -> !existing.getId().equals(rate.getId()))
                .peek(existing -> existing.setActive(false))
                .toList();

        ExchangeRate saved = exchangeRateRepository.save(rate);
        if (!staleRows.isEmpty()) {
            exchangeRateRepository.saveAll(staleRows);
        }
        exchangeRateRepository.deleteInactiveByPair(from, to);
        return saved;
    }
}
