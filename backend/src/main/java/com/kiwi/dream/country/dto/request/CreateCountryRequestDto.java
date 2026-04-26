package com.kiwi.dream.country.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCountryRequestDto(

        @NotBlank(message = "Country code is required")
        @Size(max = 10, message = "Country code must not exceed 10 characters")
        String code,

        @NotBlank(message = "English name is required")
        @Size(max = 100, message = "English name must not exceed 100 characters")
        String nameEn,

        @NotBlank(message = "Bengali name is required")
        @Size(max = 200, message = "Bengali name must not exceed 200 characters")
        String nameBn,

        @NotBlank(message = "Currency code is required")
        @Size(max = 5, message = "Currency code must not exceed 5 characters")
        String currencyCode,

        @Size(max = 10, message = "Flag emoji must not exceed 10 characters")
        String flagEmoji,

        @Size(max = 1000, message = "Flag image URL must not exceed 1000 characters")
        String flagImageUrl,

        @Size(max = 7, message = "Color hex must not exceed 7 characters")
        String colorHex,

        String descriptionEn,

        String descriptionBn,

        Integer displayOrder
) {}
