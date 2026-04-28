package com.kiwi.dream.profile.exception;

import com.kiwi.dream.common.exception.ConflictException;

public class PlanningProfileCodeAlreadyExistsException extends ConflictException {

    public PlanningProfileCodeAlreadyExistsException(String code) {
        super("PLANNING_PROFILE_CODE_EXISTS",
                "A planning profile with code '" + code + "' already exists");
    }
}
