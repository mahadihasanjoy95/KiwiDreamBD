package com.kiwi.dream.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserServiceImpl implements CurrentUserService {

    @Override
    public UserPrincipal getPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            throw new IllegalStateException("No authenticated user in security context");
        }
        return principal;
    }

    @Override
    public String getCurrentUserId() {
        return getPrincipal().getUserId();
    }

    @Override
    public String getCurrentUserEmail() {
        return getPrincipal().getEmail();
    }
}
