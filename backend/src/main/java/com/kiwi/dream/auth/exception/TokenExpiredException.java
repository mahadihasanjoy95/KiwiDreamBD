package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class TokenExpiredException extends BadRequestException {
    public TokenExpiredException() {
        super("TOKEN_EXPIRED", "Refresh token has expired");
    }
}
