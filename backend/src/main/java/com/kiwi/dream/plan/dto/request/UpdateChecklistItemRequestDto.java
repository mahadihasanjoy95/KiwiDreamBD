package com.kiwi.dream.plan.dto.request;

import com.kiwi.dream.plan.enums.ChecklistCategory;
import jakarta.validation.constraints.Size;

public record UpdateChecklistItemRequestDto(
        ChecklistCategory category,
        @Size(max = 500) String itemTextEn,
        @Size(max = 1000) String itemTextBn,
        @Size(max = 500) String customItemText,
        String noteEn,
        String noteBn,
        String customNote,
        Integer quantity,
        Integer displayOrder
) {}
