package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class UserNotFoundException extends ResourceNotFoundException {
    public UserNotFoundException(String userId) {
        super("USER_NOT_FOUND", "User with ID '" + userId + "' not found");
    }
}
