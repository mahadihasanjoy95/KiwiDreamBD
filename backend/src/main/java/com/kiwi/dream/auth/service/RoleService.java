package com.kiwi.dream.auth.service;

import com.kiwi.dream.auth.dto.request.AssignRolePermissionsRequestDto;
import com.kiwi.dream.auth.dto.request.CreateRoleRequestDto;
import com.kiwi.dream.auth.dto.response.RoleResponseDto;

import java.util.List;

public interface RoleService {
    RoleResponseDto createRole(CreateRoleRequestDto requestDto);
    List<RoleResponseDto> listAllRoles();
    void deleteRole(Long roleId);
    RoleResponseDto getPermissionsForRole(Long roleId);
    RoleResponseDto assignPermissionsToRole(Long roleId, AssignRolePermissionsRequestDto requestDto);
}
