package com.kiwi.dream.plan.service;

import com.kiwi.dream.plan.dto.request.*;
import com.kiwi.dream.plan.dto.response.*;

import java.util.List;

public interface MasterPlanService {

    // ── Public endpoints ──────────────────────────────────────────────────────

    /** All published master plans for public browsing. */
    List<PlanSummaryResponseDto> listPublished();

    /** Full master plan with all sub-resources — public. */
    PlanResponseDto getById(String planId);

    /** Lookup by country+city+profile combo — public, returns null if not found. */
    PlanResponseDto getByCombo(String countryId, String cityId, String planningProfileId);

    // ── Admin endpoints ───────────────────────────────────────────────────────

    List<PlanSummaryResponseDto> listAll();

    PlanResponseDto create(CreateMasterPlanRequestDto dto);

    PlanResponseDto update(String planId, UpdatePlanRequestDto dto);

    PlanResponseDto publish(String planId);

    PlanResponseDto unpublish(String planId);

    void delete(String planId); // SUPER_ADMIN only

    // ── Monthly items ─────────────────────────────────────────────────────────

    MonthlyItemResponseDto addMonthlyItem(String planId, CreateMonthlyItemRequestDto dto);

    MonthlyItemResponseDto updateMonthlyItem(String planId, String itemId, UpdateMonthlyItemRequestDto dto);

    void deleteMonthlyItem(String planId, String itemId);

    List<MonthlyItemResponseDto> bulkReplaceMonthlyItems(String planId, BulkMonthlyItemRequestDto dto);

    // ── Moving cost items ─────────────────────────────────────────────────────

    MovingItemResponseDto addMovingItem(String planId, CreateMovingItemRequestDto dto);

    MovingItemResponseDto updateMovingItem(String planId, String itemId, UpdateMovingItemRequestDto dto);

    void deleteMovingItem(String planId, String itemId);

    List<MovingItemResponseDto> bulkReplaceMovingItems(String planId, BulkMovingItemRequestDto dto);

    // ── Checklist items ───────────────────────────────────────────────────────

    ChecklistItemResponseDto addChecklistItem(String planId, CreateChecklistItemRequestDto dto);

    ChecklistItemResponseDto updateChecklistItem(String planId, String itemId, UpdateChecklistItemRequestDto dto);

    void deleteChecklistItem(String planId, String itemId);

    List<ChecklistItemResponseDto> bulkReplaceChecklistItems(String planId, BulkChecklistItemRequestDto dto);

    // ── Living fund ───────────────────────────────────────────────────────────

    LivingFundResponseDto getLivingFund(String planId);

    LivingFundResponseDto upsertLivingFund(String planId, UpsertLivingFundRequestDto dto);
}
