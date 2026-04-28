package com.kiwi.dream.auth.controller;

import com.kiwi.dream.auth.dto.request.AssignUserRoleRequestDto;
import com.kiwi.dream.auth.dto.request.CreateAdminRequestDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.auth.service.UserService;
import com.kiwi.dream.common.response.CommonApiResponse;
import com.kiwi.dream.common.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
@Tag(name = "Admin — User Management", description = "Manage users: create admins, assign roles, activate/deactivate, delete")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @PostMapping
    @Operation(summary = "Create a new admin user (invite by email with temporary password)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Admin created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> createAdmin(
            @Valid @RequestBody CreateAdminRequestDto requestDto) {
        UserResponseDto user = userService.createAdmin(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Admin created successfully", user));
    }

    @GetMapping
    @Operation(summary = "List all users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/admins")
    @Operation(summary = "List admin users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Admin users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listAdminUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listAdminUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/applicants")
    @Operation(summary = "List applicant users (paginated)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Applicant users returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<PageResponse<UserResponseDto>>> listApplicants(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserResponseDto> users = userService.listRegularUsers(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(CommonApiResponse.success(users));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a user by ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User returned"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> getUser(@PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success(userService.getUserById(id)));
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Assign a role to a user (APPLICANT or ADMIN only — cannot promote to SUPER_ADMIN)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Role assigned"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> assignRole(
            @PathVariable String id,
            @Valid @RequestBody AssignUserRoleRequestDto requestDto) {
        return ResponseEntity.ok(CommonApiResponse.success("Role assigned successfully",
                userService.assignRole(id, requestDto)));
    }

    @PatchMapping("/{id}/activate")
    @Operation(summary = "Activate a user account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User activated"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> activateUser(@PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success("User activated", userService.activateUser(id)));
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate a user account")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User deactivated"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<CommonApiResponse<UserResponseDto>> deactivateUser(@PathVariable String id) {
        return ResponseEntity.ok(CommonApiResponse.success("User deactivated", userService.deactivateUser(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Delete a user account (SUPER_ADMIN only)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User deleted"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
            @ApiResponse(responseCode = "403", description = "SUPER_ADMIN role required"),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "409", description = "Cannot delete a SUPER_ADMIN account")
    })
    public ResponseEntity<CommonApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(CommonApiResponse.success("User deleted", null));
    }
}
