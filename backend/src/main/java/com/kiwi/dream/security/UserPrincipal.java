package com.kiwi.dream.security;

import lombok.Getter;

/**
 * Lightweight principal stored in SecurityContextHolder after successful JWT validation.
 * Does NOT implement Spring's UserDetails — authorization is handled by DbAuthorizationManager
 * using DB lookups, not granted authorities on the principal.
 */
@Getter
public class UserPrincipal {

    private final String userId;
    private final String email;

    public UserPrincipal(String userId, String email) {
        this.userId = userId;
        this.email = email;
    }

    @Override
    public String toString() {
        return "UserPrincipal{userId='" + userId + "', email='" + email + "'}";
    }
}
