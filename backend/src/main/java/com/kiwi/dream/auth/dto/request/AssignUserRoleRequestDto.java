package com.kiwi.dream.auth.dto.request;

import com.kiwi.dream.auth.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public record AssignUserRoleRequestDto(

        @NotNull(message = "Role is required")
        UserRole role
) {}
