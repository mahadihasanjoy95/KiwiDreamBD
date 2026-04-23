package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record AssignRolePermissionsRequestDto(

        @NotNull(message = "Permission IDs are required")
        Set<Long> permissionIds
) {}
