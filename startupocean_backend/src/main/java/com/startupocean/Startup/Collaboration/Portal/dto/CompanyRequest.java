package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {
    @NotBlank(message = "Company name is required")
    @Size(max = 255)
    private String companyName;

    @Size(max = 150, message = "Description must be less than 150 characters")
    private String description;

    private String city;

    private String email;

    private SocialLinkRequest socialLinks;

    private List<ServiceRequest> services;

}