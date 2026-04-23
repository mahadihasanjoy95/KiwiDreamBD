package com.kiwi.dream.auth.repository;

import com.kiwi.dream.auth.entity.ApiPermissionMap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiPermissionMapRepository extends JpaRepository<ApiPermissionMap, Long> {

    List<ApiPermissionMap> findByActiveTrue();

    boolean existsByHttpMethodIgnoreCaseAndPathPattern(String httpMethod, String pathPattern);

    Optional<ApiPermissionMap> findByHttpMethodIgnoreCaseAndPathPattern(String httpMethod, String pathPattern);
}
