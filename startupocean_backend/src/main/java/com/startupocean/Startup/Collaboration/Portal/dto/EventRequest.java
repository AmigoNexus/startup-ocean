package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    @NotBlank(message = "Event name is required")
    private String eventName;

    private String eventDescription;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private String location;

    private Integer maxParticipants;

    private String eventType;
}