package com.kiwi.dream.profile.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record CreatePlanningProfileRequestDto(

        @NotBlank(message = "Profile code is required")
        @Size(max = 50, message = "Profile code must not exceed 50 characters")
        String code,

        @NotBlank(message = "English name is required")
        @Size(max = 150, message = "English name must not exceed 150 characters")
        String nameEn,

        @NotBlank(message = "Bengali name is required")
        @Size(max = 300, message = "Bengali name must not exceed 300 characters")
        String nameBn,

        String shortDetailsEn,
        String shortDetailsBn,

        List<String> tags,

        BigDecimal monthlyBudgetRangeMinNzd,
        BigDecimal monthlyBudgetRangeMaxNzd,

        /**
         * Number of people covered by this profile (min 1).
         * Defaults to 1 if not provided.
         */
        @Min(value = 1, message = "Person count must be at least 1")
        Integer defaultPersonCount,

        @Size(max = 1000, message = "Icon SVG URL must not exceed 1000 characters")
        String iconSvgUrl,

        @Size(max = 7, message = "Color hex must not exceed 7 characters")
        String colorHex,

        Integer displayOrder
) {}
