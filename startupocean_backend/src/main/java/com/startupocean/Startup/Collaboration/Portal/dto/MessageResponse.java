package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long messageId;
    private Long collaborationId;
    private String content;
    private String senderCompanyName;
    private Long senderCompanyId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}