package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.ChecklistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChecklistItemRepository extends JpaRepository<ChecklistItem, String> {

    List<ChecklistItem> findByPlanIdOrderByCategoryAscDisplayOrderAsc(String planId);

    Optional<ChecklistItem> findByIdAndPlanId(String id, String planId);

    void deleteAllByPlanId(String planId);
}
