package com.kiwi.dream.plan.entity;

import com.kiwi.dream.city.entity.City;
import com.kiwi.dream.common.entity.BaseAuditableEntity;
import com.kiwi.dream.country.entity.Country;
import com.kiwi.dream.plan.enums.PlanStatus;
import com.kiwi.dream.profile.entity.PlanningProfile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * Unified plan entity — holds both admin master plans and applicant personal plans.
 *
 * <p>Differentiated by the {@code masterPlan} flag:</p>
 * <ul>
 *   <li>{@code masterPlan = true}  — admin-created template, scoped to a country+city+profile combo.</li>
 *   <li>{@code masterPlan = false} — applicant's personal deep copy, independently editable.</li>
 * </ul>
 *
 * <p>The uniqueness constraint (one master plan per country+city+profile) is enforced in
 * the service layer, not as a DB partial unique index, for MySQL InnoDB compatibility.</p>
 */
@Entity
@Table(
        name = "plans",
        indexes = {
                @Index(name = "idx_plan_master_published",  columnList = "is_master_plan, is_published"),
                @Index(name = "idx_plan_combo",             columnList = "country_id, city_id, planning_profile_id"),
                @Index(name = "idx_plan_deleted",           columnList = "is_deleted")
        }
)
@Getter
@Setter
public class Plan extends BaseAuditableEntity {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "country_id", nullable = false)
    private Country country;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "planning_profile_id", nullable = false)
    private PlanningProfile planningProfile;

    @Column(name = "display_plan_name", length = 255)
    private String displayPlanName;

    /** TRUE = admin template. FALSE = applicant personal plan. */
    @Column(name = "is_master_plan", nullable = false)
    private boolean masterPlan = false;

    /** Gates public visibility. Only relevant when masterPlan = true. */
    @Column(name = "is_published", nullable = false)
    private boolean published = false;

    @Column(name = "overview_en", columnDefinition = "TEXT")
    private String overviewEn;

    @Column(name = "overview_bn", columnDefinition = "TEXT")
    private String overviewBn;

    /** Only relevant for user plans (masterPlan = false). */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 10)
    private PlanStatus status;

    /** Soft-delete flag. Hard delete is performed at the DB level by the service. */
    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
