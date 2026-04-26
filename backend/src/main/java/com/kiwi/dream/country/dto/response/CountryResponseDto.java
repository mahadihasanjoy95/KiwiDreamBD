package com.kiwi.dream.country.dto.response;

import java.time.Instant;

public record CountryResponseDto(
        String id,
        String code,
        String nameEn,
        String nameBn,
        String flagEmoji,
        String flagImageUrl,
        String colorHex,
        String currencyCode,
        String descriptionEn,
        String descriptionBn,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
