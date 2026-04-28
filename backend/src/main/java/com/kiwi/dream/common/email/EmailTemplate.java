package com.kiwi.dream.common.email;

/**
 * All supported email templates.
 *
 * <p>Each constant maps to an HTML file in
 * {@code src/main/resources/templates/emails/}.</p>
 */
public enum EmailTemplate {

    PASSWORD_RESET("emails/password-reset", "Reset your KiwiDream BD password"),
    SOCIAL_LOGIN_REMINDER("emails/social-login-reminder", "Sign in to KiwiDream BD with Google"),
    ADMIN_INVITE("emails/admin-invite", "Your KiwiDream BD Admin Account");

    private final String templatePath;
    private final String subject;

    EmailTemplate(String templatePath, String subject) {
        this.templatePath = templatePath;
        this.subject = subject;
    }

    public String getTemplatePath() {
        return templatePath;
    }

    public String getSubject() {
        return subject;
    }
}
