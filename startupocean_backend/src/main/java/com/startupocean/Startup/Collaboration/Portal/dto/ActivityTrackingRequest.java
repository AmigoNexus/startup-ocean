package com.startupocean.Startup.Collaboration.Portal.dto;

import lombok.Data;

@Data
public class ActivityTrackingRequest {

    private String sessionId;

    private String activityType;

    private String pageUrl;

    private String searchQuery;

    private Long resourceId;

    private String resourceType;

    private String metadata;
}
