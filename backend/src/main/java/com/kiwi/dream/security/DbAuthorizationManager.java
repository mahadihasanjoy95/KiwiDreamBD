package com.kiwi.dream.security;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.authorization.AuthorizationResult;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

/**
 * DB-driven authorization manager for Spring Security 7.x.
 *
 * <p>Evaluation order on every request:
 * <ol>
 *   <li>Match against public routes → GRANT immediately, no token needed</li>
 *   <li>Reject unauthenticated requests</li>
 *   <li>Match authenticated-only routes → GRANT with any valid JWT</li>
 *   <li>SUPER_ADMIN role → GRANT unconditionally</li>
 *   <li>Match protected route → check user permission → GRANT or DENY</li>
 *   <li>No matching rule → DENY (fail-closed)</li>
 * </ol>
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DbAuthorizationManager implements AuthorizationManager<RequestAuthorizationContext> {

    private final ApiPermissionCache apiPermissionCache;
    private final UserRepository userRepository;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public AuthorizationResult authorize(
            Supplier<? extends Authentication> authSupplier,
            RequestAuthorizationContext context
    ) {
        String method = context.getRequest().getMethod().toUpperCase();
        String path = context.getRequest().getRequestURI();

        // ── 1. Public routes — grant without any authentication ───────────────
        if (isPublicRoute(method, path)) {
            log.debug("Public route matched: {} {} — granting access", method, path);
            return new AuthorizationDecision(true);
        }

        // ── 2. All remaining routes require a valid authenticated principal ───
        Authentication auth = authSupplier.get();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof UserPrincipal principal)) {
            return new AuthorizationDecision(false);
        }

        // ── 3. Authenticated-only routes — any valid JWT is enough ────────────
        if (isAuthenticatedOnlyRoute(method, path)) {
            log.debug("Authenticated-only route matched: {} {} — granting access", method, path);
            return new AuthorizationDecision(true);
        }

        // ── 4. SUPER_ADMIN bypasses all permission checks ─────────────────────
        Set<String> roleNames = userRepository.findRoleNamesByUserId(principal.getUserId());
        if (roleNames.contains(SystemRoles.SUPER_ADMIN)) {
            return new AuthorizationDecision(true);
        }

        // ── 5. Match protected route → required permission code ───────────────
        String requiredPermission = resolveRequiredPermission(method, path);
        if (requiredPermission == null) {
            log.debug("No permission mapping found for {} {} — denying access", method, path);
            return new AuthorizationDecision(false);
        }

        // ── 6. Check user's role has the required permission ──────────────────
        Set<String> userPermissions = userRepository.findPermissionCodesByUserId(principal.getUserId());
        boolean granted = userPermissions.contains(requiredPermission);

        if (!granted) {
            log.debug("User {} lacks permission '{}' for {} {}",
                    principal.getUserId(), requiredPermission, method, path);
        }

        return new AuthorizationDecision(granted);
    }

    private boolean isPublicRoute(String method, String path) {
        return matchesAny(apiPermissionCache.getPublicRoutes(), method, path);
    }

    private boolean isAuthenticatedOnlyRoute(String method, String path) {
        return matchesAny(apiPermissionCache.getAuthenticatedOnlyRoutes(), method, path);
    }

    private boolean matchesAny(Set<String> keys, String method, String path) {
        for (String key : keys) {
            String[] parts = key.split("::", 2);
            if (parts.length == 2 && parts[0].equalsIgnoreCase(method)) {
                if (antPathMatcher.match(parts[1], path)) {
                    return true;
                }
            }
        }
        return false;
    }

    private String resolveRequiredPermission(String method, String path) {
        Map<String, String> mappings = apiPermissionCache.getAll();
        for (Map.Entry<String, String> entry : mappings.entrySet()) {
            String[] parts = entry.getKey().split("::", 2);
            if (parts.length == 2 && parts[0].equalsIgnoreCase(method)) {
                if (antPathMatcher.match(parts[1], path)) {
                    return entry.getValue();
                }
            }
        }
        return null;
    }
}
