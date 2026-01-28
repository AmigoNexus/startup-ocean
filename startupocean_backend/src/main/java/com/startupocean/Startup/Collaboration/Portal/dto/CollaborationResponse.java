package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationResponse {
    private Long collaborationId;
    private CompanyResponse requesterCompany;
    private CompanyResponse targetCompany;
    private String status;
    private String message;
    private LocalDateTime createdAt;
}