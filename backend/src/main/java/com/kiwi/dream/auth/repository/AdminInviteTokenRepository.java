package com.kiwi.dream.auth.repository;

import com.kiwi.dream.auth.entity.AdminInviteToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminInviteTokenRepository extends JpaRepository<AdminInviteToken, Long> {

    Optional<AdminInviteToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM AdminInviteToken token WHERE token.user.id = :userId")
    void deleteByUserId(@Param("userId") String userId);
}
