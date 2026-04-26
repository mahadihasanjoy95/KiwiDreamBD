package com.kiwi.dream.auth.service;

import com.kiwi.dream.auth.dto.request.AssignUserRoleRequestDto;
import com.kiwi.dream.auth.dto.request.CreateAdminRequestDto;
import com.kiwi.dream.auth.dto.response.UserResponseDto;
import com.kiwi.dream.common.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponseDto createAdmin(CreateAdminRequestDto requestDto);
    UserResponseDto activateAdminInvite(String token);
    PageResponse<UserResponseDto> listUsers(Pageable pageable);
    PageResponse<UserResponseDto> listAdminUsers(Pageable pageable);
    PageResponse<UserResponseDto> listRegularUsers(Pageable pageable);
    UserResponseDto getUserById(String userId);
    UserResponseDto assignRole(String userId, AssignUserRoleRequestDto requestDto);
    UserResponseDto activateUser(String userId);
    UserResponseDto deactivateUser(String userId);
    void deleteUser(String userId);
}
