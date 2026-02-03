package com.startupocean.Startup.Collaboration.Portal.repository;

import com.startupocean.Startup.Collaboration.Portal.entity.Collaboration;
import com.startupocean.Startup.Collaboration.Portal.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByCollaborationAndIsActiveTrueOrderByCreatedAtAsc(Collaboration collaboration);

    List<Message> findByCollaborationCollaborationIdAndIsActiveTrueOrderByCreatedAtAsc(Long collaborationId);

}