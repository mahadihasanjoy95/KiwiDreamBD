package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.entity.AdminInviteToken;
import com.kiwi.dream.auth.dto.request.AssignUserRoleRequestDto;
import com.kiwi.dream.auth.dto.request.CreateAdminRequestDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.enums.UserRole;
import com.kiwi.dream.auth.exception.AdminInviteTokenExpiredException;
import com.kiwi.dream.auth.exception.AdminInviteTokenNotFoundException;
import com.kiwi.dream.auth.exception.ProtectedSuperAdminOperationException;
import com.kiwi.dream.auth.exception.UserAlreadyExistsException;
import com.kiwi.dream.auth.exception.UserNotFoundException;
import com.kiwi.dream.auth.repository.AdminInviteTokenRepository;
import com.kiwi.dream.auth.repository.RefreshTokenRepository;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.auth.service.UserService;
import com.kiwi.dream.common.email.EmailRequest;
import com.kiwi.dream.common.email.EmailService;
import com.kiwi.dream.common.email.EmailTemplate;
import com.kiwi.dream.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AdminInviteTokenRepository adminInviteTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthServiceImpl authServiceImpl;

    @Value("${app.admin.url}")
    private String adminUrl;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWERCASE = "abcdefghjkmnpqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SYMBOLS = "!@#$%";
    private static final String PASSWORD_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;
    private static final long ADMIN_INVITE_EXPIRY_SECONDS = 604800L;

    @Override
    @Transactional
    public UserResponseDto createAdmin(CreateAdminRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new UserAlreadyExistsException("An account with email '" + requestDto.email() + "' already exists");
        }

        String temporaryPassword = generateSecurePassword();

        User user = new User();
        user.setName(requestDto.name().trim());
        user.setEmail(requestDto.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setRole(UserRole.ROLE_ADMIN);
        user.setActive(false);
        user.setEmailVerified(false);

        User saved = userRepository.save(user);
        log.info("New admin created: {}", saved.getEmail());

        String inviteToken = UUID.randomUUID().toString();
        Instant expiresAt = Instant.now().plusSeconds(ADMIN_INVITE_EXPIRY_SECONDS);
        adminInviteTokenRepository.save(new AdminInviteToken(inviteToken, saved, expiresAt));
        String activationUrl = frontendUrl + "/admin/activate?token=" + inviteToken;

        emailService.send(EmailRequest.of(
                saved.getEmail(),
                EmailTemplate.ADMIN_INVITE,
                Map.of(
                        "name",              saved.getName(),
                        "email",             saved.getEmail(),
                        "temporaryPassword", temporaryPassword,
                        "activationUrl",      activationUrl,
                        "loginUrl",          frontendUrl + "/signin",
                        "adminPanelUrl",     adminUrl,
                        "websiteUrl",        frontendUrl
                )
        ));

        return authServiceImpl.toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponseDto activateAdminInvite(String token) {
        AdminInviteToken inviteToken = adminInviteTokenRepository
                .findByToken(token)
                .orElseThrow(AdminInviteTokenNotFoundException::new);

        if (inviteToken.isUsed()) {
            throw new AdminInviteTokenNotFoundException();
        }

        if (inviteToken.getExpiresAt().isBefore(Instant.now())) {
            throw new AdminInviteTokenExpiredException();
        }

        User user = inviteToken.getUser();
        if (user.getRole() != UserRole.ROLE_ADMIN && user.getRole() != UserRole.ROLE_SUPER_ADMIN) {
            throw new AdminInviteTokenNotFoundException();
        }

        user.setActive(true);
        user.setEmailVerified(true);
        User saved = userRepository.save(user);

        inviteToken.setUsed(true);
        adminInviteTokenRepository.save(inviteToken);
        log.info("Admin invite activated for user: {}", saved.getEmail());

        return authServiceImpl.toUserResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findAll(pageable)
                .map(authServiceImpl::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listAdminUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findByRole(UserRole.ROLE_ADMIN, pageable)
                .map(authServiceImpl::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listRegularUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findByRole(UserRole.ROLE_APPLICANT, pageable)
                .map(authServiceImpl::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return authServiceImpl.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponseDto assignRole(String userId, AssignUserRoleRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        assertNotSuperAdmin(user);

        // Prevent promoting anyone to SUPER_ADMIN via this endpoint
        if (requestDto.role() == UserRole.ROLE_SUPER_ADMIN) {
            throw new ProtectedSuperAdminOperationException();
        }

        user.setRole(requestDto.role());

        // Revoke all active refresh tokens — user must re-authenticate with new role
        refreshTokenRepository.revokeAllByUserId(userId);

        User saved = userRepository.save(user);
        log.info("Role {} assigned to user {}", requestDto.role(), userId);
        return authServiceImpl.toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponseDto activateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertNotSuperAdmin(user);
        user.setActive(true);
        return authServiceImpl.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDto deactivateUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertNotSuperAdmin(user);
        user.setActive(false);
        refreshTokenRepository.revokeAllByUserId(userId);
        return authServiceImpl.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertNotSuperAdmin(user);
        refreshTokenRepository.deleteAllByUserId(userId);
        userRepository.delete(user);
        log.info("Deleted user {}", userId);
    }

    // ──────────────────────────────────────────────────────────────────────────

    private void assertNotSuperAdmin(User user) {
        if (user.getRole() == UserRole.ROLE_SUPER_ADMIN) {
            throw new ProtectedSuperAdminOperationException();
        }
    }

    private String generateSecurePassword() {
        List<Character> chars = new ArrayList<>();
        chars.add(randomChar(UPPERCASE));
        chars.add(randomChar(LOWERCASE));
        chars.add(randomChar(DIGITS));
        chars.add(randomChar(SYMBOLS));

        for (int i = chars.size(); i < 14; i++) {
            chars.add(randomChar(PASSWORD_CHARS));
        }

        Collections.shuffle(chars, SECURE_RANDOM);
        StringBuilder password = new StringBuilder(chars.size());
        for (Character character : chars) {
            password.append(character);
        }
        return password.toString();
    }

    private char randomChar(String source) {
        return source.charAt(SECURE_RANDOM.nextInt(source.length()));
    }
}
