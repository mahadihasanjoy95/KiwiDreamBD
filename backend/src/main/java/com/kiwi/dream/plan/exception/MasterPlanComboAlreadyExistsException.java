package com.kiwi.dream.plan.exception;

import com.kiwi.dream.common.exception.AppException;
import org.springframework.http.HttpStatus;

public class MasterPlanComboAlreadyExistsException extends AppException {

    public MasterPlanComboAlreadyExistsException(String cityCode, String profileCode) {
        super(HttpStatus.CONFLICT, "MASTER_PLAN_COMBO_EXISTS",
                "A master plan already exists for city '" + cityCode + "' and profile '" + profileCode + "'");
    }
}
