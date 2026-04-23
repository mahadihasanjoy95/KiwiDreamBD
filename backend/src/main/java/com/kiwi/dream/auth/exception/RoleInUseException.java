package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class RoleInUseException extends ConflictException {
    public RoleInUseException(String name) {
        super("ROLE_IN_USE", "Role '" + name + "' is currently assigned to one or more users and cannot be deleted");
    }
}
