package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserPlanFromMasterRequestDto(

        @NotBlank(message = "Master plan ID is required")
        String masterPlanId,

        /**
         * Optional custom name for the user's copy.
         * If blank, the master plan's displayPlanName is used.
         */
        @Size(max = 255, message = "Plan name must not exceed 255 characters")
        String displayPlanName
) {}
