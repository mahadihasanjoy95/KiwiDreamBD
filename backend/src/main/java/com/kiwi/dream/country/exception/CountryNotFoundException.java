package com.kiwi.dream.country.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class CountryNotFoundException extends ResourceNotFoundException {

    public CountryNotFoundException(String id) {
        super("COUNTRY_NOT_FOUND", "Country not found: " + id);
    }
}
