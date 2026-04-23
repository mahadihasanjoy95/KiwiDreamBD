package com.kiwi.dream.auth.dto.response;

import com.kiwi.dream.auth.enums.AuthProvider;
import com.kiwi.dream.auth.enums.NzCity;
import com.kiwi.dream.auth.enums.PreferredCurrency;
import com.kiwi.dream.auth.enums.PreferredLanguage;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;

public record UserResponseDto(
        String id,
        String email,
        String name,
        String phoneNumber,
        String profilePicture,
        NzCity city,
        LocalDate targetMoveDate,
        BigDecimal currentSavingsBdt,
        BigDecimal monthlyIncomeBdt,
        PreferredCurrency preferredCurrency,
        PreferredLanguage preferredLanguage,
        AuthProvider authProvider,
        boolean emailVerified,
        boolean isActive,
        Set<String> roles,
        Instant createdAt,
        /** true when the user has a BCrypt password hash set (false for Google-only accounts) */
        boolean hasPassword
) {}
