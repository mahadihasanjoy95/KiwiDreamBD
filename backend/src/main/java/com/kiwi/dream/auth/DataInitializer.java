package com.kiwi.dream.auth;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.entity.ApiPermissionMap;
import com.kiwi.dream.auth.entity.Permission;
import com.kiwi.dream.auth.entity.Role;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.repository.ApiPermissionMapRepository;
import com.kiwi.dream.auth.repository.PermissionRepository;
import com.kiwi.dream.auth.repository.RoleRepository;
import com.kiwi.dream.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Idempotent seed data initializer. Runs at startup and only inserts
 * records that do not already exist — safe to restart repeatedly.
 *
 * <p>Seeding order:
 * <ol>
 *   <li>Roles (SUPER_ADMIN, ADMIN, USER)</li>
 *   <li>Permissions (all module:action codes)</li>
 *   <li>Assign baseline permissions to ADMIN role</li>
 *   <li>Super Admin user (from application.properties)</li>
 *   <li>API permission mappings (insert missing + correct wrong permission codes)</li>
 * </ol>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final ApiPermissionMapRepository apiPermissionMapRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.seed.superadmin.email}")
    private String superAdminEmail;

    @Value("${app.seed.superadmin.password}")
    private String superAdminPassword;

    @Value("${app.seed.superadmin.name}")
    private String superAdminName;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        log.info("Running DataInitializer...");

        migrateSchema();
        Map<String, Role> roles = seedRoles();
        Map<String, Permission> permissions = seedPermissions();
        seedAdminRolePermissions(roles.get(SystemRoles.ADMIN), permissions);
        seedSuperAdmin(roles.get(SystemRoles.SUPER_ADMIN));
        seedApiPermissionMaps(permissions);
        correctApiPermissionMaps(permissions);

        log.info("DataInitializer completed.");
    }

    private void migrateSchema() {
        try {
            jdbcTemplate.execute(
                "ALTER TABLE api_permission_map MODIFY permission_id BIGINT NULL"
            );
            log.info("Schema migration: api_permission_map.permission_id set to nullable");
        } catch (Exception e) {
            log.debug("Schema migration skipped (already applied): {}", e.getMessage());
        }
    }

    // ──────────────────────────────────────────────────────────────────────────

    private Map<String, Role> seedRoles() {
        Map<String, Role> result = new HashMap<>();
        seedRole(SystemRoles.SUPER_ADMIN, "Full unrestricted access — bypasses all permission checks", result);
        seedRole(SystemRoles.ADMIN, "Operational staff — access governed by permission assignments", result);
        seedRole(SystemRoles.USER, "Student user — access to own data and public APIs", result);
        return result;
    }

    private void seedRole(String name, String description, Map<String, Role> result) {
        Role role = roleRepository.findByName(name).orElseGet(() -> {
            log.info("Seeding role: {}", name);
            return roleRepository.save(new Role(name, description));
        });
        result.put(name, role);
    }

    private Map<String, Permission> seedPermissions() {
        List<Object[]> definitions = List.of(
                // code, description, module
                // ── User ─────────────────────────────────────────────────────────────
                new Object[]{"user:create",             "Create admin users",                              "user"},
                new Object[]{"user:read",               "Read user profiles",                              "user"},
                new Object[]{"user:update",             "Update user accounts",                            "user"},
                new Object[]{"user:disable",            "Enable or disable user accounts",                 "user"},
                new Object[]{"user:delete",             "Delete user accounts",                            "user"},
                // ── Role & Permission Management ──────────────────────────────────────
                new Object[]{"role:permission-assign",  "Assign permissions to roles",                    "auth"},
                // ── API Map Management ─────────────────────────────────────────────────
                new Object[]{"api-map:manage",          "Create or delete API permission mappings",       "auth"},
                new Object[]{"api-map:toggle",          "Toggle public/active on API permission mappings","auth"}
        );

        Map<String, Permission> result = new HashMap<>();
        for (Object[] def : definitions) {
            String code = (String) def[0];
            Permission permission = permissionRepository.findByCode(code).orElseGet(() -> {
                log.info("Seeding permission: {}", code);
                return permissionRepository.save(new Permission(code, (String) def[1], (String) def[2]));
            });
            result.put(code, permission);
        }
        return result;
    }

    private void seedAdminRolePermissions(Role adminRole, Map<String, Permission> permissions) {
        Set<Permission> baselinePermissions = new HashSet<>(permissions.values());
        baselinePermissions.remove(permissions.get("api-map:manage"));

        boolean changed = false;
        for (Permission permission : baselinePermissions) {
            if (!adminRole.getPermissions().contains(permission)) {
                adminRole.getPermissions().add(permission);
                changed = true;
                log.info("Added missing baseline permission to ADMIN role: {}", permission.getCode());
            }
        }

        if (changed) {
            roleRepository.save(adminRole);
        }
    }

    private void seedSuperAdmin(Role superAdminRole) {
        if (userRepository.existsByEmail(superAdminEmail)) return;

        User superAdmin = new User();
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPasswordHash(passwordEncoder.encode(superAdminPassword));
        superAdmin.setName(superAdminName);
        superAdmin.setAuthProvider(AuthProvider.LOCAL);
        superAdmin.setActive(true);
        superAdmin.setEmailVerified(true);
        superAdmin.getRoles().add(superAdminRole);

        userRepository.save(superAdmin);
        log.info("Super admin seeded: {}", superAdminEmail);
    }

    // ──────────────────────────────────────────────────────────────────────────

    private void seedApiPermissionMaps(Map<String, Permission> permissions) {

        // ── Public routes (is_public = true, no JWT required) ─────────────────
        List<Object[]> publicMappings = List.of(
                new Object[]{"POST", "/api/v1/auth/register",        "Student self-registration"},
                new Object[]{"POST", "/api/v1/auth/login",           "Login — returns token pair"},
                new Object[]{"POST", "/api/v1/auth/refresh",         "Refresh token rotation"},
                new Object[]{"POST", "/api/v1/auth/forgot-password", "Request password reset email"},
                new Object[]{"POST", "/api/v1/auth/reset-password",  "Reset password via token"}
        );

        for (Object[] def : publicMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String description = (String) def[2];
            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;
            apiPermissionMapRepository.save(new ApiPermissionMap(method, pathPattern, description));
            log.info("Seeded public api map: {} {}", method, pathPattern);
        }

        // ── Authenticated-only routes (any valid JWT, no specific permission) ──
        List<Object[]> authOnlyMappings = List.of(
                new Object[]{"POST",  "/api/v1/auth/logout",      "Logout — revoke refresh token"},
                new Object[]{"GET",   "/api/v1/auth/me",          "Get current user profile"},
                new Object[]{"PATCH", "/api/v1/auth/me",          "Update current user profile"},
                new Object[]{"PATCH", "/api/v1/auth/me/password", "Change current user password"}
        );

        for (Object[] def : authOnlyMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String description = (String) def[2];
            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;
            apiPermissionMapRepository.save(ApiPermissionMap.authenticatedOnly(method, pathPattern, description));
            log.info("Seeded authenticated-only api map: {} {}", method, pathPattern);
        }

        // ── Permission-protected routes ────────────────────────────────────────
        List<Object[]> protectedMappings = List.of(
                // ── Users ───────────────────────────────────────────────────────────
                new Object[]{"POST",   "/api/v1/users",              "user:create",            "Create admin user"},
                new Object[]{"GET",    "/api/v1/users",              "user:read",              "List all users"},
                new Object[]{"GET",    "/api/v1/users/admins",       "user:read",              "List admin users"},
                new Object[]{"GET",    "/api/v1/users/regular",      "user:read",              "List regular users"},
                new Object[]{"GET",    "/api/v1/users/**",           "user:read",              "Get user by id"},
                new Object[]{"PATCH",  "/api/v1/users/*/enable",     "user:disable",           "Enable user"},
                new Object[]{"PATCH",  "/api/v1/users/*/disable",    "user:disable",           "Disable user"},
                new Object[]{"DELETE", "/api/v1/users/*",            "user:delete",            "Delete user"},
                new Object[]{"PUT",    "/api/v1/users/*/role",       "role:permission-assign", "Assign user role"},
                // ── Roles ───────────────────────────────────────────────────────────
                new Object[]{"POST",   "/api/v1/roles",              "role:permission-assign", "Create role"},
                new Object[]{"GET",    "/api/v1/roles",              "role:permission-assign", "List roles"},
                new Object[]{"DELETE", "/api/v1/roles/**",           "role:permission-assign", "Delete role"},
                new Object[]{"GET",    "/api/v1/roles/**",           "role:permission-assign", "Get role permissions"},
                new Object[]{"PUT",    "/api/v1/roles/**",           "role:permission-assign", "Assign role permissions"},
                // ── Permissions ─────────────────────────────────────────────────────
                new Object[]{"GET",    "/api/v1/permissions",        "role:permission-assign", "List permissions"},
                new Object[]{"POST",   "/api/v1/permissions",        "api-map:manage",         "Create permission — SUPER_ADMIN only"},
                // ── API Permission Maps: read + toggle (ADMIN) ───────────────────────
                new Object[]{"GET",    "/api/v1/api-permission-maps",    "api-map:toggle",     "List api permission maps"},
                new Object[]{"PATCH",  "/api/v1/api-permission-maps/**", "api-map:toggle",     "Toggle public/active on api map"},
                // ── API Permission Maps: create + delete (SUPER_ADMIN only) ──────────
                new Object[]{"POST",   "/api/v1/api-permission-maps",    "api-map:manage",     "Create api permission map — SUPER_ADMIN only"},
                new Object[]{"DELETE", "/api/v1/api-permission-maps/**", "api-map:manage",     "Delete api permission map — SUPER_ADMIN only"}
        );

        for (Object[] def : protectedMappings) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String permCode = (String) def[2];
            String description = (String) def[3];

            if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)) continue;

            Permission permission = permissions.get(permCode);
            if (permission == null) {
                log.warn("Skipping api map seed for {} {} — permission '{}' not found", method, pathPattern, permCode);
                continue;
            }

            apiPermissionMapRepository.save(new ApiPermissionMap(method, pathPattern, permission, description));
            log.info("Seeded protected api map: {} {} → {}", method, pathPattern, permCode);
        }
    }

    /**
     * Corrects permission codes on already-seeded api_permission_map rows.
     * Runs on every startup — only updates rows where the permission code has changed.
     */
    private void correctApiPermissionMaps(Map<String, Permission> permissions) {
        List<Object[]> corrections = List.of(
                new Object[]{"GET",   "/api/v1/api-permission-maps",     "api-map:toggle"},
                new Object[]{"PATCH", "/api/v1/api-permission-maps/**",  "api-map:toggle"},
                new Object[]{"POST",  "/api/v1/permissions",             "api-map:manage"}
        );

        for (Object[] def : corrections) {
            String method = (String) def[0];
            String pathPattern = (String) def[1];
            String correctCode = (String) def[2];

            apiPermissionMapRepository.findByHttpMethodIgnoreCaseAndPathPattern(method, pathPattern)
                    .ifPresent(map -> {
                        String currentCode = map.getPermission() != null
                                ? map.getPermission().getCode() : null;
                        if (!correctCode.equals(currentCode)) {
                            Permission correctPermission = permissions.get(correctCode);
                            if (correctPermission != null) {
                                map.setPermission(correctPermission);
                                map.setPublic(false);
                                map.setAuthenticatedOnly(false);
                                apiPermissionMapRepository.save(map);
                                log.info("Corrected api map permission: {} {} → {} (was: {})",
                                        method, pathPattern, correctCode, currentCode);
                            }
                        }
                    });
        }
    }
}
