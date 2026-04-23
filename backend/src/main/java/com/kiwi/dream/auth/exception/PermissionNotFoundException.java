package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class PermissionNotFoundException extends ResourceNotFoundException {
    public PermissionNotFoundException(String code) {
        super("PERMISSION_NOT_FOUND", "Permission '" + code + "' not found");
    }
}
