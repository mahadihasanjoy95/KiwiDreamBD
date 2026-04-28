package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.UpsertLivingFundRequestDto;
import com.kiwi.dream.plan.dto.response.LivingFundResponseDto;
import com.kiwi.dream.plan.service.MasterPlanService;
import com.kiwi.dream.plan.service.UserPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.kiwi.dream.security.UserPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Living Fund", description = "Living fund guidance (admin on master plans) and personal savings (applicant on user plans)")
public class LivingFundController {

    private final MasterPlanService masterPlanService;
    private final UserPlanService userPlanService;

    // ── Admin — master plan living fund ───────────────────────────────────────

    @GetMapping("/api/v1/admin/plans/master/{planId}/living-fund")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Get living fund guidance for a master plan (ADMIN)")
    public ResponseEntity<CommonApiResponse<LivingFundResponseDto>> adminGet(@PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.getLivingFund(planId)));
    }

    @PutMapping("/api/v1/admin/plans/master/{planId}/living-fund")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Set living fund guidance on a master plan (ADMIN)",
            description = "Creates or updates the living fund row. Admin sets minimum, recommended amounts and explanations.")
    public ResponseEntity<CommonApiResponse<LivingFundResponseDto>> adminUpsert(
            @PathVariable String planId, @RequestBody UpsertLivingFundRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(masterPlanService.upsertLivingFund(planId, dto)));
    }

    // ── Applicant — user plan living fund ─────────────────────────────────────

    @GetMapping("/api/v1/me/plans/{planId}/living-fund")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my living fund with computed survival months and readiness score")
    public ResponseEntity<CommonApiResponse<LivingFundResponseDto>> userGet(
            @AuthenticationPrincipal UserPrincipal user, @PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.getLivingFund(user.getUserId(), planId)));
    }

    @PutMapping("/api/v1/me/plans/{planId}/living-fund")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update my living fund savings data",
            description = "Updates userSavedAmountBdt and other personal fields. " +
                          "Response includes freshly computed survivalMonths, affordabilityStatus, readinessScore, and smartWarnings.")
    public ResponseEntity<CommonApiResponse<LivingFundResponseDto>> userUpsert(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String planId,
            @RequestBody UpsertLivingFundRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.upsertLivingFund(user.getUserId(), planId, dto)));
    }
}
