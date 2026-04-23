package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class ProtectedRoleDeletionException extends ConflictException {
    public ProtectedRoleDeletionException(String name) {
        super("PROTECTED_ROLE", "System role '" + name + "' cannot be deleted");
    }
}
