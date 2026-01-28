package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.EventRequest;
import com.startupocean.Startup.Collaboration.Portal.service.EventService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<ApiResponse> createEvent(@Valid @RequestBody EventRequest request) {
        ApiResponse response = eventService.createEvent(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<ApiResponse> updateEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequest request) {
        ApiResponse response = eventService.updateEvent(eventId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllEvents() {
        ApiResponse response = eventService.getAllEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse> getUpcomingEvents() {
        ApiResponse response = eventService.getUpcomingEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/past")
    public ResponseEntity<ApiResponse> getPastEvents() {
        ApiResponse response = eventService.getPastEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-events")
    public ResponseEntity<ApiResponse> getMyEvents() {
        ApiResponse response = eventService.getMyEvents();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<ApiResponse> getEventById(@PathVariable Long eventId) {
        ApiResponse response = eventService.getEventById(eventId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse> registerForEvent(@PathVariable Long eventId) {
        ApiResponse response = eventService.registerForEvent(eventId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eventId}/register")
    public ResponseEntity<ApiResponse> cancelRegistration(@PathVariable Long eventId) {
        ApiResponse response = eventService.cancelRegistration(eventId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse> deleteEvent(@PathVariable Long eventId) {
        ApiResponse response = eventService.deleteEvent(eventId);
        return ResponseEntity.ok(response);
    }
}
