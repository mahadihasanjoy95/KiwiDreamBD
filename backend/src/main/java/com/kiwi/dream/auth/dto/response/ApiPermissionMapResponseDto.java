package com.kiwi.dream.auth.dto.response;

import java.time.Instant;

public record ApiPermissionMapResponseDto(
        Long id,
        String httpMethod,
        String pathPattern,
        PermissionResponseDto permission,
        boolean active,
        boolean isPublic,
        boolean authenticatedOnly,
        String description,
        Instant createdAt
) {}
