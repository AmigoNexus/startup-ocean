package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    @NotNull(message = "Collaboration ID is required")
    private Long collaborationId;

    @NotBlank(message = "Message content is required")
    private String content;
}