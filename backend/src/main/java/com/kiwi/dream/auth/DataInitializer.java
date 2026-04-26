package com.kiwi.dream.auth;

import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.enums.UserRole;
import com.kiwi.dream.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Idempotent seed data initializer. Runs at startup.
 * Only creates the super admin user if it does not already exist.
 * Safe to restart repeatedly.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
        seedSuperAdmin();
        log.info("DataInitializer completed.");
    }

    private void seedSuperAdmin() {
        if (userRepository.existsByEmail(superAdminEmail)) {
            log.debug("Super admin already exists — skipping seed.");
            return;
        }

        User superAdmin = new User();
        superAdmin.setEmail(superAdminEmail);
        superAdmin.setPasswordHash(passwordEncoder.encode(superAdminPassword));
        superAdmin.setName(superAdminName);
        superAdmin.setAuthProvider(AuthProvider.LOCAL);
        superAdmin.setRole(UserRole.ROLE_SUPER_ADMIN);
        superAdmin.setActive(true);
        superAdmin.setEmailVerified(true);

        userRepository.save(superAdmin);
        log.info("Super admin seeded: {}", superAdminEmail);
    }
}
