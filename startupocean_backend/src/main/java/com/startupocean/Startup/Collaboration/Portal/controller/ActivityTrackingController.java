package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ActivityTrackingRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.service.ActivityTrackingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activity")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ActivityTrackingController {

    private final ActivityTrackingService activityTrackingService;

    @PostMapping("/track")
    public ApiResponse trackActivity(
            @RequestBody ActivityTrackingRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return activityTrackingService.trackActivity(request, httpServletRequest);
    }
}
