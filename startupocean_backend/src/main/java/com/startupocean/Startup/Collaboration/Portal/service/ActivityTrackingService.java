package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ActivityTrackingRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.UserActivity;
import com.startupocean.Startup.Collaboration.Portal.repository.UserActivityRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ActivityTrackingService {

    private final UserActivityRepository userActivityRepository;

    @Transactional
    public ApiResponse trackActivity(ActivityTrackingRequest request, HttpServletRequest httpRequest) {
        UserActivity activity = new UserActivity();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() &&
                !authentication.getPrincipal().equals("anonymousUser")) {

            String email = authentication.getName();
            activity.setUserEmail(email);
        }

        activity.setSessionId(request.getSessionId());
        activity.setActivityType(request.getActivityType());
        activity.setPageUrl(request.getPageUrl());
        activity.setSearchQuery(request.getSearchQuery());
        activity.setResourceId(request.getResourceId());
        activity.setResourceType(request.getResourceType());
        String ipAddress = getClientIpAddress(httpRequest);
        activity.setIpAddress(ipAddress);
        String userAgent = httpRequest.getHeader("User-Agent");
        activity.setUserAgent(userAgent);
        parseUserAgent(userAgent, activity);
        activity.setReferrerUrl(httpRequest.getHeader("Referer"));
        activity.setMetadata(request.getMetadata());
        userActivityRepository.save(activity);

        return new ApiResponse(true, "Activity tracked successfully", null);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");

        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }
        if (ipAddress != null && ipAddress.contains(",")) {
            ipAddress = ipAddress.split(",")[0].trim();
        }

        return ipAddress;
    }

    private void parseUserAgent(String userAgent, UserActivity activity) {
        if (userAgent == null || userAgent.isEmpty()) {
            return;
        }

        String lowerUserAgent = userAgent.toLowerCase();

        if (lowerUserAgent.contains("mobile") || lowerUserAgent.contains("android")) {
            activity.setDeviceType("MOBILE");
        } else if (lowerUserAgent.contains("tablet") || lowerUserAgent.contains("ipad")) {
            activity.setDeviceType("TABLET");
        } else {
            activity.setDeviceType("DESKTOP");
        }
        if (lowerUserAgent.contains("edg")) {
            activity.setBrowser("Edge");
        } else if (lowerUserAgent.contains("chrome")) {
            activity.setBrowser("Chrome");
        } else if (lowerUserAgent.contains("firefox")) {
            activity.setBrowser("Firefox");
        } else if (lowerUserAgent.contains("safari")) {
            activity.setBrowser("Safari");
        } else if (lowerUserAgent.contains("opera") || lowerUserAgent.contains("opr")) {
            activity.setBrowser("Opera");
        } else {
            activity.setBrowser("Other");
        }
        if (lowerUserAgent.contains("windows")) {
            activity.setOperatingSystem("Windows");
        } else if (lowerUserAgent.contains("mac")) {
            activity.setOperatingSystem("MacOS");
        } else if (lowerUserAgent.contains("linux")) {
            activity.setOperatingSystem("Linux");
        } else if (lowerUserAgent.contains("android")) {
            activity.setOperatingSystem("Android");
        } else if (lowerUserAgent.contains("iphone") || lowerUserAgent.contains("ipad")) {
            activity.setOperatingSystem("iOS");
        } else {
            activity.setOperatingSystem("Other");
        }
    }
    public ApiResponse getAnalytics() {
        long totalVisits = userActivityRepository.count();
        long uniqueVisitors = userActivityRepository.countDistinctSessions();

        return new ApiResponse(true, "Analytics retrieved",
                new AnalyticsData(totalVisits, uniqueVisitors));
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    static class AnalyticsData {
        private long totalVisits;
        private long uniqueVisitors;
    }
}