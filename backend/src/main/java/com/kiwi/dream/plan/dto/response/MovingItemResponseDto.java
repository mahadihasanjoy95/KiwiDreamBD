package com.kiwi.dream.plan.dto.response;

import java.math.BigDecimal;

public record MovingItemResponseDto(
        String id,
        String planId,
        String itemNameEn,
        String itemNameBn,
        String customItemName,
        BigDecimal estimatedAmountNzd,
        String noteEn,
        String noteBn,
        String customNote,
        boolean custom,
        int displayOrder
) {}
