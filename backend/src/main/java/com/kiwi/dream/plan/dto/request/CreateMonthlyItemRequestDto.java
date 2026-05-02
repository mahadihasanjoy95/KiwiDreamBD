package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateMonthlyItemRequestDto(

        @NotBlank(message = "Item name (EN) is required")
        @Size(max = 255)
        String nameEn,

        @Size(max = 500)
        String nameBn,

        @DecimalMin(value = "0.00", message = "Amount must be zero or positive")
        @DecimalMax(value = "5000000.00", message = "Amount must not exceed 50 lakh NZD")
        BigDecimal estimatedAmountNzd,

        String noteEn,
        String noteBn,

        Integer displayOrder
) {}
