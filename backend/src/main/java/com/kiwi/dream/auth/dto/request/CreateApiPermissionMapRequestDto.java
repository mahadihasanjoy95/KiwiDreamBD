package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateApiPermissionMapRequestDto(

        @NotBlank(message = "HTTP method is required")
        @Pattern(regexp = "GET|POST|PUT|PATCH|DELETE", message = "Must be a valid HTTP method")
        String httpMethod,

        @NotBlank(message = "Path pattern is required")
        @Size(max = 255, message = "Path pattern must not exceed 255 characters")
        String pathPattern,

        /** Required for permission-protected routes. Omit when isPublic or authenticatedOnly is true. */
        String permissionCode,

        /** When true, no JWT required. Mutually exclusive with authenticatedOnly. */
        Boolean isPublic,

        /** When true, any valid JWT is enough. Mutually exclusive with isPublic. */
        Boolean authenticatedOnly,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {}
