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
     * Returns remaining rows for a given currency pair.
     * Sync/admin updates keep only the latest active row, so this normally
     * contains one row after the next refresh.
     * Admin only.
     */
    List<ExchangeRateResponseDto> getHistory(String fromCurrency, String toCurrency);

    /**
     * Admin operation: manually override the rate for a currency pair.
     * Updates the latest row in-place with source = ADMIN_OVERRIDE.
     *
     * @return the updated active rate row
     */
    ExchangeRateResponseDto setRate(SetExchangeRateRequestDto requestDto);

    /**
     * Fetches the latest USD-base rates from the external API and updates
     * BDT-based rates for platform essentials and currencies present in the
     * countries table.
     *
     * <p>Called on application startup and by the nightly cron job at midnight.
     * Existing rows are updated in-place so production uses the latest
     * API-fetched rate after each app start.</p>
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
