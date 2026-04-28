package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.BulkChecklistItemRequestDto;
import com.kiwi.dream.plan.dto.request.CreateChecklistItemRequestDto;
import com.kiwi.dream.plan.dto.request.UpdateChecklistItemRequestDto;
import com.kiwi.dream.plan.dto.response.ChecklistItemResponseDto;
import com.kiwi.dream.plan.service.MasterPlanService;
import com.kiwi.dream.plan.service.UserPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.kiwi.dream.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Checklist Items", description = "Pre-departure checklist for master plans (admin) and user plans (applicant)")
public class ChecklistItemController {

    private final MasterPlanService masterPlanService;
    private final UserPlanService userPlanService;

    // ── Admin ─────────────────────────────────────────────────────────────────

    @PostMapping("/api/v1/admin/plans/master/{planId}/checklist-items")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Add checklist item to a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<ChecklistItemResponseDto>> adminAdd(
            @PathVariable String planId, @Valid @RequestBody CreateChecklistItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.addChecklistItem(planId, dto)));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/checklist-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Update a checklist item on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<ChecklistItemResponseDto>> adminUpdate(
            @PathVariable String planId, @PathVariable String itemId,
            @Valid @RequestBody UpdateChecklistItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.updateChecklistItem(planId, itemId, dto)));
    }

    @DeleteMapping("/api/v1/admin/plans/master/{planId}/checklist-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete a checklist item from a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<Void>> adminDelete(
            @PathVariable String planId, @PathVariable String itemId) {
        masterPlanService.deleteChecklistItem(planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/checklist-items/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Bulk replace all checklist items on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<List<ChecklistItemResponseDto>>> adminBulk(
            @PathVariable String planId, @Valid @RequestBody BulkChecklistItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.bulkReplaceChecklistItems(planId, dto)));
    }

    // ── Applicant ─────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/me/plans/{planId}/checklist-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get checklist items for my plan")
    public ResponseEntity<CommonApiResponse<List<ChecklistItemResponseDto>>> userList(
            @AuthenticationPrincipal UserPrincipal user, @PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.getChecklistItems(user.getUserId(), planId)));
    }

    @PostMapping("/api/v1/me/plans/{planId}/checklist-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a custom checklist item to my plan")
    public ResponseEntity<CommonApiResponse<ChecklistItemResponseDto>> userAdd(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @Valid @RequestBody UpdateChecklistItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.addChecklistItem(user.getUserId(), planId, dto)));
    }

    @PutMapping("/api/v1/me/plans/{planId}/checklist-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a checklist item on my plan")
    public ResponseEntity<CommonApiResponse<ChecklistItemResponseDto>> userUpdate(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @PathVariable String itemId,
            @Valid @RequestBody UpdateChecklistItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.updateChecklistItem(user.getUserId(), planId, itemId, dto)));
    }

    @PatchMapping("/api/v1/me/plans/{planId}/checklist-items/{itemId}/toggle")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Toggle a checklist item done/undone")
    public ResponseEntity<CommonApiResponse<ChecklistItemResponseDto>> toggle(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @PathVariable String itemId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.toggleChecklistItem(user.getUserId(), planId, itemId)));
    }

    @DeleteMapping("/api/v1/me/plans/{planId}/checklist-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a checklist item from my plan")
    public ResponseEntity<CommonApiResponse<Void>> userDelete(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @PathVariable String itemId) {
        userPlanService.deleteChecklistItem(user.getUserId(), planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }
}
