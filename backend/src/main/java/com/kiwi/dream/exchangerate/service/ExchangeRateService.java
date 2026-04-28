package com.kiwi.dream.exchangerate.service;

import com.kiwi.dream.exchangerate.dto.request.SetExchangeRateRequestDto;
import com.kiwi.dream.exchangerate.dto.response.ExchangeRateResponseDto;

import java.math.BigDecimal;
import java.util.List;

public interface ExchangeRateService {

    /**
     * Returns all currently active exchange rates across all currency pairs.
     * Public endpoint — no auth required.
     */
    List<ExchangeRateResponseDto> listActive();

    /**
     * Returns the single active rate for a given currency pair.
     * Throws {@link com.kiwi.dream.exchangerate.exception.ExchangeRateNotFoundException}
     * if no active rate exists for the pair.
     *
     * @param fromCurrency e.g. "BDT"
     * @param toCurrency   e.g. "NZD"
     */
    ExchangeRateResponseDto getActive(String fromCurrency, String toCurrency);

    /**
     * Returns the full rate history (active + archived) for a given currency pair.
     * Admin only.
     */
    List<ExchangeRateResponseDto> getHistory(String fromCurrency, String toCurrency);

    /**
     * Admin operation: manually override the rate for a currency pair.
     * Archives the previously active row for the same pair, then creates a new
     * active row with source = ADMIN_OVERRIDE.
     *
     * @return the newly created active rate row
     */
    ExchangeRateResponseDto setRate(SetExchangeRateRequestDto requestDto);

    /**
     * Fetches the latest USD-base rates from the external API and updates
     * all active rates for currencies present in the countries table.
     *
     * <p>Called on application startup and by the nightly cron job at midnight.
     * Skips any pair whose current active row has source = ADMIN_OVERRIDE,
     * preserving the admin's manual rate until they change it themselves.</p>
     *
     * @return number of currency pairs updated
     */
    int syncRatesFromApi();

    /**
     * Utility method used by other services (e.g. UserPlanService) to convert
     * an amount from one currency to another using the current active rate.
     *
     * @param amount       the amount in {@code fromCurrency}
     * @param fromCurrency e.g. "BDT"
     * @param toCurrency   e.g. "NZD"
     * @return the converted amount, rounded to 2 decimal places
     */
    BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency);
}
