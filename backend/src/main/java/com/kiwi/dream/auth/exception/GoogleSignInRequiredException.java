package com.kiwi.dream.auth.exception;

import com.kiwi.dream.common.exception.BadRequestException;

public class GoogleSignInRequiredException extends BadRequestException {
    public GoogleSignInRequiredException() {
        super("GOOGLE_SIGN_IN_REQUIRED", "This account uses Google Sign-In. Please sign in with Google.");
    }
}
