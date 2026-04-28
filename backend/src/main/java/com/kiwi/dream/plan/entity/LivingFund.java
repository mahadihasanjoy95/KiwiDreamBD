package com.kiwi.dream.plan.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Living fund data — one-to-one with a plan.
 *
 * <p>Admin fills guidance fields ({@code minimumAmountNzd}, {@code recommendedAmountNzd},
 * explanations, disclaimers) on master plans.</p>
 *
 * <p>Applicants fill personal fields ({@code userSavedAmountBdt}, etc.) on user plans.</p>
 *
 * <p>Computed fields ({@code survivalMonths}, {@code readinessScore}, {@code affordabilityStatus})
 * are NOT stored — they are calculated fresh in the service layer at query time using the
 * current live exchange rate.</p>
 */
@Entity
@Table(name = "living_funds")
@Getter
@Setter
public class LivingFund {

    @Id
    @Column(name = "id", length = 36, nullable = false, updatable = false)
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "plan_id", nullable = false, unique = true)
    private Plan plan;

    // ── Admin-set guidance fields ──────────────────────────────────────────

    @Column(name = "minimum_amount_nzd", precision = 15, scale = 2)
    private BigDecimal minimumAmountNzd;

    @Column(name = "recommended_amount_nzd", precision = 15, scale = 2)
    private BigDecimal recommendedAmountNzd;

    @Column(name = "explanation_en", columnDefinition = "TEXT")
    private String explanationEn;

    @Column(name = "explanation_bn", columnDefinition = "TEXT")
    private String explanationBn;

    /** e.g. "Exclude tuition fees and money reserved for other purposes." */
    @Column(name = "disclaimer_en", columnDefinition = "TEXT")
    private String disclaimerEn;

    @Column(name = "disclaimer_bn", columnDefinition = "TEXT")
    private String disclaimerBn;

    // ── Applicant-set personal fields ──────────────────────────────────────

    @Column(name = "user_saved_amount_bdt", precision = 15, scale = 2)
    private BigDecimal userSavedAmountBdt = BigDecimal.ZERO;

    @Column(name = "user_monthly_contribution_bdt", precision = 15, scale = 2)
    private BigDecimal userMonthlyContributionBdt;

    @Column(name = "user_target_date")
    private LocalDate userTargetDate;

    @Column(name = "user_notes", columnDefinition = "TEXT")
    private String userNotes;

    @PrePersist
    private void generateId() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
    }
}
