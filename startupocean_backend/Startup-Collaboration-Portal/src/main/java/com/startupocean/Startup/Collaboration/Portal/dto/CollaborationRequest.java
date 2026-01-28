package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollaborationRequest {
    @NotNull(message = "Target company ID is required")
    private Long targetCompanyId;

    @Size(max = 1000)
    private String message;
}