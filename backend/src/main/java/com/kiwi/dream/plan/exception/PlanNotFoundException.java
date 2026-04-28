package com.kiwi.dream.plan.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class PlanNotFoundException extends ResourceNotFoundException {

    public PlanNotFoundException(String id) {
        super("PLAN_NOT_FOUND", "Plan not found: " + id);
    }
}
