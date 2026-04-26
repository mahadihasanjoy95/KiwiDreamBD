package com.kiwi.dream.city.dto.request;

import com.kiwi.dream.city.entity.SuburbInfo;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * All fields optional — null means "no change".
 * Code is immutable after creation.
 */
public record UpdateCityRequestDto(

        @Size(max = 150, message = "English name must not exceed 150 characters")
        String nameEn,

        @Size(max = 300, message = "Bengali name must not exceed 300 characters")
        String nameBn,

        @Size(max = 255, message = "English tagline must not exceed 255 characters")
        String taglineEn,

        @Size(max = 500, message = "Bengali tagline must not exceed 500 characters")
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

        /** Normalised cost index vs NZ average (100). Null means no change. */
        Integer costIndex,

        String overallFeelEn,
        String overallFeelBn,

        @Size(max = 1000, message = "Icon SVG URL must not exceed 1000 characters")
        String iconSvgUrl,

        @Size(max = 7, message = "Color hex must not exceed 7 characters")
        String colorHex,

        List<String> universities,
        List<SuburbInfo> suburbs,
        List<String> tags,
        Map<String, Double> ratings,

        Integer displayOrder
) {}
