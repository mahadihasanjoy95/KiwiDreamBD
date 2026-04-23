package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class PasswordResetTokenExpiredException extends BadRequestException {
    public PasswordResetTokenExpiredException() {
        super("RESET_TOKEN_EXPIRED", "Password reset token has expired. Please request a new one.");
    }
}
