package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class RoleAlreadyExistsException extends ConflictException {
    public RoleAlreadyExistsException(String name) {
        super("ROLE_ALREADY_EXISTS", "Role '" + name + "' already exists");
    }
}
