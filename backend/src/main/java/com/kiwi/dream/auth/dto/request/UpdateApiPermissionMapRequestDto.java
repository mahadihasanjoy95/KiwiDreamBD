package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.Size;

public record UpdateApiPermissionMapRequestDto(

        String permissionCode,

        Boolean active,

        Boolean isPublic,

        Boolean authenticatedOnly,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {}
