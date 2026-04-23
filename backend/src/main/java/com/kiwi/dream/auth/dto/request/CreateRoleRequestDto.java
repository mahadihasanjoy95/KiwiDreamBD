package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateRoleRequestDto(

        @NotBlank(message = "Role name is required")
        @Pattern(regexp = "^[A-Z][A-Z0-9_]*$", message = "Role name must be uppercase alphanumeric (e.g. MANAGER)")
        @Size(max = 50, message = "Role name must not exceed 50 characters")
        String name,

        @Size(max = 255, message = "Description must not exceed 255 characters")
        String description
) {}
