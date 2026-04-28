package com.kiwi.dream.city.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class CityCodeAlreadyExistsException extends ConflictException {

    public CityCodeAlreadyExistsException(String code, String countryCode) {
        super("CITY_CODE_EXISTS",
                "A city with code '" + code + "' already exists in country '" + countryCode + "'");
    }
}
