package com.kiwi.dream.common.config;

import com.kiwi.dream.auth.oauth2.OAuth2FailureHandler;
import com.kiwi.dream.auth.oauth2.OAuth2SuccessHandler;
import com.kiwi.dream.auth.service.serviceImpl.CustomOAuth2UserService;
import com.kiwi.dream.auth.service.serviceImpl.CustomOidcUserService;
import com.kiwi.dream.security.JwtAuthFilter;
import com.kiwi.dream.security.UserPrincipal;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity          // enables @PreAuthorize on controllers
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOidcUserService customOidcUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final OAuth2FailureHandler oAuth2FailureHandler;

    /** Swagger, actuator, OAuth2 callback infrastructure — always public. */
    private static final String[] INFRA_PUBLIC = {
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/actuator/**",
            "/oauth2/**",
            "/login/oauth2/**"
    };

    /**
     * Auth endpoints — public (no JWT required).
     * Protected auth endpoints (/logout, /me) require authentication and are
     * secured by the authenticated() rule below.
     */
    private static final String[] AUTH_PUBLIC = {
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/refresh",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password"
    };

    /**
     * Public read endpoints — any visitor can browse countries, cities,
     * planning profiles, master plans, news, exchange rate.
     */
    private static final String[] BUSINESS_PUBLIC = {
            "/api/v1/countries",
            "/api/v1/countries/**",
            "/api/v1/planning-profiles",
            "/api/v1/planning-profiles/**",
            "/api/v1/plans/master",
            "/api/v1/plans/master/**",
            "/api/v1/news",
            "/api/v1/news/**",
            "/api/v1/settings/exchange-rate"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                // IF_REQUIRED allows Spring Security to create a short-lived session only
                // during the OAuth2 redirect round-trip. All regular API calls are stateless.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(INFRA_PUBLIC).permitAll()
                        .requestMatchers(AUTH_PUBLIC).permitAll()
                        .requestMatchers(BUSINESS_PUBLIC).permitAll()
                        // All other endpoints require a valid JWT.
                        // Fine-grained role checks are done via @PreAuthorize on controllers.
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                                .oidcUserService(customOidcUserService)
                        )
                        .successHandler(oAuth2SuccessHandler)
                        .failureHandler(oAuth2FailureHandler)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"UNAUTHORIZED","message":"Authentication required"}}"""
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                            response.getWriter().write(
                                    """
                                    {"success":false,"error":{"code":"FORBIDDEN","message":"You do not have permission to access this resource"}}"""
                            );
                        })
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /** Supplies current authenticated user email for JPA @CreatedBy / @LastModifiedBy. */
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return Optional.of("system");
            }
            if (auth.getPrincipal() instanceof UserPrincipal principal) {
                return Optional.of(principal.getEmail());
            }
            return Optional.of("system");
        };
    }
}
