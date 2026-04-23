package com.kiwi.dream.auth.constants;

public final class SystemRoles {

    public static final String SUPER_ADMIN = "SUPER_ADMIN";
    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";

    private SystemRoles() {}

    /**
     * Returns true for roles that cannot be assigned via the createAdmin endpoint
     * or deleted via the role management API.
     */
    public static boolean isReserved(String roleName) {
        return SUPER_ADMIN.equals(roleName) || USER.equals(roleName);
    }
}
