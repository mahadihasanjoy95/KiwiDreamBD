package com.kiwi.dream.auth.dto.response;

public record ForgotPasswordResponseDto(
        String type,
        String message
) {
    public static ForgotPasswordResponseDto emailSent() {
        return new ForgotPasswordResponseDto(
                "EMAIL_SENT",
                "If an account with this email exists, a password reset link has been sent."
        );
    }

    public static ForgotPasswordResponseDto socialAccount() {
        return new ForgotPasswordResponseDto(
                "SOCIAL_ACCOUNT",
                "This account uses Google Sign-In. Please sign in with Google instead."
        );
    }
}
