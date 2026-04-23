package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateAdminRequestDto(

        @NotBlank(message = "Name is required")
        @Size(max = 255, message = "Name must not exceed 255 characters")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        @Size(max = 255, message = "Email must not exceed 255 characters")
        String email,

        /** Optional — defaults to "ADMIN" if not provided. */
        @Pattern(regexp = "^[A-Z][A-Z0-9_]*$", message = "Role name must be uppercase alphanumeric")
        @Size(max = 50)
        String role
) {
    public String effectiveRole() {
        return (role != null && !role.isBlank()) ? role : "ADMIN";
    }
}
