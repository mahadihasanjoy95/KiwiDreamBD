package com.kiwi.dream.plan.exception;

import com.kiwi.dream.common.exception.AppException;
import org.springframework.http.HttpStatus;

/**
 * Thrown when a user tries to access or modify a plan they do not own.
 * Always returns HTTP 403 — never 404, to prevent probing plan IDs.
 */
public class PlanOwnershipException extends AppException {

    public PlanOwnershipException(String planId) {
        super(HttpStatus.FORBIDDEN, "PLAN_ACCESS_DENIED",
                "You do not have permission to access plan: " + planId);
    }
}
