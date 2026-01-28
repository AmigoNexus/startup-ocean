package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryResponse {
    private Long enquiryId;
    private String name;
    private String email;
    private String phone;
    private String message;
    private String status;
    private LocalDateTime createdAt;
}