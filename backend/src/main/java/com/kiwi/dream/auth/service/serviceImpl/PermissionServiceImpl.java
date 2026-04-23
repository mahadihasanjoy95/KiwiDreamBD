package com.kiwi.dream.auth.service.serviceImpl;

import com.kiwi.dream.auth.dto.request.CreateApiPermissionMapRequestDto;
import com.kiwi.dream.auth.dto.request.CreatePermissionRequestDto;
import com.kiwi.dream.auth.dto.request.UpdateApiPermissionMapRequestDto;
import com.kiwi.dream.auth.dto.response.ApiPermissionMapResponseDto;
import com.kiwi.dream.auth.dto.response.PermissionResponseDto;
import com.kiwi.dream.auth.entity.ApiPermissionMap;
import com.kiwi.dream.auth.entity.Permission;
import com.kiwi.dream.auth.exception.ApiPermissionMapNotFoundException;
import com.kiwi.dream.auth.exception.PermissionNotFoundException;
import com.kiwi.dream.auth.repository.ApiPermissionMapRepository;
import com.kiwi.dream.auth.repository.PermissionRepository;
import com.kiwi.dream.auth.service.PermissionService;
import com.kiwi.dream.common.exception.ConflictException;
import com.kiwi.dream.security.ApiPermissionCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;
    private final ApiPermissionMapRepository apiPermissionMapRepository;
    private final ApiPermissionCache apiPermissionCache;

    @Override
    @Transactional
    public PermissionResponseDto createPermission(CreatePermissionRequestDto requestDto) {
        if (permissionRepository.existsByCode(requestDto.code())) {
            throw new PermissionAlreadyExistsException(requestDto.code());
        }
        Permission saved = permissionRepository.save(
                new Permission(requestDto.code(), requestDto.description(), requestDto.module()));
        log.info("Permission created: {}", saved.getCode());
        return toPermissionResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponseDto> listAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(this::toPermissionResponse)
                .toList();
    }

    @Override
    @Transactional
    public ApiPermissionMapResponseDto createApiPermissionMap(CreateApiPermissionMapRequestDto requestDto) {
        if (apiPermissionMapRepository.existsByHttpMethodIgnoreCaseAndPathPattern(
                requestDto.httpMethod(), requestDto.pathPattern())) {
            throw new ApiMapAlreadyExistsException(requestDto.httpMethod(), requestDto.pathPattern());
        }

        boolean isPublic = Boolean.TRUE.equals(requestDto.isPublic());
        boolean authenticatedOnly = Boolean.TRUE.equals(requestDto.authenticatedOnly());

        if (isPublic && authenticatedOnly) {
            throw new IllegalArgumentException("A route cannot be both public and authenticated-only");
        }

        ApiPermissionMap map;

        if (isPublic) {
            map = new ApiPermissionMap(
                    requestDto.httpMethod().toUpperCase(),
                    requestDto.pathPattern(),
                    requestDto.description()
            );
        } else if (authenticatedOnly) {
            map = ApiPermissionMap.authenticatedOnly(
                    requestDto.httpMethod().toUpperCase(),
                    requestDto.pathPattern(),
                    requestDto.description()
            );
        } else {
            if (requestDto.permissionCode() == null || requestDto.permissionCode().isBlank()) {
                throw new IllegalArgumentException(
                        "permissionCode is required for permission-protected routes. " +
                        "Set isPublic=true or authenticatedOnly=true if no permission is needed.");
            }
            Permission permission = permissionRepository.findByCode(requestDto.permissionCode())
                    .orElseThrow(() -> new PermissionNotFoundException(requestDto.permissionCode()));
            map = new ApiPermissionMap(
                    requestDto.httpMethod().toUpperCase(),
                    requestDto.pathPattern(),
                    permission,
                    requestDto.description()
            );
        }

        ApiPermissionMap saved = apiPermissionMapRepository.save(map);
        apiPermissionCache.evict();
        log.info("API permission map created: {} {} (public={}, authOnly={})",
                saved.getHttpMethod(), saved.getPathPattern(), saved.isPublic(), saved.isAuthenticatedOnly());
        return toApiMapResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiPermissionMapResponseDto> listApiPermissionMaps() {
        return apiPermissionMapRepository.findAll().stream()
                .map(this::toApiMapResponse)
                .toList();
    }

    @Override
    @Transactional
    public ApiPermissionMapResponseDto updateApiPermissionMap(Long id, UpdateApiPermissionMapRequestDto requestDto) {
        ApiPermissionMap map = apiPermissionMapRepository.findById(id)
                .orElseThrow(() -> new ApiPermissionMapNotFoundException(id));

        if (requestDto.isPublic() != null) {
            map.setPublic(requestDto.isPublic());
            if (requestDto.isPublic()) {
                map.setAuthenticatedOnly(false);
                map.setPermission(null);
            }
        }

        if (requestDto.authenticatedOnly() != null) {
            map.setAuthenticatedOnly(requestDto.authenticatedOnly());
            if (requestDto.authenticatedOnly()) {
                map.setPublic(false);
                map.setPermission(null);
            }
        }

        if (requestDto.permissionCode() != null && !requestDto.permissionCode().isBlank()) {
            Permission permission = permissionRepository.findByCode(requestDto.permissionCode())
                    .orElseThrow(() -> new PermissionNotFoundException(requestDto.permissionCode()));
            map.setPermission(permission);
            map.setPublic(false);
            map.setAuthenticatedOnly(false);
        }

        if (requestDto.active() != null) {
            map.setActive(requestDto.active());
        }

        if (requestDto.description() != null) {
            map.setDescription(requestDto.description());
        }

        ApiPermissionMap saved = apiPermissionMapRepository.save(map);
        apiPermissionCache.evict();
        return toApiMapResponse(saved);
    }

    @Override
    @Transactional
    public void deleteApiPermissionMap(Long id) {
        if (!apiPermissionMapRepository.existsById(id)) {
            throw new ApiPermissionMapNotFoundException(id);
        }
        apiPermissionMapRepository.deleteById(id);
        apiPermissionCache.evict();
        log.info("API permission map {} deleted", id);
    }

    // ──────────────────────────────────────────────────────────────────────────

    private PermissionResponseDto toPermissionResponse(Permission p) {
        return new PermissionResponseDto(p.getId(), p.getCode(), p.getDescription(), p.getModule(), p.getCreatedAt());
    }

    private ApiPermissionMapResponseDto toApiMapResponse(ApiPermissionMap m) {
        PermissionResponseDto permissionDto = m.getPermission() != null
                ? toPermissionResponse(m.getPermission())
                : null;
        return new ApiPermissionMapResponseDto(
                m.getId(),
                m.getHttpMethod(),
                m.getPathPattern(),
                permissionDto,
                m.isActive(),
                m.isPublic(),
                m.isAuthenticatedOnly(),
                m.getDescription(),
                m.getCreatedAt()
        );
    }

    // ── Inner exception classes for conflict scenarios ──────────────────────

    static class PermissionAlreadyExistsException extends ConflictException {
        PermissionAlreadyExistsException(String code) {
            super("PERMISSION_ALREADY_EXISTS", "Permission with code '" + code + "' already exists");
        }
    }

    static class ApiMapAlreadyExistsException extends ConflictException {
        ApiMapAlreadyExistsException(String method, String path) {
            super("API_MAP_ALREADY_EXISTS", "API mapping already exists for " + method + " " + path);
        }
    }
}
