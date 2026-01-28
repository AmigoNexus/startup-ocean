package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private String role;
    private Long userId;
    private boolean isVerified;
    private boolean profileComplete;
}