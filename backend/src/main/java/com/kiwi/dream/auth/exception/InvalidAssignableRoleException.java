package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class InvalidAssignableRoleException extends BadRequestException {
    public InvalidAssignableRoleException(String roleName) {
        super("INVALID_ASSIGNABLE_ROLE", "Role '" + roleName + "' cannot be assigned through this endpoint");
    }
}
