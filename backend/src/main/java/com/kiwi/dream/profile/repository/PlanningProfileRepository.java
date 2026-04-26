package com.kiwi.dream.profile.repository;

import com.kiwi.dream.profile.entity.PlanningProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanningProfileRepository extends JpaRepository<PlanningProfile, String> {

    boolean existsByCode(String code);

    List<PlanningProfile> findByActiveTrueOrderByDisplayOrderAsc();
}
