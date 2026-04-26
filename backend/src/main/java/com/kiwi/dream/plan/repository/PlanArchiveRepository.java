package com.kiwi.dream.plan.repository;

import com.kiwi.dream.plan.entity.PlanArchive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanArchiveRepository extends JpaRepository<PlanArchive, String> {

    List<PlanArchive> findByUserIdOrderByArchivedAtDesc(String userId);
}
