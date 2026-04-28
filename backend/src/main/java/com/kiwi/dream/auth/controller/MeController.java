package com.kiwi.dream.auth.controller;

import com.kiwi.dream.auth.dto.request.ChangePasswordRequestDto;
import com.kiwi.dream.auth.dto.request.UpdateProfilePictureRequestDto;
import com.kiwi.dream.auth.dto.request.UpdateProfileRequestDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.auth.service.AuthService;
import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.security.CurrentUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Self-service profile endpoints for the currently authenticated user.
 * All endpoints require a valid JWT (any role: APPLICANT, ADMIN, SUPER_ADMIN).
 * Authorization is enforced by SecurityConfig's anyRequest().authenticated() rule.
 */
@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
@Tag(name = "Me — Profile", description = "Self-service: view and manage your own profile, password, and account")
@SecurityRequirement(name = "bearerAuth")
public class MeController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @GetMapping("/profile")
    @Operation(summary = "Get current authenticated user profile")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> getProfile() {
        String userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(CommonApiResponse.success(authService.me(userId)));
    }

    @PatchMapping("/profile")
    @Operation(summary = "Update current user's profile (name, phone, savings, currency preference, etc.)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDto requestDto) {
        String userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(CommonApiResponse.success("Profile updated successfully",
                authService.updateMe(userId, requestDto)));
    }

    @PatchMapping("/profile/picture")
    @Operation(summary = "Update current user's profile picture URL",
            description = "Accepts a direct URL to the profile image. S3 upload handled separately in Phase 2.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile picture updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> updateProfilePicture(
            @Valid @RequestBody UpdateProfilePictureRequestDto requestDto) {
        String userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(CommonApiResponse.success("Profile picture updated",
                authService.updateProfilePicture(userId, requestDto.pictureUrl())));
    }

    @PatchMapping("/password")
    @Operation(summary = "Change current user's password",
            description = "currentPassword is required for LOCAL accounts. Google-only accounts can skip it to set a password for the first time.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Current password wrong or not authenticated")
    })
    public ResponseEntity<CommonApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto requestDto) {
        String userId = currentUserService.getCurrentUserId();
        authService.changePassword(userId, requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Password changed successfully"));
    }

    @PatchMapping("/deactivate")
    @Operation(summary = "Deactivate own account (soft — data preserved, login disabled)",
            description = "SUPER_ADMIN accounts cannot self-deactivate.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account deactivated"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "409", description = "SUPER_ADMIN account cannot be deactivated this way")
    })
    public ResponseEntity<CommonApiResponse<Void>> deactivate() {
        String userId = currentUserService.getCurrentUserId();
        authService.deactivateSelf(userId);
        return ResponseEntity.ok(CommonApiResponse.success("Account deactivated. Contact support to reactivate."));
    }

    @DeleteMapping("/profile")
    @Operation(summary = "Permanently delete own account",
            description = "Hard delete — all plans, checklist items, and living fund data are permanently removed. " +
                          "SUPER_ADMIN accounts cannot self-delete.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Account deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "409", description = "SUPER_ADMIN account cannot be deleted this way")
    })
    public ResponseEntity<CommonApiResponse<Void>> deleteAccount() {
        String userId = currentUserService.getCurrentUserId();
        authService.deleteSelf(userId);
        return ResponseEntity.ok(CommonApiResponse.success("Account permanently deleted"));
    }
}
