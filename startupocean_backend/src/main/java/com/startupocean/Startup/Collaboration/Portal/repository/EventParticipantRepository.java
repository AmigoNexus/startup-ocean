package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Event;
import com.startupocean.Startup.Collaboration.Portal.entity.EventParticipant;
import com.startupocean.Startup.Collaboration.Portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipantRepository extends JpaRepository<EventParticipant, Long> {
    Optional<EventParticipant> findByEventAndUser(Event event, User user);
    boolean existsByEventAndUserAndIsActiveTrue(Event event, User user);

    @Query("SELECT COUNT(ep) FROM EventParticipant ep WHERE ep.event = :event AND " +
            "ep.isActive = true AND ep.status = 'REGISTERED'")
    Long countRegisteredParticipants(@Param("event") Event event);
}
