package com.kiwi.dream.profile.controller;

import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.profile.dto.request.CreatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.request.UpdatePlanningProfileRequestDto;
import com.kiwi.dream.profile.dto.response.PlanningProfileResponseDto;
import com.kiwi.dream.profile.service.PlanningProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/planning-profiles")
@RequiredArgsConstructor
@Tag(name = "Planning Profiles", description = "Browse planning profiles (public) and manage them (admin)")
public class PlanningProfileController {

    private final PlanningProfileService profileService;

    // ── Public endpoints ──────────────────────────────────────────────────────

    @GetMapping
    @Operation(summary = "List all active planning profiles ordered by display order")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profiles returned")
    })
    public ResponseEntity<CommonApiResponse<List<PlanningProfileResponseDto>>> listActive() {
        return ResponseEntity.ok(CommonApiResponse.success(profileService.listActive()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a planning profile by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile returned"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<CommonApiResponse<PlanningProfileResponseDto>> getById(
            @PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success(profileService.getById(id)));
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new planning profile (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Profile created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "Profile code already exists")
    })
    public ResponseEntity<CommonApiResponse<PlanningProfileResponseDto>> create(
            @Valid @RequestBody CreatePlanningProfileRequestDto requestDto) {
        PlanningProfileResponseDto created = profileService.create(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Planning profile created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a planning profile (ADMIN) — code cannot be changed")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<CommonApiResponse<PlanningProfileResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody UpdatePlanningProfileRequestDto requestDto) {
        return ResponseEntity.ok(CommonApiResponse.success("Planning profile updated successfully",
                profileService.update(id, requestDto)));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Toggle a planning profile's active status (ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Active status toggled"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Profile not found")
    })
    public ResponseEntity<CommonApiResponse<PlanningProfileResponseDto>> toggleActive(
            @PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success("Profile status toggled",
                profileService.toggleActive(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a planning profile (SUPER_ADMIN only — blocked if plans are linked)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "SUPER_ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "Profile not found"),
            @ApiResponse(responseCode = "409", description = "Cannot delete profile while plans are linked")
    })
    public ResponseEntity<CommonApiResponse<Void>> delete(@PathVariable String id) {
        profileService.delete(id);
        return ResponseEntity.ok(CommonApiResponse.success("Planning profile deleted successfully"));
    }
}
