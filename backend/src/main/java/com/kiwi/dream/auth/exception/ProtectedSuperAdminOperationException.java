package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class ProtectedSuperAdminOperationException extends ConflictException {
    public ProtectedSuperAdminOperationException() {
        super("PROTECTED_SUPER_ADMIN", "Super Admin account cannot be modified or deleted");
    }
}
