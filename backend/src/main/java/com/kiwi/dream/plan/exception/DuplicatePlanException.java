package com.kiwi.dream.plan.exception;

import com.kiwi.dream.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class DuplicatePlanException extends AppException {

    public DuplicatePlanException(String cityName, String profileName) {
        super(HttpStatus.CONFLICT, "DUPLICATE_PLAN",
                "You already have an active plan for '" + cityName + "' with profile '" + profileName + "'.");
    }
}
