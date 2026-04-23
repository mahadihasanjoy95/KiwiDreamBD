package com.kiwi.dream.common.email;

/**
 * All supported email templates.
 *
 * <p>Each constant maps to an HTML file in
 * {@code src/main/resources/templates/emails/}.</p>
 */
public enum EmailTemplate {

    PASSWORD_RESET("emails/password-reset"),
    SOCIAL_LOGIN_REMINDER("emails/social-login-reminder"),
    ADMIN_INVITE("emails/admin-invite");

    private final String templatePath;

    EmailTemplate(String templatePath) {
        this.templatePath = templatePath;
    }

    public String getTemplatePath() {
        return templatePath;
    }
}
