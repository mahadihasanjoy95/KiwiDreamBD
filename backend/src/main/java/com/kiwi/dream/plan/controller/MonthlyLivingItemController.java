package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.BulkMonthlyItemRequestDto;
import com.kiwi.dream.plan.dto.request.CreateMonthlyItemRequestDto;
import com.kiwi.dream.plan.dto.request.UpdateMonthlyItemRequestDto;
import com.kiwi.dream.plan.dto.response.MonthlyItemResponseDto;
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
@Tag(name = "Monthly Living Items", description = "Monthly cost items for master plans (admin) and user plans (applicant)")
public class MonthlyLivingItemController {

    private final MasterPlanService masterPlanService;
    private final UserPlanService userPlanService;

    // ── Admin — master plan items ─────────────────────────────────────────────

    @PostMapping("/api/v1/admin/plans/master/{planId}/monthly-items")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Add monthly item to a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<MonthlyItemResponseDto>> adminAdd(
            @PathVariable String planId, @Valid @RequestBody CreateMonthlyItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.addMonthlyItem(planId, dto)));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/monthly-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Update a monthly item on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<MonthlyItemResponseDto>> adminUpdate(
            @PathVariable String planId, @PathVariable String itemId,
            @Valid @RequestBody UpdateMonthlyItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.updateMonthlyItem(planId, itemId, dto)));
    }

    @DeleteMapping("/api/v1/admin/plans/master/{planId}/monthly-items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Delete a monthly item from a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<Void>> adminDelete(
            @PathVariable String planId, @PathVariable String itemId) {
        masterPlanService.deleteMonthlyItem(planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/monthly-items/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Bulk replace all monthly items on a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<List<MonthlyItemResponseDto>>> adminBulk(
            @PathVariable String planId, @Valid @RequestBody BulkMonthlyItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.bulkReplaceMonthlyItems(planId, dto)));
    }

    // ── Applicant — user plan items ───────────────────────────────────────────

    @GetMapping("/api/v1/me/plans/{planId}/monthly-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get monthly items for my plan")
    public ResponseEntity<CommonApiResponse<List<MonthlyItemResponseDto>>> userList(
            @AuthenticationPrincipal UserPrincipal user, @PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.getMonthlyItems(user.getUserId(), planId)));
    }

    @PostMapping("/api/v1/me/plans/{planId}/monthly-items")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Add a custom monthly item to my plan")
    public ResponseEntity<CommonApiResponse<MonthlyItemResponseDto>> userAdd(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId,
            @Valid @RequestBody UpdateMonthlyItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.addMonthlyItem(user.getUserId(), planId, dto)));
    }

    @PutMapping("/api/v1/me/plans/{planId}/monthly-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update a monthly item on my plan")
    public ResponseEntity<CommonApiResponse<MonthlyItemResponseDto>> userUpdate(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @PathVariable String itemId,
            @Valid @RequestBody UpdateMonthlyItemRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.updateMonthlyItem(user.getUserId(), planId, itemId, dto)));
    }

    @DeleteMapping("/api/v1/me/plans/{planId}/monthly-items/{itemId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete a monthly item from my plan")
    public ResponseEntity<CommonApiResponse<Void>> userDelete(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId, @PathVariable String itemId) {
        userPlanService.deleteMonthlyItem(user.getUserId(), planId, itemId);
        return ResponseEntity.ok(CommonApiResponse.success(null));
    }
}
