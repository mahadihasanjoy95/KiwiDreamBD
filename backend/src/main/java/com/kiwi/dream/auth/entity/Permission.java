package com.kiwi.dream.auth.entity;

import com.kiwi.dream.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "permissions", indexes = {
        @Index(name = "idx_permission_code", columnList = "code", unique = true),
        @Index(name = "idx_permission_module", columnList = "module")
})
@Getter
@Setter
@NoArgsConstructor
public class Permission extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", unique = true, nullable = false, length = 100)
    private String code;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "module", nullable = false, length = 50)
    private String module;

    public Permission(String code, String description, String module) {
        this.code = code;
        this.description = description;
        this.module = module;
    }
}
