package com.kiwi.dream.plan.entity;

import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.plan.enums.PlanAccessRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * M2M join table between plans and users.
 * Phase 1: always one OWNER per plan.
 * Phase 2: shared access (VIEWER, EDITOR) for couple/family plans.
 */
@Entity
@Table(
        name = "plan_users",
        uniqueConstraints = @UniqueConstraint(name = "uk_plan_user", columnNames = {"plan_id", "user_id"}),
        indexes = @Index(name = "idx_plan_user_user", columnList = "user_id")
)
@Getter
@Setter
public class PlanUser {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_role", nullable = false, length = 10)
    private PlanAccessRole accessRole = PlanAccessRole.OWNER;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @PrePersist
    private void init() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.joinedAt == null) {
            this.joinedAt = Instant.now();
        }
    }
}
