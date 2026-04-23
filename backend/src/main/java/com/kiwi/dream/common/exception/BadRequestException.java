package com.kiwi.dream.common.exception;

import org.springframework.http.HttpStatus;

public abstract class BadRequestException extends AppException {

    protected BadRequestException(String errorCode, String message) {
        super(HttpStatus.BAD_REQUEST, errorCode, message);
    }
}
