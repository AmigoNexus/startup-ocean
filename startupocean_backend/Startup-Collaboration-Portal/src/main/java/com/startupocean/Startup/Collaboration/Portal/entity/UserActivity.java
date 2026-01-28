package com.startupocean.Startup.Collaboration.Portal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activity_id")
    private Long activityId;

    @Column(name = "session_id", length = 100)
    private String sessionId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "activity_type", nullable = false, length = 50)
    private String activityType;

    @Column(name = "page_url", length = 500)
    private String pageUrl;

    @Column(name = "search_query", length = 255)
    private String searchQuery;

    @Column(name = "resource_id")
    private Long resourceId;

    @Column(name = "resource_type", length = 50)
    private String resourceType;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "device_type", length = 20)
    private String deviceType;

    @Column(name = "browser", length = 50)
    private String browser;

    @Column(name = "operating_system", length = 50)
    private String operatingSystem;

    @Column(name = "referrer_url", length = 500)
    private String referrerUrl;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}