package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.Data;

import java.util.List;

@Data
public class ServiceResponse {
    private String type;
    private String description;
    private List<String> offerings;
}

