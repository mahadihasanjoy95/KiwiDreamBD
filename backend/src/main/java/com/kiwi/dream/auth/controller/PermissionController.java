package com.kiwi.dream.auth.controller;

import com.kiwi.dream.auth.dto.request.CreatePermissionRequestDto;
import com.kiwi.dream.auth.dto.response.PermissionResponseDto;
import com.kiwi.dream.auth.service.PermissionService;
import com.kiwi.dream.common.response.CommonApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Permission Management", description = "Manage permissions")
@SecurityRequirement(name = "bearerAuth")
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping("/api/v1/permissions")
    @Operation(summary = "Create a new permission")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Permission created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "409", description = "Permission code already exists")
    })
    public ResponseEntity<CommonApiResponse<PermissionResponseDto>> createPermission(
            @Valid @RequestBody CreatePermissionRequestDto requestDto) {
        PermissionResponseDto permission = permissionService.createPermission(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonApiResponse.success("Permission created", permission));
    }

    @GetMapping("/api/v1/permissions")
    @Operation(summary = "List all permissions")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Permissions returned"),
            @ApiResponse(responseCode = "403", description = "Insufficient permissions")
    })
    public ResponseEntity<CommonApiResponse<List<PermissionResponseDto>>> listPermissions() {
        return ResponseEntity.ok(CommonApiResponse.success(permissionService.listAllPermissions()));
    }
}
