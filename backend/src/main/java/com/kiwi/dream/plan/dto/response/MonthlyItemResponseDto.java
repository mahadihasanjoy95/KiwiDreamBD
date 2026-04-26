package com.kiwi.dream.plan.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record MonthlyItemResponseDto(
        String id,
        String planId,
        String nameEn,
        String nameBn,
        String customName,
        BigDecimal estimatedAmountNzd,
        String noteEn,
        String noteBn,
        String customNote,
        boolean custom,
        int displayOrder
) {}
