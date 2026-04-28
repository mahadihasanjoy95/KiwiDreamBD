package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class AdminInviteTokenExpiredException extends BadRequestException {
    public AdminInviteTokenExpiredException() {
        super("ADMIN_INVITE_TOKEN_EXPIRED", "Admin invite link has expired. Please ask for a new invitation.");
    }
}
