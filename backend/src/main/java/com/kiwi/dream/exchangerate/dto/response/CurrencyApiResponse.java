package com.kiwi.dream.exchangerate.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Deserializes the JSON response from the external currency rate API.
 *
 * <p>Example response from {@code https://api.exchangerate-api.com/v4/latest/USD}:
 * <pre>
 * {
 *   "base": "USD",
 *   "date": "2026-04-27",
 *   "rates": {
 *     "BDT": 110.50,
 *     "NZD": 1.635,
 *     "AUD": 1.530,
 *     ...
 *   }
 * }
 * </pre>
 * All rate values represent: 1 USD = X of that currency.
 * Cross-rates are calculated as: BDT→NZD = rates[NZD] / rates[BDT].
 */
public record CurrencyApiResponse(
        @JsonProperty("base")  String base,
        @JsonProperty("date")  String date,
        @JsonProperty("rates") Map<String, BigDecimal> rates
) {}
