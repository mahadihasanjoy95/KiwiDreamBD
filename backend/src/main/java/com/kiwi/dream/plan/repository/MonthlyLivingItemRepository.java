package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.MonthlyLivingItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonthlyLivingItemRepository extends JpaRepository<MonthlyLivingItem, String> {

    List<MonthlyLivingItem> findByPlanIdOrderByDisplayOrderAsc(String planId);

    Optional<MonthlyLivingItem> findByIdAndPlanId(String id, String planId);

    void deleteAllByPlanId(String planId);

    /**
     * Batch SUM query — returns one row per plan: [planId, totalNzd].
     * Fetches totals for ALL plans in a single SQL call, eliminating N+1 in list views.
     *
     * <p>Usage: collect into {@code Map<String, BigDecimal>} keyed by planId.</p>
     */
    @Query("""
            SELECT m.plan.id, COALESCE(SUM(m.estimatedAmountNzd), 0)
            FROM MonthlyLivingItem m
            WHERE m.plan.id IN :planIds
            GROUP BY m.plan.id
            """)
    List<Object[]> sumByPlanIds(@Param("planIds") List<String> planIds);
}
