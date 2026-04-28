package com.kiwi.dream.plan.exception;

import com.kiwi.dream.common.exception.ResourceNotFoundException;

public class PlanItemNotFoundException extends ResourceNotFoundException {

    public PlanItemNotFoundException(String itemId) {
        super("PLAN_ITEM_NOT_FOUND", "Plan item not found: " + itemId);
    }
}
