package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyResponse {
    private Long companyId;
    private String companyName;
    private String description;
    private String companyType;
    private String logoUrl;
    private List<String> offerings;
    private SocialLinkResponse socialLinks;
    private String email;
    private String phoneNumber;
    private LocalDateTime createdAt;
}