package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByIsActiveTrueOrderByEventDateDesc();

    @Query("SELECT e FROM Event e WHERE e.isActive = true AND e.eventDate > CURRENT_TIMESTAMP " +
            "ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents();

    @Query("SELECT e FROM Event e WHERE e.isActive = true AND e.eventDate < CURRENT_TIMESTAMP " +
            "ORDER BY e.eventDate DESC")
    List<Event> findPastEvents();
}
