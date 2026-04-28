package com.kiwi.dream.country.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class CountryCodeAlreadyExistsException extends ConflictException {

    public CountryCodeAlreadyExistsException(String code) {
        super("COUNTRY_CODE_EXISTS", "A country with code '" + code + "' already exists");
    }
}
