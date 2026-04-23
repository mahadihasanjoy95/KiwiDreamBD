package com.kiwi.dream.security;

public interface CurrentUserService {
    UserPrincipal getPrincipal();
    String getCurrentUserId();
    String getCurrentUserEmail();
}
