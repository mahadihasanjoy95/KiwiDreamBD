package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class PasswordResetTokenNotFoundException extends BadRequestException {
    public PasswordResetTokenNotFoundException() {
        super("INVALID_RESET_TOKEN", "Password reset token is invalid or has already been used");
    }
}
