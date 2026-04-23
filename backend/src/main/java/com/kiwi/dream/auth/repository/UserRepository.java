package com.kiwi.dream.auth.repository;

import com.kiwi.dream.auth.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    boolean existsByRoles_Id(Long roleId);

    Page<User> findAllByRoles_Name(String roleName, Pageable pageable);

    /**
     * Returns all permission codes held by a user through their roles.
     * Used by DbAuthorizationManager for per-request authorization.
     */
    @Query("""
            SELECT p.code
            FROM User u
            JOIN u.roles r
            JOIN r.permissions p
            WHERE u.id = :userId
            """)
    Set<String> findPermissionCodesByUserId(@Param("userId") String userId);

    /**
     * Returns the role name(s) of a user. Used for SUPER_ADMIN bypass check.
     */
    @Query("""
            SELECT r.name
            FROM User u
            JOIN u.roles r
            WHERE u.id = :userId
            """)
    Set<String> findRoleNamesByUserId(@Param("userId") String userId);
}
