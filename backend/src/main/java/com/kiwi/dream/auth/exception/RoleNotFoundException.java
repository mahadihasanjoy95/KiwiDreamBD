package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class RoleNotFoundException extends ResourceNotFoundException {
    public RoleNotFoundException(String name) {
        super("ROLE_NOT_FOUND", "Role '" + name + "' not found");
    }
    public RoleNotFoundException(Long id) {
        super("ROLE_NOT_FOUND", "Role with ID " + id + " not found");
    }
}
