package com.kiwi.dream.exchangerate.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Request DTO for setting or updating an exchange rate.
 * Admin only. Creates a new active row and archives the previous one.
 */
public record SetExchangeRateRequestDto(

        @NotBlank(message = "Source currency code is required (e.g. BDT)")
        @Size(max = 5, message = "Currency code must not exceed 5 characters")
        String fromCurrency,

        @NotBlank(message = "Destination currency code is required (e.g. NZD)")
        @Size(max = 5, message = "Currency code must not exceed 5 characters")
        String toCurrency,

        @NotNull(message = "Rate value is required")
        @DecimalMin(value = "0.000001", message = "Rate value must be greater than zero")
        BigDecimal rateValue,

        @NotNull(message = "Effective date is required")
        LocalDate effectiveDate,

        @Size(max = 500, message = "Note must not exceed 500 characters")
        String note
) {}
