package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateMasterPlanRequestDto(

        @NotNull(message = "Country ID is required")
        String countryId,

        @NotNull(message = "City ID is required")
        String cityId,

        @NotNull(message = "Planning profile ID is required")
        String planningProfileId,

        @NotBlank(message = "Plan name is required")
        @Size(max = 255, message = "Plan name must not exceed 255 characters")
        String displayPlanName,

        String overviewEn,
        String overviewBn
) {}
