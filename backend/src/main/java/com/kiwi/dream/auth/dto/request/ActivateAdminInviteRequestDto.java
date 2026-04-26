package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ActivateAdminInviteRequestDto(
        @NotBlank(message = "Activation token is required")
        String token
) {}
