package com.kiwi.dream.city.dto.response;

import com.kiwi.dream.city.entity.SuburbInfo;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public record CityResponseDto(
        String id,
        String countryId,
        String countryCode,
        String code,
        String nameEn,
        String nameBn,
        String taglineEn,
        String taglineBn,
        String shortDescriptionEn,
        String shortDescriptionBn,
        String longDescriptionEn,
        String longDescriptionBn,
        BigDecimal weeklyRangeMinNzd,
        BigDecimal weeklyRangeMaxNzd,
        BigDecimal roomRentHintNzd,
        BigDecimal transportHintNzd,
        BigDecimal groceriesHintNzd,
        Integer costIndex,
        String overallFeelEn,
        String overallFeelBn,
        String iconSvgUrl,
        String colorHex,
        List<String> universities,
        List<SuburbInfo> suburbs,
        List<String> tags,
        Map<String, Double> ratings,
        Integer displayOrder,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
