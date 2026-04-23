package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.entity.Role;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.exception.RoleNotFoundException;
import com.kiwi.dream.auth.repository.RoleRepository;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.security.CustomOidcUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles the OIDC user-info step for OIDC-capable providers such as Google
 * when the {@code openid} scope is requested.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService extends OidcUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        String email    = oidcUser.getEmail();
        String googleId = oidcUser.getSubject();
        String name     = resolveName(oidcUser);

        User user = findOrCreateUser(email, googleId, name);
        return new CustomOidcUser(user, oidcUser.getIdToken(), oidcUser.getUserInfo(), oidcUser.getAttributes());
    }

    private User findOrCreateUser(String email, String googleId, String name) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getGoogleId() == null) {
                        existing.setGoogleId(googleId);
                        existing.setEmailVerified(true);
                        userRepository.save(existing);
                        log.info("Linked Google OIDC to existing user: {}", email);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    Role userRole = roleRepository.findByName(SystemRoles.USER)
                            .orElseThrow(() -> new RoleNotFoundException(SystemRoles.USER));

                    User newUser = new User();
                    newUser.setEmail(email.toLowerCase().trim());
                    newUser.setGoogleId(googleId);
                    newUser.setName(name != null ? name : "User");
                    newUser.setAuthProvider(AuthProvider.GOOGLE);
                    newUser.setActive(true);
                    newUser.setEmailVerified(true);
                    newUser.getRoles().add(userRole);

                    User saved = userRepository.save(newUser);
                    log.info("Created new user via Google OIDC: {}", email);
                    return saved;
                });
    }

    private String resolveName(OidcUser oidcUser) {
        String given = oidcUser.getGivenName();
        if (given != null && !given.isBlank()) return given;
        String full = oidcUser.getFullName();
        if (full != null && !full.isBlank()) return full.split(" ")[0];
        return null;
    }
}
