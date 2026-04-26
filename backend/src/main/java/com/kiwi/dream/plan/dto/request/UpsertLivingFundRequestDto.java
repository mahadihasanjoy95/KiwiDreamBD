package com.kiwi.dream.plan.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Upserts the living fund for a plan. Admin fills guidance fields on master plans;
 * applicants fill personal savings fields on user plans. All fields optional — null means no change.
 */
public record UpsertLivingFundRequestDto(

        // Admin guidance fields
        BigDecimal minimumAmountNzd,
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
