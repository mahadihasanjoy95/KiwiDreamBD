package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class InvalidCredentialsException extends BadRequestException {
    public InvalidCredentialsException() {
        super("INVALID_CREDENTIALS", "Invalid email or password");
    }
}
