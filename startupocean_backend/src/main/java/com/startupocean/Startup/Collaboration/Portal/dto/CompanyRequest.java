package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotNull
    private String companyType;

    private String logoUrl;

    @NotEmpty(message = "At least one offering is required")
    private List<String> offerings;

    private SocialLinkRequest socialLinks;
}