package com.kiwi.dream.plan.dto.response;

import com.kiwi.dream.plan.enums.AffordabilityStatus;
import com.kiwi.dream.plan.enums.PlanStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Full plan response — includes all sub-resources and computed fields.
 * Returned by getById and getMyPlan endpoints.
 */
public record PlanResponseDto(
        // Plan metadata
        String id,
        String displayPlanName,
        String countryId,
        String countryNameEn,
        String cityId,
        String cityNameEn,
        String cityNameBn,
        String planningProfileId,
        String profileCode,
        String profileNameEn,
        boolean masterPlan,
        boolean published,
        PlanStatus status,
        String overviewEn,
        String overviewBn,

        // Sub-resources
        List<MonthlyItemResponseDto> monthlyItems,
        List<MovingItemResponseDto> movingItems,
        List<ChecklistItemResponseDto> checklistItems,
        LivingFundResponseDto livingFund,

        // Computed totals at plan level
        BigDecimal monthlyTotalNzd,
        BigDecimal movingCostTotalNzd,
        AffordabilityStatus affordabilityStatus,
        BigDecimal survivalMonths,
        Integer readinessScore,
        List<String> smartWarnings,

        Instant createdAt,
        Instant updatedAt
) {}
