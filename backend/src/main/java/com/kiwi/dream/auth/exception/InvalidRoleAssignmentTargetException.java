package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class InvalidRoleAssignmentTargetException extends BadRequestException {
    public InvalidRoleAssignmentTargetException() {
        super("INVALID_ROLE_ASSIGNMENT_TARGET", "Roles can only be assigned to admin users through this endpoint");
    }
}
