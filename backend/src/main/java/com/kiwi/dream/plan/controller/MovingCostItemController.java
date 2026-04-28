package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.BulkMovingItemRequestDto;
import com.kiwi.dream.plan.dto.request.CreateMovingItemRequestDto;
import com.kiwi.dream.plan.dto.request.UpdateMovingItemRequestDto;
import com.kiwi.dream.plan.dto.response.MovingItemResponseDto;
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
@Tag(name = "Moving Cost Items", description = "One-time moving cost items for master plans (admin) and user plans (applicant)")
public class MovingCostItemController {

    private final MasterPlanService masterPlanService;
    private final UserPlanService userPlanService;

    // ── Admin — master plan items ─────────────────────────────────────────────

    @PostMapping("/api/v1/admin/plans/master/{planId}/moving-items")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Add a moving cost item to a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<MovingItemResponseDto>> adminAdd(
            @PathVariable String planId,
            @Valid @RequestBody CreateMovingItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.addMovingItem(planId, dto)));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/moving-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Update a moving cost item on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<MovingItemResponseDto>> adminUpdate(
            @PathVariable String planId,
            @PathVariable String itemId,
            @Valid @RequestBody UpdateMovingItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.updateMovingItem(planId, itemId, dto)));
    }

    @DeleteMapping("/api/v1/admin/plans/master/{planId}/moving-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete a moving cost item from a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<Void>> adminDelete(
            @PathVariable String planId,
            @PathVariable String itemId) {
        masterPlanService.deleteMovingItem(planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/moving-items/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Bulk replace all moving cost items on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<List<MovingItemResponseDto>>> adminBulk(
            @PathVariable String planId,
            @Valid @RequestBody BulkMovingItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.bulkReplaceMovingItems(planId, dto)));
    }

    // ── Applicant — user plan items ───────────────────────────────────────────

    @GetMapping("/api/v1/me/plans/{planId}/moving-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get moving cost items for my plan")
    public ResponseEntity<CommonApiResponse<List<MovingItemResponseDto>>> userList(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.getMovingItems(user.getUserId(), planId)));
    }

    @PostMapping("/api/v1/me/plans/{planId}/moving-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a custom moving cost item to my plan")
    public ResponseEntity<CommonApiResponse<MovingItemResponseDto>> userAdd(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId,
            @Valid @RequestBody UpdateMovingItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.addMovingItem(user.getUserId(), planId, dto)));
    }

    @PutMapping("/api/v1/me/plans/{planId}/moving-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a moving cost item on my plan")
    public ResponseEntity<CommonApiResponse<MovingItemResponseDto>> userUpdate(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId,
            @PathVariable String itemId,
            @Valid @RequestBody UpdateMovingItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.updateMovingItem(user.getUserId(), planId, itemId, dto)));
    }

    @DeleteMapping("/api/v1/me/plans/{planId}/moving-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a moving cost item from my plan")
    public ResponseEntity<CommonApiResponse<Void>> userDelete(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId,
            @PathVariable String itemId) {
        userPlanService.deleteMovingItem(user.getUserId(), planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }
}
