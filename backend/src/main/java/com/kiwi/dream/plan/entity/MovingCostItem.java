package com.kiwi.dream.plan.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * One-time pre-arrival or Day-1 cost item (e.g., flight, bond payment, bedding kit).
 * Same structure and rendering rules as {@link MonthlyLivingItem}.
 */
@Entity
@Table(
        name = "moving_cost_items",
        indexes = @Index(name = "idx_moving_item_plan", columnList = "plan_id")
)
@Getter
@Setter
public class MovingCostItem {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(name = "item_name_en", length = 255)
    private String itemNameEn;

    @Column(name = "item_name_bn", length = 500)
    private String itemNameBn;

    @Column(name = "custom_item_name", length = 255)
    private String customItemName;

    @Column(name = "estimated_amount_nzd", precision = 15, scale = 2)
    private BigDecimal estimatedAmountNzd;

    @Column(name = "note_en", columnDefinition = "TEXT")
    private String noteEn;

    @Column(name = "note_bn", columnDefinition = "TEXT")
    private String noteBn;

    @Column(name = "custom_note", columnDefinition = "TEXT")
    private String customNote;

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
