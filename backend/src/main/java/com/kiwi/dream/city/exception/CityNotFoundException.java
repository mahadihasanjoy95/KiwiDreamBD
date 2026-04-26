package com.kiwi.dream.city.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class CityNotFoundException extends ResourceNotFoundException {

    public CityNotFoundException(String id) {
        super("CITY_NOT_FOUND", "City not found: " + id);
    }
}
