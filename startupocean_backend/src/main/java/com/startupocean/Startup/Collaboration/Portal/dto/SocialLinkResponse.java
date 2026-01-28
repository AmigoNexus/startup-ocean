package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkResponse {
    private String website;
    private String linkedin;
    private String facebook;
    private String instagram;
    private String twitter;
}
