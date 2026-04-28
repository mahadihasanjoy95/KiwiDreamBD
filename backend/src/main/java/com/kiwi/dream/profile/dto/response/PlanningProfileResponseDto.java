package com.kiwi.dream.profile.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PlanningProfileResponseDto(
        String id,
        String code,
        String nameEn,
        String nameBn,
        String shortDetailsEn,
        String shortDetailsBn,
        List<String> tags,
        BigDecimal monthlyBudgetRangeMinNzd,
        BigDecimal monthlyBudgetRangeMaxNzd,
        Integer defaultPersonCount,
        String iconSvgUrl,
        String colorHex,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
