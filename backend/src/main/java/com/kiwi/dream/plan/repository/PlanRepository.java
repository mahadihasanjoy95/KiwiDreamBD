package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, String> {

    Optional<Plan> findByIdAndDeletedFalse(String id);

    /** All published master plans — for public list endpoint. */
    List<Plan> findByMasterPlanTrueAndPublishedTrueAndDeletedFalseOrderByDisplayPlanNameAsc();

    /** All master plans regardless of published state — for admin list. */
    List<Plan> findByMasterPlanTrueAndDeletedFalseOrderByDisplayPlanNameAsc();

    /**
     * Looks up the single master plan for a country+city+profile combo.
     * Used to enforce the uniqueness constraint in the service layer.
     */
    Optional<Plan> findByCountryIdAndCityIdAndPlanningProfileIdAndMasterPlanTrueAndDeletedFalse(
            String countryId, String cityId, String planningProfileId);

    /** Counts active user plans linked to a given master plan combo (for delete safety check). */
    @Query("SELECT COUNT(p) FROM Plan p WHERE p.city.id = :cityId AND p.masterPlan = false AND p.deleted = false")
    long countActiveUserPlansByCity(@Param("cityId") String cityId);
}
