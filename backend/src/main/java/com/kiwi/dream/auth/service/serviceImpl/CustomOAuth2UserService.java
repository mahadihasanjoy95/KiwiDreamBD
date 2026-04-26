package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.enums.UserRole;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email    = oAuth2User.getAttribute("email");
        String googleId = oAuth2User.getAttribute("sub");
        String name     = resolveName(oAuth2User);

        User user = findOrCreateUser(email, googleId, name);
        return new CustomOAuth2User(user, oAuth2User.getAttributes());
    }

    private User findOrCreateUser(String email, String googleId, String name) {
        return userRepository.findByEmail(email)
                .map(existing -> {
                    if (existing.getGoogleId() == null) {
                        existing.setGoogleId(googleId);
                        existing.setEmailVerified(true);
                        userRepository.save(existing);
                        log.info("Linked Google account to existing user: {}", email);
                    }
                    return existing;
                })
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email.toLowerCase().trim());
                    newUser.setGoogleId(googleId);
                    newUser.setName(name != null ? name : "User");
                    newUser.setAuthProvider(AuthProvider.GOOGLE);
                    newUser.setRole(UserRole.ROLE_APPLICANT);
                    newUser.setActive(true);
                    newUser.setEmailVerified(true);

                    User saved = userRepository.save(newUser);
                    log.info("Created new user via Google OAuth2: {}", email);
                    return saved;
                });
    }

    private String resolveName(OAuth2User oAuth2User) {
        String given = oAuth2User.getAttribute("given_name");
        if (given != null && !given.isBlank()) return given;
        String name = oAuth2User.getAttribute("name");
        if (name != null && !name.isBlank()) return name;
        return null;
    }
}
