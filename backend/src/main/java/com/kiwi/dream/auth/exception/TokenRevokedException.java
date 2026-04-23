package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class TokenRevokedException extends BadRequestException {
    public TokenRevokedException() {
        super("TOKEN_REVOKED", "Refresh token is invalid or has been revoked");
    }
}
