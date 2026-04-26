package com.kiwi.dream.profile.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class PlanningProfileNotFoundException extends ResourceNotFoundException {

    public PlanningProfileNotFoundException(String id) {
        super("PLANNING_PROFILE_NOT_FOUND", "Planning profile not found: " + id);
    }
}
