package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class ApiPermissionMapNotFoundException extends ResourceNotFoundException {
    public ApiPermissionMapNotFoundException(Long id) {
        super("API_MAP_NOT_FOUND", "API permission map with ID " + id + " not found");
    }
}
