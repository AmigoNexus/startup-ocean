package com.startupocean.Startup.Collaboration.Portal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Message is required")
    private String message;
}