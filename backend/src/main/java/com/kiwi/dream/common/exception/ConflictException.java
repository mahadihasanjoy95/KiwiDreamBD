package com.kiwi.dream.common.exception;

import org.springframework.http.HttpStatus;

public abstract class ConflictException extends AppException {

    protected ConflictException(String errorCode, String message) {
        super(HttpStatus.CONFLICT, errorCode, message);
    }
}
