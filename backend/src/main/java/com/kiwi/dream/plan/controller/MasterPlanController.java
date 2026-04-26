package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.*;
import com.kiwi.dream.plan.dto.response.*;
import com.kiwi.dream.plan.service.MasterPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Master Plans", description = "Admin-managed plan templates — public read, admin write")
public class MasterPlanController {

    private final MasterPlanService masterPlanService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping("/api/v1/plans/master")
    @Operation(summary = "List all published master plans (public)")
    public ResponseEntity<CommonApiResponse<List<PlanSummaryResponseDto>>> listPublished() {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.listPublished()));
    }

    @GetMapping("/api/v1/plans/master/by-combo")
    @Operation(summary = "Get master plan by country+city+profile combo (public)",
            description = "Returns the published master plan for the given combo, or null if not found.")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> getByCombo(
            @RequestParam String countryId,
            @RequestParam String cityId,
            @RequestParam String profileId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                masterPlanService.getByCombo(countryId, cityId, profileId)));
    }

    @GetMapping("/api/v1/plans/master/{planId}")
    @Operation(summary = "Get full master plan by ID (public)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> getById(@PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.getById(planId)));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/plans/master")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all master plans including unpublished (ADMIN)")
    public ResponseEntity<CommonApiResponse<List<PlanSummaryResponseDto>>> listAll() {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.listAll()));
    }

    @PostMapping("/api/v1/admin/plans/master")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> create(
            @Valid @RequestBody CreateMasterPlanRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.create(dto)));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update master plan metadata (ADMIN)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> update(
            @PathVariable String planId,
            @Valid @RequestBody UpdatePlanRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.update(planId, dto)));
    }

    @PatchMapping("/api/v1/admin/plans/master/{planId}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publish a master plan — makes it visible to applicants (ADMIN)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> publish(@PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.publish(planId)));
    }

    @PatchMapping("/api/v1/admin/plans/master/{planId}/unpublish")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Unpublish a master plan — hides it from applicants (ADMIN)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> unpublish(@PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.unpublish(planId)));
    }

    @DeleteMapping("/api/v1/admin/plans/master/{planId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Hard-delete a master plan and all its sub-resources (SUPER_ADMIN)")
    public ResponseEntity<CommonApiResponse<Void>> delete(@PathVariable String planId) {
        masterPlanService.delete(planId);
        return ResponseEntity.ok(CommonApiResponse.success("Master plan deleted.", null));
    }
}
