package com.kiwi.dream.security;

import com.kiwi.dream.auth.enums.UserRole;
import lombok.Getter;

/**
 * Lightweight principal stored in SecurityContextHolder after successful JWT validation.
 * Carries the user's role so Spring Security can evaluate @PreAuthorize expressions
 * without an extra DB call.
 */
@Getter
public class UserPrincipal {

    private final String userId;
    private final String email;
    private final UserRole role;

    public UserPrincipal(String userId, String email, UserRole role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    @Override
    public String toString() {
        return "UserPrincipal{userId='" + userId + "', email='" + email + "', role=" + role + "}";
    }
}
