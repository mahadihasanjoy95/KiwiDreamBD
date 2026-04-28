package com.kiwi.dream.plan.service;

import com.kiwi.dream.plan.dto.request.*;
import com.kiwi.dream.plan.dto.response.*;

import java.util.List;

public interface UserPlanService {

    // ── Plan-level operations ─────────────────────────────────────────────────

    List<PlanSummaryResponseDto> listMyPlans(String userId, String status);

    PlanResponseDto getMyPlan(String userId, String planId);

    /** Returns the user's existing active plan for a city+profile combo, or null if none. */
    PlanResponseDto getPlanByCombo(String userId, String cityId, String planningProfileId);

    PlanResponseDto createFromMaster(String userId, CreateUserPlanFromMasterRequestDto dto);

    PlanResponseDto updatePlan(String userId, String planId, UpdatePlanRequestDto dto);

    void archivePlan(String userId, String planId);

    void deletePlan(String userId, String planId);

    List<PlanArchiveResponseDto> listArchives(String userId);

    // ── Monthly items ─────────────────────────────────────────────────────────

    List<MonthlyItemResponseDto> getMonthlyItems(String userId, String planId);

    MonthlyItemResponseDto addMonthlyItem(String userId, String planId, UpdateMonthlyItemRequestDto dto);

    MonthlyItemResponseDto updateMonthlyItem(String userId, String planId, String itemId, UpdateMonthlyItemRequestDto dto);

    void deleteMonthlyItem(String userId, String planId, String itemId);

    // ── Moving cost items ─────────────────────────────────────────────────────

    List<MovingItemResponseDto> getMovingItems(String userId, String planId);

    MovingItemResponseDto addMovingItem(String userId, String planId, UpdateMovingItemRequestDto dto);

    MovingItemResponseDto updateMovingItem(String userId, String planId, String itemId, UpdateMovingItemRequestDto dto);

    void deleteMovingItem(String userId, String planId, String itemId);

    // ── Checklist items ───────────────────────────────────────────────────────

    List<ChecklistItemResponseDto> getChecklistItems(String userId, String planId);

    ChecklistItemResponseDto addChecklistItem(String userId, String planId, UpdateChecklistItemRequestDto dto);

    ChecklistItemResponseDto updateChecklistItem(String userId, String planId, String itemId, UpdateChecklistItemRequestDto dto);

    void deleteChecklistItem(String userId, String planId, String itemId);

    ChecklistItemResponseDto toggleChecklistItem(String userId, String planId, String itemId);

    // ── Living fund ───────────────────────────────────────────────────────────

    LivingFundResponseDto getLivingFund(String userId, String planId);

    LivingFundResponseDto upsertLivingFund(String userId, String planId, UpsertLivingFundRequestDto dto);
}
