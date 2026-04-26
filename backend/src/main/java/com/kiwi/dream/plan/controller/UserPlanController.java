package com.kiwi.dream.plan.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.plan.dto.request.CreateUserPlanFromMasterRequestDto;
import com.kiwi.dream.plan.dto.request.UpdatePlanRequestDto;
import com.kiwi.dream.plan.dto.response.PlanArchiveResponseDto;
import com.kiwi.dream.plan.dto.response.PlanResponseDto;
import com.kiwi.dream.plan.dto.response.PlanSummaryResponseDto;
import com.kiwi.dream.plan.service.UserPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/me/plans")
@PreAuthorize("isAuthenticated()")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
@Tag(name = "My Plans", description = "Applicant personal plan management")
public class UserPlanController {

    private final UserPlanService userPlanService;

    private String userId(UserDetails user) {
        // UserDetails username is the user's UUID (set during JWT auth)
        return user.getUsername();
    }

    @GetMapping
    @Operation(summary = "List my plans", description = "Optional ?status=ACTIVE|ARCHIVED filter")
    public ResponseEntity<CommonApiResponse<List<PlanSummaryResponseDto>>> listMyPlans(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.listMyPlans(userId(user), status)));
    }

    @GetMapping("/{planId}")
    @Operation(summary = "Get my full plan with all sub-resources and computed affordability fields")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> getMyPlan(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String planId) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.getMyPlan(userId(user), planId)));
    }

    @PostMapping("/from-master/{masterPlanId}")
    @Operation(summary = "Create my personal plan from a published master plan (deep copy)")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> createFromMaster(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String masterPlanId,
            @Valid @RequestBody(required = false) CreateUserPlanFromMasterRequestDto dto) {
        // Allow calling with just the path param and no body
        CreateUserPlanFromMasterRequestDto resolved =
                dto != null ? dto : new CreateUserPlanFromMasterRequestDto(masterPlanId, null);
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.createFromMaster(userId(user), resolved)));
    }

    @PatchMapping("/{planId}")
    @Operation(summary = "Update my plan name")
    public ResponseEntity<CommonApiResponse<PlanResponseDto>> updatePlan(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String planId,
            @Valid @RequestBody UpdatePlanRequestDto dto) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.updatePlan(userId(user), planId, dto)));
    }

    @PostMapping("/{planId}/archive")
    @Operation(summary = "Archive my plan — saves a JSON snapshot, then soft-deletes the plan")
    public ResponseEntity<CommonApiResponse<Void>> archivePlan(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String planId) {
        userPlanService.archivePlan(userId(user), planId);
        return ResponseEntity.ok(CommonApiResponse.success("Plan archived successfully.", null));
    }

    @DeleteMapping("/{planId}")
    @Operation(summary = "Hard-delete my plan and all linked data (irreversible)")
    public ResponseEntity<CommonApiResponse<Void>> deletePlan(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable String planId) {
        userPlanService.deletePlan(userId(user), planId);
        return ResponseEntity.ok(CommonApiResponse.success("Plan deleted.", null));
    }

    @GetMapping("/archives")
    @Operation(summary = "List my archived plan snapshots (view-only history)")
    public ResponseEntity<CommonApiResponse<List<PlanArchiveResponseDto>>> listArchives(
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(CommonApiResponse.success(
                userPlanService.listArchives(userId(user))));
    }
}
