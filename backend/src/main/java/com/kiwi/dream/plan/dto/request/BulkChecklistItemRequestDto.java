package com.kiwi.dream.plan.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record BulkChecklistItemRequestDto(
        @NotNull @Valid List<CreateChecklistItemRequestDto> items
) {}
