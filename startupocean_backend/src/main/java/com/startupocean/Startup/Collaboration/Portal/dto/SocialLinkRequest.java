package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SocialLinkRequest {
    @Size(max = 500)
    private String website;

    @Size(max = 500)
    private String linkedin;

    @Size(max = 500)
    private String facebook;

    @Size(max = 500)
    private String instagram;

    @Size(max = 500)
    private String twitter;
}