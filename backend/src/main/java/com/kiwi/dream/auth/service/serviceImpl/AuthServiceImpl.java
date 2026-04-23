package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.dto.request.*;
import com.kiwi.dream.auth.dto.response.ForgotPasswordResponseDto;
import com.kiwi.dream.auth.dto.response.TokenResponseDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.auth.entity.PasswordResetToken;
import com.kiwi.dream.auth.entity.RefreshToken;
import com.kiwi.dream.auth.entity.Role;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.exception.*;
import com.kiwi.dream.auth.repository.PasswordResetTokenRepository;
import com.kiwi.dream.auth.repository.RefreshTokenRepository;
import com.kiwi.dream.auth.repository.RoleRepository;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.auth.service.AuthService;
import com.kiwi.dream.common.email.EmailRequest;
import com.kiwi.dream.common.email.EmailService;
import com.kiwi.dream.common.email.EmailTemplate;
import com.kiwi.dream.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /** Password reset tokens expire after 1 hour. */
    private static final long RESET_TOKEN_EXPIRY_SECONDS = 3600L;

    @Override
    @Transactional
    public UserResponseDto register(RegisterRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new UserAlreadyExistsException("An account with email '" + requestDto.email() + "' already exists");
        }

        Role userRole = roleRepository.findByName(SystemRoles.USER)
                .orElseThrow(() -> new RoleNotFoundException(SystemRoles.USER));

        User user = new User();
        user.setName(requestDto.name().trim());
        user.setEmail(requestDto.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(requestDto.password()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setActive(true);
        user.getRoles().add(userRole);

        User saved = userRepository.save(user);
        log.info("New user registered: {}", saved.getEmail());
        return toUserResponse(saved);
    }

    @Override
    @Transactional
    public TokenResponseDto login(LoginRequestDto requestDto) {
        User user = userRepository.findByEmail(requestDto.email().toLowerCase().trim())
                .orElseThrow(InvalidCredentialsException::new);

        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }

        // Google-only accounts have no password — direct them to OAuth2
        if (user.getPasswordHash() == null) {
            throw new GoogleSignInRequiredException();
        }

        if (!passwordEncoder.matches(requestDto.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        return issueTokenPair(user);
    }

    @Override
    @Transactional
    public TokenResponseDto refresh(RefreshTokenRequestDto requestDto) {
        RefreshToken stored = refreshTokenRepository.findByToken(requestDto.refreshToken())
                .orElseThrow(TokenRevokedException::new);

        if (stored.isRevoked()) {
            throw new TokenRevokedException();
        }

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            throw new TokenExpiredException();
        }

        try {
            Claims claims = jwtService.parse(requestDto.refreshToken());
            if (!jwtService.isRefreshToken(claims)) {
                throw new TokenRevokedException();
            }
        } catch (JwtException ex) {
            throw new TokenRevokedException();
        }

        User user = stored.getUser();
        if (!user.isActive()) {
            throw new InvalidCredentialsException();
        }

        // Rotate: revoke old token
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return issueTokenPair(user);
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto me(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponseDto updateMe(String userId, UpdateProfileRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (requestDto.name() != null && !requestDto.name().isBlank()) {
            user.setName(requestDto.name().trim());
        }
        if (requestDto.phoneNumber() != null) {
            user.setPhoneNumber(requestDto.phoneNumber().isBlank() ? null : requestDto.phoneNumber().trim());
        }
        if (requestDto.city() != null) {
            user.setCity(requestDto.city());
        }
        if (requestDto.targetMoveDate() != null) {
            user.setTargetMoveDate(requestDto.targetMoveDate());
        }
        if (requestDto.currentSavingsBdt() != null) {
            user.setCurrentSavingsBdt(requestDto.currentSavingsBdt());
        }
        if (requestDto.monthlyIncomeBdt() != null) {
            user.setMonthlyIncomeBdt(requestDto.monthlyIncomeBdt());
        }
        if (requestDto.preferredCurrency() != null) {
            user.setPreferredCurrency(requestDto.preferredCurrency());
        }
        if (requestDto.preferredLanguage() != null) {
            user.setPreferredLanguage(requestDto.preferredLanguage());
        }

        return toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(String userId, ChangePasswordRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        // For Google-only users, skip current-password check — first time setting a password
        if (user.getPasswordHash() != null) {
            if (requestDto.currentPassword() == null || requestDto.currentPassword().isBlank()) {
                throw new InvalidCredentialsException();
            }
            if (!passwordEncoder.matches(requestDto.currentPassword(), user.getPasswordHash())) {
                throw new InvalidCredentialsException();
            }
        }

        user.setPasswordHash(passwordEncoder.encode(requestDto.newPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public ForgotPasswordResponseDto forgotPassword(ForgotPasswordRequestDto requestDto) {
        String email = requestDto.email().toLowerCase().trim();

        var userOpt = userRepository.findByEmail(email);

        // Unknown email — return generic success to prevent enumeration
        if (userOpt.isEmpty()) {
            log.debug("Forgot-password: email not found (not disclosed to caller): {}", email);
            return ForgotPasswordResponseDto.emailSent();
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return ForgotPasswordResponseDto.emailSent();
        }

        // Google-only account — send social login reminder
        if (user.getPasswordHash() == null) {
            emailService.send(EmailRequest.of(
                    user.getEmail(),
                    EmailTemplate.SOCIAL_LOGIN_REMINDER,
                    Map.of(
                            "name",     user.getName(),
                            "email",    user.getEmail(),
                            "loginUrl", frontendUrl + "/login"
                    )
            ));
            log.info("Social login reminder sent to Google-only account: {}", email);
            return ForgotPasswordResponseDto.socialAccount();
        }

        // Normal user — generate reset token and send reset-link email
        passwordResetTokenRepository.deleteByUserId(user.getId());

        String tokenValue = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(RESET_TOKEN_EXPIRY_SECONDS);
        passwordResetTokenRepository.save(new PasswordResetToken(tokenValue, user, expiresAt));

        String resetUrl = frontendUrl + "/reset-password?token=" + tokenValue;

        emailService.send(EmailRequest.of(
                user.getEmail(),
                EmailTemplate.PASSWORD_RESET,
                Map.of(
                        "name",     user.getName(),
                        "resetUrl", resetUrl
                )
        ));

        log.info("Password reset email sent to: {}", email);
        return ForgotPasswordResponseDto.emailSent();
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDto requestDto) {
        PasswordResetToken prt = passwordResetTokenRepository
                .findByToken(requestDto.token())
                .orElseThrow(PasswordResetTokenNotFoundException::new);

        if (prt.isUsed()) {
            throw new PasswordResetTokenNotFoundException();
        }

        if (prt.getExpiresAt().isBefore(Instant.now())) {
            throw new PasswordResetTokenExpiredException();
        }

        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(requestDto.newPassword()));
        userRepository.save(user);

        prt.setUsed(true);
        passwordResetTokenRepository.save(prt);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }

    // ──────────────────────────────────────────────────────────────────────────

    private TokenResponseDto issueTokenPair(User user) {
        String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail());
        String refreshTokenValue = jwtService.generateRefreshToken(user.getId(), user.getEmail());

        Instant expiresAt = Instant.now().plusSeconds(jwtService.getRefreshTokenExpirySeconds());
        refreshTokenRepository.save(new RefreshToken(refreshTokenValue, user, expiresAt));

        return TokenResponseDto.of(accessToken, refreshTokenValue, jwtService.getAccessTokenExpirySeconds());
    }

    UserResponseDto toUserResponse(User user) {
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPhoneNumber(),
                user.getProfilePicture(),
                user.getCity(),
                user.getTargetMoveDate(),
                user.getCurrentSavingsBdt(),
                user.getMonthlyIncomeBdt(),
                user.getPreferredCurrency(),
                user.getPreferredLanguage(),
                user.getAuthProvider(),
                user.isEmailVerified(),
                user.isActive(),
                roleNames,
                user.getCreatedAt(),
                user.getPasswordHash() != null
        );
    }
}
