package com.kiwi.dream.auth.controller;

import com.kiwi.dream.auth.dto.request.*;
import com.kiwi.dream.auth.dto.response.ForgotPasswordResponseDto;
import com.kiwi.dream.auth.dto.response.TokenResponseDto;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, token refresh and logout")
public class AuthController {

    private final AuthService authService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    @Operation(summary = "Register a new student account")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> register(
            @Valid @RequestBody RegisterRequestDto requestDto) {
        UserResponseDto user = authService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Registration successful", user));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive access + refresh tokens")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<CommonApiResponse<TokenResponseDto>> login(
            @Valid @RequestBody LoginRequestDto requestDto) {
        TokenResponseDto tokens = authService.login(requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Login successful", tokens));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Exchange a refresh token for a new token pair")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tokens refreshed"),
            @ApiResponse(responseCode = "401", description = "Token expired or revoked")
    })
    public ResponseEntity<CommonApiResponse<TokenResponseDto>> refresh(
            @Valid @RequestBody RefreshTokenRequestDto requestDto) {
        TokenResponseDto tokens = authService.refresh(requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Tokens refreshed", tokens));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout — revoke the current refresh token",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Logged out"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<Void>> logout(
            @Valid @RequestBody RefreshTokenRequestDto requestDto) {
        authService.logout(requestDto.refreshToken());
        return ResponseEntity.ok(CommonApiResponse.success("Logged out successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> me() {
        String userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(CommonApiResponse.success(authService.me(userId)));
    }

    @PatchMapping("/me")
    @Operation(summary = "Update current user's profile",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Profile updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> updateMe(
            @Valid @RequestBody UpdateProfileRequestDto requestDto) {
        String userId = currentUserService.getCurrentUserId();
        UserResponseDto updated = authService.updateMe(userId, requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Profile updated successfully", updated));
    }

    @PatchMapping("/me/password")
    @Operation(summary = "Change current user's password",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password changed"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Current password is wrong or not authenticated")
    })
    public ResponseEntity<CommonApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto requestDto) {
        String userId = currentUserService.getCurrentUserId();
        authService.changePassword(userId, requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Password changed successfully"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request a password reset email",
            description = "Returns type=EMAIL_SENT for normal accounts, " +
                          "type=SOCIAL_ACCOUNT for Google-only accounts. " +
                          "Always HTTP 200 — never reveals whether an email is registered.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Response sent — check 'type' field for action"),
            @ApiResponse(responseCode = "400", description = "Validation failed")
    })
    public ResponseEntity<CommonApiResponse<ForgotPasswordResponseDto>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDto requestDto) {
        ForgotPasswordResponseDto result = authService.forgotPassword(requestDto);
        return ResponseEntity.ok(CommonApiResponse.success(result.message(), result));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using a token from the reset email")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Password reset successfully"),
            @ApiResponse(responseCode = "400", description = "Token invalid, expired, or already used")
    })
    public ResponseEntity<CommonApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDto requestDto) {
        authService.resetPassword(requestDto);
        return ResponseEntity.ok(CommonApiResponse.success("Password has been reset successfully. You can now log in."));
    }
}
