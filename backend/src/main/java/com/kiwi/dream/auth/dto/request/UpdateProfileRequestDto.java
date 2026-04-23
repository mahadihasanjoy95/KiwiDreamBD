package com.kiwi.dream.auth.dto.request;

import com.kiwi.dream.auth.enums.NzCity;
import com.kiwi.dream.auth.enums.PreferredCurrency;
import com.kiwi.dream.auth.enums.PreferredLanguage;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateProfileRequestDto(

        @Size(max = 255, message = "Name must not exceed 255 characters")
        String name,

        @Size(max = 30, message = "Phone number must not exceed 30 characters")
        String phoneNumber,

        NzCity city,

        LocalDate targetMoveDate,

        BigDecimal currentSavingsBdt,

        BigDecimal monthlyIncomeBdt,

        PreferredCurrency preferredCurrency,

        PreferredLanguage preferredLanguage
) {}
