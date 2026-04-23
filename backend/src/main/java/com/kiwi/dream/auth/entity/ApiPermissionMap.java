package com.kiwi.dream.auth.entity;

import com.kiwi.dream.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "api_permission_map", uniqueConstraints = {
        @UniqueConstraint(name = "uk_api_map_method_path", columnNames = {"http_method", "path_pattern"})
}, indexes = {
        @Index(name = "idx_api_map_active_method", columnList = "active, http_method")
})
@Getter
@Setter
@NoArgsConstructor
public class ApiPermissionMap extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "http_method", nullable = false, length = 10)
    private String httpMethod;

    @Column(name = "path_pattern", nullable = false, length = 255)
    private String pathPattern;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "permission_id", nullable = true)
    private Permission permission;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    /**
     * When true, this endpoint is publicly accessible — no JWT required.
     */
    @Column(name = "is_public", nullable = false)
    private boolean isPublic = false;

    /**
     * When true, any authenticated user can access this endpoint — no specific
     * permission required beyond having a valid JWT.
     */
    @Column(name = "authenticated_only", nullable = false)
    private boolean authenticatedOnly = false;

    @Column(name = "description", length = 255)
    private String description;

    public ApiPermissionMap(String httpMethod, String pathPattern, Permission permission, String description) {
        this.httpMethod = httpMethod;
        this.pathPattern = pathPattern;
        this.permission = permission;
        this.description = description;
    }

    /** Constructor for public routes — no permission, no JWT required. */
    public ApiPermissionMap(String httpMethod, String pathPattern, String description) {
        this.httpMethod = httpMethod;
        this.pathPattern = pathPattern;
        this.permission = null;
        this.isPublic = true;
        this.authenticatedOnly = false;
        this.description = description;
    }

    /** Factory for authenticated-only routes — valid JWT required, no specific permission. */
    public static ApiPermissionMap authenticatedOnly(String httpMethod, String pathPattern, String description) {
        ApiPermissionMap map = new ApiPermissionMap();
        map.httpMethod = httpMethod;
        map.pathPattern = pathPattern;
        map.permission = null;
        map.isPublic = false;
        map.authenticatedOnly = true;
        map.description = description;
        return map;
    }
}
