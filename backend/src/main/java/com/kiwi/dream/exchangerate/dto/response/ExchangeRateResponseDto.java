package com.kiwi.dream.exchangerate.dto.response;

import com.kiwi.dream.exchangerate.enums.ExchangeRateSource;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Read-only view of a single exchange rate row returned to clients.
 * All monetary conversions on the frontend use {@code rateValue} from
 * the active row for the BDT → NZD pair.
 */
public record ExchangeRateResponseDto(
        String id,
        String fromCurrency,
        String toCurrency,
        BigDecimal rateValue,
        LocalDate effectiveDate,
        boolean active,
        ExchangeRateSource source,
        String note,
        Instant createdAt,
        Instant updatedAt
) {}
