package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.PlanUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanUserRepository extends JpaRepository<PlanUser, String> {

    boolean existsByPlanIdAndUserId(String planId, String userId);

    /**
     * Returns all plan IDs owned by a user — used to load the user's plan list
     * without fetching full Plan entities upfront.
     */
    @Query("SELECT pu.plan.id FROM PlanUser pu WHERE pu.user.id = :userId")
    List<String> findPlanIdsByUserId(@Param("userId") String userId);

    void deleteByPlanId(String planId);
}
