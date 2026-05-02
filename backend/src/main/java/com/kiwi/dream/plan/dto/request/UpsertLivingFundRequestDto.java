package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Upserts the living fund for a plan. Admin fills guidance fields on master plans;
 * applicants fill personal savings fields on user plans. All fields optional — null means no change.
 */
public record UpsertLivingFundRequestDto(

        // Admin guidance fields
        @DecimalMin(value = "0.00")
        @DecimalMax(value = "5000000.00", message = "Minimum fund must not exceed 50 lakh NZD")
        BigDecimal minimumAmountNzd,
        @DecimalMin(value = "0.00")
        @DecimalMax(value = "5000000.00", message = "Recommended fund must not exceed 50 lakh NZD")
        BigDecimal recommendedAmountNzd,
        String explanationEn,
        String explanationBn,
        String disclaimerEn,
        String disclaimerBn,

        // Applicant personal fields
        BigDecimal userSavedAmountBdt,
        BigDecimal userMonthlyContributionBdt,
        LocalDate userTargetDate,
        String userNotes
) {}
