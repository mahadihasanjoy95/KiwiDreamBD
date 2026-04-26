package com.kiwi.dream.plan.dto.response;

import java.time.Instant;

public record PlanArchiveResponseDto(
        String id,
        String planId,
        String displayPlanName,
        String userId,
        Instant archivedAt,
        /** Raw JSON snapshot of the full plan state at archive time. */
        String snapshotJson
) {}
