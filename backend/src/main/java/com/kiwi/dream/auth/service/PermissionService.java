package com.kiwi.dream.auth.service;

import com.kiwi.dream.auth.dto.request.CreateApiPermissionMapRequestDto;
import com.kiwi.dream.auth.dto.request.CreatePermissionRequestDto;
import com.kiwi.dream.auth.dto.request.UpdateApiPermissionMapRequestDto;
import com.kiwi.dream.auth.dto.response.ApiPermissionMapResponseDto;
import com.kiwi.dream.auth.dto.response.PermissionResponseDto;

import java.util.List;

public interface PermissionService {
    PermissionResponseDto createPermission(CreatePermissionRequestDto requestDto);
    List<PermissionResponseDto> listAllPermissions();
    ApiPermissionMapResponseDto createApiPermissionMap(CreateApiPermissionMapRequestDto requestDto);
    List<ApiPermissionMapResponseDto> listApiPermissionMaps();
    ApiPermissionMapResponseDto updateApiPermissionMap(Long id, UpdateApiPermissionMapRequestDto requestDto);
    void deleteApiPermissionMap(Long id);
}
