package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class AdminInviteTokenNotFoundException extends BadRequestException {
    public AdminInviteTokenNotFoundException() {
        super("INVALID_ADMIN_INVITE_TOKEN", "Admin invite link is invalid or has already been used.");
    }
}
