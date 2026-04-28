package com.kiwi.dream.plan.entity;

import com.kiwi.dream.plan.enums.ChecklistCategory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Pre-departure checklist item.
 * Used in both master plans (admin default items) and user plans (personal checklist).
 */
@Entity
@Table(
        name = "checklist_items",
        indexes = @Index(name = "idx_checklist_item_plan", columnList = "plan_id")
)
@Getter
@Setter
public class ChecklistItem {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 20)
    private ChecklistCategory category = ChecklistCategory.CUSTOM;

    /** Admin-set bilingual text for master plans. */
    @Column(name = "item_text_en", length = 500)
    private String itemTextEn;

    @Column(name = "item_text_bn", length = 1000)
    private String itemTextBn;

    /** Editable text for user plans — copied from itemTextEn at deep-copy time. */
    @Column(name = "custom_item_text", length = 500)
    private String customItemText;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "is_done", nullable = false)
    private boolean done = false;

    /** Set when the user checks off this item. Null until then. */
    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "note_en", columnDefinition = "TEXT")
    private String noteEn;

    @Column(name = "note_bn", columnDefinition = "TEXT")
    private String noteBn;

    @Column(name = "custom_note", columnDefinition = "TEXT")
    private String customNote;

    /** TRUE = applicant added this item themselves. */
    @Column(name = "is_custom", nullable = false)
    private boolean custom = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
