package com.kiwi.dream.security;

import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT authentication filter — runs once per request.
 *
 * Flow:
 *  1. Extract Bearer token from Authorization header
 *  2. Validate JWT signature and confirm it is an access token
 *  3. Load user from DB — verify account is active
 *  4. Set UserPrincipal (with role) + GrantedAuthority in SecurityContextHolder
 *     so that @PreAuthorize can evaluate role checks without extra DB calls
 *
 * Invalid or missing tokens are silently ignored — unauthenticated requests
 * to protected endpoints are rejected by SecurityConfig or @PreAuthorize.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());

        try {
            Claims claims = jwtService.parse(token);

            if (!jwtService.isAccessToken(claims)) {
                log.debug("Rejected non-access token type on request to {}", request.getRequestURI());
                filterChain.doFilter(request, response);
                return;
            }

            String userId = jwtService.extractUserId(claims);
            String email  = jwtService.extractEmail(claims);

            User user = userRepository.findById(userId).orElse(null);
            if (user == null || !user.isActive()) {
                log.debug("User {} not found or inactive — rejecting token", userId);
                filterChain.doFilter(request, response);
                return;
            }

            UserPrincipal principal = new UserPrincipal(userId, email, user.getRole());

            // Set the role as a GrantedAuthority so @PreAuthorize("hasRole('ADMIN')") works
            var authority = new SimpleGrantedAuthority(user.getRole().name());

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, List.of(authority));
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (JwtException ex) {
            log.debug("Invalid JWT on request to {}: {}", request.getRequestURI(), ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
