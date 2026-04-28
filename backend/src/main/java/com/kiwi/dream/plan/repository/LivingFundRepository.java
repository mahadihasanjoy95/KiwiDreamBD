package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.LivingFund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LivingFundRepository extends JpaRepository<LivingFund, String> {

    Optional<LivingFund> findByPlanId(String planId);

    void deleteByPlanId(String planId);

    /**
     * Batch fetch all living funds for the given plan IDs — one query total.
     * Used by list view summary builder to avoid per-plan fund lookups.
     */
    @Query("SELECT lf FROM LivingFund lf WHERE lf.plan.id IN :planIds")
    List<LivingFund> findByPlanIdIn(@Param("planIds") List<String> planIds);
}
