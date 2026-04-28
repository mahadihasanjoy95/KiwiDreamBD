package com.kiwi.dream.auth.entity;

import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.enums.PreferredCurrency;
import com.kiwi.dream.auth.enums.PreferredLanguage;
import com.kiwi.dream.auth.enums.UserRole;
import com.kiwi.dream.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_google_id", columnList = "google_id"),
        @Index(name = "idx_user_active_role", columnList = "is_active, role")
})
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseAuditableEntity {

    @Id
    @Column(name = "id", columnDefinition = "CHAR(36)", updatable = false, nullable = false)
    private String id;

    @Column(name = "email", unique = true, nullable = false, length = 255)
    private String email;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    /** BCrypt-hashed password. Nullable for Google OAuth2 users. */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "profile_picture", length = 1000)
    private String profilePicture;

    /** Google OAuth2 subject ID ("sub" claim). Null for LOCAL users. */
    @Column(name = "google_id", length = 255)
    private String googleId;

    /**
     * The user's single role. Enforces access control via @PreAuthorize.
     * Defaults to ROLE_APPLICANT for all self-registered users.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role = UserRole.ROLE_APPLICANT;

    @Column(name = "target_move_date")
    private LocalDate targetMoveDate;

    @Column(name = "current_savings_bdt", precision = 15, scale = 2)
    private BigDecimal currentSavingsBdt;

    @Column(name = "monthly_income_bdt", precision = 15, scale = 2)
    private BigDecimal monthlyIncomeBdt;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_currency", nullable = false, length = 5)
    private PreferredCurrency preferredCurrency = PreferredCurrency.NZD;

    @Enumerated(EnumType.STRING)
    @Column(name = "preferred_language", nullable = false, length = 5)
    private PreferredLanguage preferredLanguage = PreferredLanguage.EN;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 10)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
