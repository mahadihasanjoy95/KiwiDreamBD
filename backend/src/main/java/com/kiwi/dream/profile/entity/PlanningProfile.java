package com.kiwi.dream.profile.entity;

import com.kiwi.dream.common.converter.StringListConverter;
import com.kiwi.dream.common.entity.BaseAuditableEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "planning_profiles")
@Getter
@Setter
public class PlanningProfile extends BaseAuditableEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    /**
     * Stable business key — e.g. SOLO_STUDENT, STUDENT_COUPLE, WORKER, FAMILY, VISITOR.
     * Unique, uppercase, immutable after creation.
     */
    @Column(name = "code", length = 50, nullable = false, unique = true)
    private String code;

    @Column(name = "name_en", length = 150, nullable = false)
    private String nameEn;

    @Column(name = "name_bn", length = 300, nullable = false)
    private String nameBn;

    @Column(name = "short_details_en", columnDefinition = "TEXT")
    private String shortDetailsEn;

    @Column(name = "short_details_bn", columnDefinition = "TEXT")
    private String shortDetailsBn;

    /** JSON array of tag strings — e.g. ["student", "solo", "modest"]. */
    @Convert(converter = StringListConverter.class)
    @Column(name = "tags", columnDefinition = "JSON")
    private List<String> tags;

    @Column(name = "monthly_budget_range_min_nzd", precision = 15, scale = 2)
    private BigDecimal monthlyBudgetRangeMinNzd;

    @Column(name = "monthly_budget_range_max_nzd", precision = 15, scale = 2)
    private BigDecimal monthlyBudgetRangeMaxNzd;

    /**
     * Number of people this profile covers.
     * Used by the affordability engine for per-person cost checks
     * (e.g., grocery minimum NZD 60/week per person).
     * e.g. SOLO_STUDENT=1, STUDENT_COUPLE=2, FAMILY=3.
     */
    @Column(name = "default_person_count", nullable = false)
    private Integer defaultPersonCount = 1;

    @Column(name = "icon_svg_url", length = 1000)
    private String iconSvgUrl;

    @Column(name = "color_hex", length = 7)
    private String colorHex;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
