package com.kiwi.dream.plan.dto.response;

import com.kiwi.dream.plan.enums.AffordabilityStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Living fund response — includes stored fields PLUS computed fields calculated
 * in the service layer at query time using the current live exchange rate.
 */
public record LivingFundResponseDto(

        // Stored fields
        String id,
        String planId,
        BigDecimal minimumAmountNzd,
        BigDecimal recommendedAmountNzd,
        String explanationEn,
        String explanationBn,
        String disclaimerEn,
        String disclaimerBn,
        BigDecimal userSavedAmountBdt,
        BigDecimal userMonthlyContributionBdt,
        LocalDate userTargetDate,
        String userNotes,

        // Computed fields (NOT stored — calculated fresh on every query)
        BigDecimal userSavedAmountNzd,
        BigDecimal monthlyTotalNzd,
        BigDecimal survivalMonths,
        AffordabilityStatus affordabilityStatus,
        Integer readinessScore,
        List<String> smartWarnings
) {}
