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
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
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
        return exchangeRateRepository.findByActiveTrueOrderByFromCurrencyAscToCurrencyAsc()
                .stream()
                .map(exchangeRateMapper::toDto)
                .toList();
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

        archiveActive(from, to);

        ExchangeRate newRate = buildRate(from, to, requestDto.rateValue(),
                requestDto.effectiveDate(), requestDto.note(), ExchangeRateSource.ADMIN_OVERRIDE);

        ExchangeRate saved = exchangeRateRepository.save(newRate);
        log.info("Admin override rate set: {} \u2192 {} = {} (effective {})",
                from, to, saved.getRateValue(), saved.getEffectiveDate());
        return exchangeRateMapper.toDto(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // API sync — called on startup and by nightly cron job
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public int syncRatesFromApi() {
        log.info("Starting exchange rate sync from external API...");

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

        // 3. Collect all unique currency codes from countries in our DB
        List<String> destinationCurrencies = countryRepository.findAll()
                .stream()
                .map(c -> c.getCurrencyCode().toUpperCase())
                .filter(code -> !code.equals(ORIGIN_CURRENCY)) // skip BDT itself
                .distinct()
                .toList();

        if (destinationCurrencies.isEmpty()) {
            log.warn("No countries found in the database. Skipping exchange rate sync.");
            return 0;
        }

        int updatedCount = 0;
        List<ExchangeRate> toSave = new ArrayList<>();
        LocalDate today = LocalDate.now();

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
                // Archive old and queue new BDT → destCurrency
                existingBdtToDest.ifPresent(old -> {
                    old.setActive(false);
                    toSave.add(old);
                });
                toSave.add(buildRate(ORIGIN_CURRENCY, destCurrency, bdtToDest, today,
                        "Auto-synced from ExchangeRate-API (USD base, " + apiResponse.date() + ")",
                        ExchangeRateSource.AUTO_FETCH));
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
                existingDestToBdt.ifPresent(old -> {
                    old.setActive(false);
                    toSave.add(old);
                });
                toSave.add(buildRate(destCurrency, ORIGIN_CURRENCY, destToBdt, today,
                        "Auto-synced from ExchangeRate-API (USD base, " + apiResponse.date() + ")",
                        ExchangeRateSource.AUTO_FETCH));
            }
        }

        exchangeRateRepository.saveAll(toSave);
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

    private void archiveActive(String fromCurrency, String toCurrency) {
        exchangeRateRepository.findActiveRate(fromCurrency, toCurrency).ifPresent(existing -> {
            existing.setActive(false);
            exchangeRateRepository.save(existing);
            log.info("Archived previous rate: {} \u2192 {} (was {}, source: {})",
                    fromCurrency, toCurrency, existing.getRateValue(), existing.getSource());
        });
    }

    private ExchangeRate buildRate(String from, String to, BigDecimal rateValue,
                                   LocalDate effectiveDate, String note,
                                   ExchangeRateSource source) {
        ExchangeRate rate = new ExchangeRate();
        rate.setFromCurrency(from);
        rate.setToCurrency(to);
        rate.setRateValue(rateValue.setScale(6, RoundingMode.HALF_UP));
        rate.setEffectiveDate(effectiveDate);
        rate.setNote(note);
        rate.setSource(source);
        rate.setActive(true);
        return rate;
    }
}
