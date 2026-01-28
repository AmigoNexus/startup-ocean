package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    @Query("SELECT COUNT(DISTINCT ua.sessionId) FROM UserActivity ua")
    long countDistinctSessions();
}
