package com.kiwi.dream.plan.dto.request;

import jakarta.validation.constraints.Size;

/** All fields optional — null means no change. */
public record UpdatePlanRequestDto(

        @Size(max = 255, message = "Plan name must not exceed 255 characters")
        String displayPlanName,

        String overviewEn,
        String overviewBn
) {}
