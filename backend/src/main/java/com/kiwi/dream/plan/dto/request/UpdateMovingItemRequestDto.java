package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateMovingItemRequestDto(
        @Size(max = 255) String itemNameEn,
        @Size(max = 500) String itemNameBn,
        @Size(max = 255) String customItemName,
        @DecimalMin(value = "0.00") BigDecimal estimatedAmountNzd,
        String noteEn,
        String noteBn,
        String customNote,
        Integer displayOrder
) {}
