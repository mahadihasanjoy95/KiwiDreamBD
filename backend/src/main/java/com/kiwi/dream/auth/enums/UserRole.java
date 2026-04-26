package com.kiwi.dream.auth.enums;

/**
 * Application roles. A user holds exactly one role at all times.
 *
 * ROLE_APPLICANT  — student/applicant. Browses publicly; owns and manages personal plans.
 * ROLE_ADMIN      — operational staff. Full content + user management.
 * ROLE_SUPER_ADMIN — unrestricted. Can delete core entities and manage admins.
 *
 * Spring Security reads the role name as a GrantedAuthority, so the ROLE_ prefix
 * is mandatory — hasRole('ADMIN') matches ROLE_ADMIN automatically.
 */
public enum UserRole {
    ROLE_APPLICANT,
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN
}
