package com.kiwi.dream.plan.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Monthly recurring cost line item.
 * Used in both master plans (admin-named, bilingual) and user plans (customName set at copy time).
 *
 * <p>Rendering rule:
 * <ul>
 *   <li>Master plan: render {@code nameEn} or {@code nameBn} based on UI language.</li>
 *   <li>User plan: render {@code customName} (populated from {@code nameEn} at deep-copy time).</li>
 * </ul>
 */
@Entity
@Table(
        name = "monthly_living_items",
        indexes = @Index(name = "idx_monthly_item_plan", columnList = "plan_id")
)
@Getter
@Setter
public class MonthlyLivingItem {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    /** Bilingual name — set by admin for master plans. Null on user plans. */
    @Column(name = "name_en", length = 255)
    private String nameEn;

    @Column(name = "name_bn", length = 500)
    private String nameBn;

    /** Editable name for user plans — copied from nameEn at deep-copy time. */
    @Column(name = "custom_name", length = 255)
    private String customName;

    @Column(name = "estimated_amount_nzd", precision = 15, scale = 2)
    private BigDecimal estimatedAmountNzd;

    /** Admin note for master plans. */
    @Column(name = "note_en", columnDefinition = "TEXT")
    private String noteEn;

    @Column(name = "note_bn", columnDefinition = "TEXT")
    private String noteBn;

    /** Editable note for user plans — copied from noteEn at deep-copy time. */
    @Column(name = "custom_note", columnDefinition = "TEXT")
    private String customNote;

    /** TRUE = applicant added this item themselves (not from master template). */
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
