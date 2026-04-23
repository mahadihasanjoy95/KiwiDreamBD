package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.dto.request.AssignUserRoleRequestDto;
import com.kiwi.dream.auth.dto.request.CreateAdminRequestDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.auth.entity.Role;
import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.exception.*;
import com.kiwi.dream.auth.repository.RefreshTokenRepository;
import com.kiwi.dream.auth.repository.RoleRepository;
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
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthServiceImpl authServiceImpl;

    @Value("${app.admin.url}")
    private String adminUrl;

    @Override
    @Transactional
    public UserResponseDto createAdmin(CreateAdminRequestDto requestDto) {
        if (userRepository.existsByEmail(requestDto.email())) {
            throw new UserAlreadyExistsException("An account with email '" + requestDto.email() + "' already exists");
        }

        String roleName = requestDto.effectiveRole();

        if (SystemRoles.isReserved(roleName)) {
            throw new InvalidAssignableRoleException(roleName);
        }

        Role adminRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RoleNotFoundException(roleName));

        String temporaryPassword = generateSecurePassword();

        User user = new User();
        user.setName(requestDto.name().trim());
        user.setEmail(requestDto.email().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setActive(true);
        user.setEmailVerified(true);
        user.getRoles().add(adminRole);

        User saved = userRepository.save(user);
        log.info("New admin created: {}", saved.getEmail());

        emailService.send(EmailRequest.of(
                saved.getEmail(),
                EmailTemplate.ADMIN_INVITE,
                Map.of(
                        "name",              saved.getName(),
                        "email",             saved.getEmail(),
                        "temporaryPassword", temporaryPassword,
                        "loginUrl",          adminUrl + "/login"
                )
        ));

        return authServiceImpl.toUserResponse(saved);
    }

    private String generateSecurePassword() {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
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
        Page<UserResponseDto> page = userRepository.findAllByRoles_Name(SystemRoles.ADMIN, pageable)
                .map(authServiceImpl::toUserResponse);
        return PageResponse.from(page);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserResponseDto> listRegularUsers(Pageable pageable) {
        Page<UserResponseDto> page = userRepository.findAllByRoles_Name(SystemRoles.USER, pageable)
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
        assertRoleIsAssignable(requestDto.role());

        Role role = roleRepository.findByName(requestDto.role())
                .orElseThrow(() -> new RoleNotFoundException(requestDto.role()));

        // Enforce single-role: clear existing roles before assigning
        user.getRoles().clear();
        user.getRoles().add(role);

        // Revoke all active refresh tokens — user must re-authenticate with new role
        refreshTokenRepository.revokeAllByUserId(userId);

        User saved = userRepository.save(user);
        log.info("Role {} assigned to user {}", requestDto.role(), userId);
        return authServiceImpl.toUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponseDto enableUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        assertNotSuperAdmin(user);
        user.setActive(true);
        return authServiceImpl.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDto disableUser(String userId) {
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
        boolean isSuperAdmin = user.getRoles().stream()
                .anyMatch(role -> SystemRoles.SUPER_ADMIN.equals(role.getName()));
        if (isSuperAdmin) {
            throw new ProtectedSuperAdminOperationException();
        }
    }

    private void assertRoleIsAssignable(String roleName) {
        if (SystemRoles.isReserved(roleName)) {
            throw new InvalidAssignableRoleException(roleName);
        }
    }
}
