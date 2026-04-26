package com.kiwi.dream.plan.entity;

import com.kiwi.dream.auth.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable JSON snapshot of a plan at the moment it was archived.
 *
 * <p>Key design decisions:</p>
 * <ul>
 *   <li>{@code planId} is a plain string, NOT a FK — the archive survives even if
 *       the originating plan is later hard-deleted.</li>
 *   <li>{@code user} IS a FK with ON DELETE CASCADE — if the user deletes their account,
 *       their archive history is purged too.</li>
 *   <li>Snapshots are view-only — they cannot be restored to an active plan.</li>
 * </ul>
 */
@Entity
@Table(
        name = "plan_archives",
        indexes = @Index(name = "idx_archive_user", columnList = "user_id")
)
@Getter
@Setter
public class PlanArchive {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    /** Not a FK — intentionally a plain string to survive plan deletion. */
    @Column(name = "plan_id", length = 36, nullable = false)
    private String planId;

    /** Denormalized for list views without deserializing snapshotJson. */
    @Column(name = "display_plan_name", length = 255)
    private String displayPlanName;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** Full plan state serialized as JSON. Includes all items, fund data, and checklist. */
    @Column(name = "snapshot_json", columnDefinition = "LONGTEXT", nullable = false)
    private String snapshotJson;

    @Column(name = "archived_at", nullable = false, updatable = false)
    private Instant archivedAt;

    @PrePersist
    private void init() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.archivedAt == null) {
            this.archivedAt = Instant.now();
        }
    }
}
