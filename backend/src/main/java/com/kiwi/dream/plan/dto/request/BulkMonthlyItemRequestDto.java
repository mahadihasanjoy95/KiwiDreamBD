package com.kiwi.dream.plan.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Replaces ALL monthly items on a plan in one atomic operation.
 * Used by the admin bulk-edit UI to reorder or replace items without individual calls.
 */
public record BulkMonthlyItemRequestDto(
        @NotNull @Valid List<CreateMonthlyItemRequestDto> items
) {}
