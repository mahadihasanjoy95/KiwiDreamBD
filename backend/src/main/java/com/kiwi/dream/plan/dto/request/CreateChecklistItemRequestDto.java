package com.kiwi.dream.plan.dto.request;

import com.kiwi.dream.plan.enums.ChecklistCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateChecklistItemRequestDto(

        @NotNull(message = "Category is required")
        ChecklistCategory category,

        @NotBlank(message = "Item text (EN) is required")
        @Size(max = 500)
        String itemTextEn,

        @Size(max = 1000)
        String itemTextBn,

        String noteEn,
        String noteBn,

        Integer quantity,
        Integer displayOrder
) {}
