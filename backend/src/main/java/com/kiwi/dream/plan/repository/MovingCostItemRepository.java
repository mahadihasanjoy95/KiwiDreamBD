package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.MovingCostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovingCostItemRepository extends JpaRepository<MovingCostItem, String> {

    List<MovingCostItem> findByPlanIdOrderByDisplayOrderAsc(String planId);

    Optional<MovingCostItem> findByIdAndPlanId(String id, String planId);

    void deleteAllByPlanId(String planId);

    /** Batch SUM — same pattern as {@link MonthlyLivingItemRepository#sumByPlanIds}. */
    @Query("""
            SELECT m.plan.id, COALESCE(SUM(m.estimatedAmountNzd), 0)
            FROM MovingCostItem m
            WHERE m.plan.id IN :planIds
            GROUP BY m.plan.id
            """)
    List<Object[]> sumByPlanIds(@Param("planIds") List<String> planIds);
}
