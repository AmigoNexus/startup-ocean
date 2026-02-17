package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.Data;

import java.util.List;

@Data
public class ServiceRequest {

    private String description;

    private List<String> offerings;

    private String type;

}
