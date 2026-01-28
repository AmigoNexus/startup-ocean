package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long eventId;
    private String eventName;
    private String eventDescription;
    private LocalDateTime eventDate;
    private String location;
    private String organizerName;
    private String organizerEmail;
    private Integer maxParticipants;
    private Long registeredParticipants;
    private String eventType;
    private boolean isRegistered;
    private LocalDateTime createdAt;
}