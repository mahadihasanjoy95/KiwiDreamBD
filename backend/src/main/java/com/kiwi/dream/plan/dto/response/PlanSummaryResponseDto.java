package com.kiwi.dream.plan.dto.response;

import com.kiwi.dream.plan.enums.AffordabilityStatus;
import com.kiwi.dream.plan.enums.PlanStatus;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Lightweight plan summary — used for dashboard cards, list views.
 * Does not include sub-resources (items, checklist, fund).
 */
public record PlanSummaryResponseDto(
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
        // Quick computed totals for dashboard cards
        BigDecimal monthlyTotalNzd,
        BigDecimal movingCostTotalNzd,
        BigDecimal survivalMonths,
        AffordabilityStatus affordabilityStatus,
        Integer readinessScore,
        Instant createdAt,
        Instant updatedAt
) {}
