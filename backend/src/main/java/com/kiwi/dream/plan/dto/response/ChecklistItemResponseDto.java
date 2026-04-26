package com.kiwi.dream.plan.dto.response;

import com.kiwi.dream.plan.enums.ChecklistCategory;

import java.time.Instant;

public record ChecklistItemResponseDto(
        String id,
        String planId,
        ChecklistCategory category,
        String itemTextEn,
        String itemTextBn,
        String customItemText,
        int quantity,
        boolean done,
        Instant completedAt,
        String noteEn,
        String noteBn,
        String customNote,
        boolean custom,
        int displayOrder
) {}
