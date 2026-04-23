package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.constants.SystemRoles;
import com.kiwi.dream.auth.dto.request.AssignRolePermissionsRequestDto;
import com.kiwi.dream.auth.dto.request.CreateRoleRequestDto;
import com.kiwi.dream.auth.dto.response.PermissionResponseDto;
import com.kiwi.dream.auth.dto.response.RoleResponseDto;
import com.kiwi.dream.auth.entity.Permission;
import com.kiwi.dream.auth.entity.Role;
import com.kiwi.dream.auth.exception.*;
import com.kiwi.dream.auth.repository.PermissionRepository;
import com.kiwi.dream.auth.repository.RoleRepository;
import com.kiwi.dream.auth.repository.UserRepository;
import com.kiwi.dream.auth.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RoleResponseDto createRole(CreateRoleRequestDto requestDto) {
        if (roleRepository.existsByName(requestDto.name())) {
            throw new RoleAlreadyExistsException(requestDto.name());
        }
        Role saved = roleRepository.save(new Role(requestDto.name(), requestDto.description()));
        log.info("Role created: {}", saved.getName());
        return toRoleResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoleResponseDto> listAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::toRoleResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteRole(Long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        if (SystemRoles.isReserved(role.getName()) || SystemRoles.ADMIN.equals(role.getName())) {
            throw new ProtectedRoleDeletionException(role.getName());
        }

        if (userRepository.existsByRoles_Id(roleId)) {
            throw new RoleInUseException(role.getName());
        }

        role.getPermissions().clear();
        roleRepository.save(role);
        roleRepository.delete(role);
        log.info("Role deleted: {}", role.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public RoleResponseDto getPermissionsForRole(Long roleId) {
        return toRoleResponse(roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId)));
    }

    @Override
    @Transactional
    public RoleResponseDto assignPermissionsToRole(Long roleId, AssignRolePermissionsRequestDto requestDto) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RoleNotFoundException(roleId));

        Set<Permission> permissions = permissionRepository.findAllByIdIn(requestDto.permissionIds());
        if (permissions.size() != requestDto.permissionIds().size()) {
            throw new PermissionNotFoundException("One or more permission IDs not found");
        }

        role.getPermissions().clear();
        role.getPermissions().addAll(permissions);
        Role saved = roleRepository.save(role);

        log.info("Assigned {} permissions to role {}", permissions.size(), role.getName());
        return toRoleResponse(saved);
    }

    private RoleResponseDto toRoleResponse(Role role) {
        Set<PermissionResponseDto> permissions = role.getPermissions().stream()
                .map(this::toPermissionResponse)
                .collect(Collectors.toSet());
        return new RoleResponseDto(role.getId(), role.getName(), role.getDescription(), permissions);
    }

    private PermissionResponseDto toPermissionResponse(Permission permission) {
        return new PermissionResponseDto(
                permission.getId(),
                permission.getCode(),
                permission.getDescription(),
                permission.getModule(),
                permission.getCreatedAt()
        );
    }
}
