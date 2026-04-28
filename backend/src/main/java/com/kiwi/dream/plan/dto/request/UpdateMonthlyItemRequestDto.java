package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/** All fields optional — null means no change. Used by both admin (nameEn/Bn) and applicant (customName). */
public record UpdateMonthlyItemRequestDto(

        @Size(max = 255) String nameEn,
        @Size(max = 500) String nameBn,

        /** Applicant-facing editable name. Only relevant on user plans. */
        @Size(max = 255) String customName,

        @DecimalMin(value = "0.00") BigDecimal estimatedAmountNzd,

        String noteEn,
        String noteBn,
        String customNote,

        Integer displayOrder
) {}
