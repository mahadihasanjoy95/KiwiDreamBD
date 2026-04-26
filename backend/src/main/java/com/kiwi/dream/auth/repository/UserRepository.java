package com.kiwi.dream.auth.repository;

import com.kiwi.dream.auth.entity.User;
import com.kiwi.dream.auth.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    Optional<User> findByGoogleId(String googleId);

    boolean existsByEmail(String email);

    Page<User> findByRole(UserRole role, Pageable pageable);
}
