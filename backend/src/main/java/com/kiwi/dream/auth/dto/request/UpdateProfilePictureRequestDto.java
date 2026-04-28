package com.kiwi.dream.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfilePictureRequestDto(

        @NotBlank(message = "Picture URL is required")
        @Size(max = 1000, message = "Picture URL must not exceed 1000 characters")
        String pictureUrl
) {}
