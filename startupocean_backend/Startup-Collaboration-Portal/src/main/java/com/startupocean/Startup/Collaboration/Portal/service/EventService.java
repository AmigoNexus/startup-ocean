package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.EventRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.EventResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.Event;
import com.startupocean.Startup.Collaboration.Portal.entity.EventParticipant;
import com.startupocean.Startup.Collaboration.Portal.entity.User;
import com.startupocean.Startup.Collaboration.Portal.repository.EventParticipantRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.EventRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final EventParticipantRepository eventParticipantRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated() ||
                    authentication.getPrincipal().equals("anonymousUser")) {
                return null;
            }
            String email = authentication.getName();
            return userRepository.findByEmailAndIsActiveTrue(email).orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public ApiResponse createEvent(EventRequest request) {
        User user = getAuthenticatedUser();

        Event event = new Event();
        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setOrganizer(user);
        event.setMaxParticipants(request.getMaxParticipants());
        event.setEventType(request.getEventType());
        event.setIsActive(true);

        Event savedEvent = eventRepository.save(event);

        return new ApiResponse(true, "Event created successfully", convertToResponse(savedEvent, user));
    }

    @Transactional
    public ApiResponse updateEvent(Long eventId, EventRequest request) {
        User user = getAuthenticatedUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getUserId().equals(user.getUserId())) {
            return new ApiResponse(false, "Unauthorized to update this event", null);
        }

        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setEventType(request.getEventType());

        Event updatedEvent = eventRepository.save(event);

        return new ApiResponse(true, "Event updated successfully", convertToResponse(updatedEvent, user));
    }
    public ApiResponse getAllEvents() {
        User currentUser = getCurrentUser();

        List<Event> events = eventRepository.findByIsActiveTrueOrderByEventDateDesc();
        List<EventResponse> responses = events.stream()
                .map(event -> convertToResponse(event, currentUser))
                .collect(Collectors.toList());

        return new ApiResponse(true, "Events retrieved successfully", responses);
    }
    public ApiResponse getUpcomingEvents() {
        User currentUser = getCurrentUser();

        List<Event> events = eventRepository.findUpcomingEvents();
        List<EventResponse> responses = events.stream()
                .map(event -> convertToResponse(event, currentUser))
                .collect(Collectors.toList());

        return new ApiResponse(true, "Upcoming events retrieved successfully", responses);
    }
    public ApiResponse getPastEvents() {
        User currentUser = getCurrentUser();

        List<Event> events = eventRepository.findPastEvents();
        List<EventResponse> responses = events.stream()
                .map(event -> convertToResponse(event, currentUser))
                .collect(Collectors.toList());

        return new ApiResponse(true, "Past events retrieved successfully", responses);
    }
    public ApiResponse getMyEvents() {
        User user = getAuthenticatedUser();

        List<Event> events = eventRepository.findByOrganizerAndIsActiveTrue(user);
        List<EventResponse> responses = events.stream()
                .map(event -> convertToResponse(event, user))
                .collect(Collectors.toList());

        return new ApiResponse(true, "Your events retrieved successfully", responses);
    }

    public ApiResponse getEventById(Long eventId) {
        User currentUser = getCurrentUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return new ApiResponse(true, "Event retrieved successfully", convertToResponse(event, currentUser));
    }

    @Transactional
    public ApiResponse registerForEvent(Long eventId) {
        User user = getAuthenticatedUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (eventParticipantRepository.existsByEventAndUserAndIsActiveTrue(event, user)) {
            return new ApiResponse(false, "Already registered for this event", null);
        }

        Long registeredCount = eventParticipantRepository.countRegisteredParticipants(event);
        if (event.getMaxParticipants() != null && registeredCount >= event.getMaxParticipants()) {
            return new ApiResponse(false, "Event is full", null);
        }

        EventParticipant participant = new EventParticipant();
        participant.setEvent(event);
        participant.setUser(user);
        participant.setStatus(EventParticipant.ParticipantStatus.REGISTERED);
        participant.setIsActive(true);

        eventParticipantRepository.save(participant);

        return new ApiResponse(true, "Successfully registered for event", null);
    }

    @Transactional
    public ApiResponse cancelRegistration(Long eventId) {
        User user = getAuthenticatedUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventParticipant participant = eventParticipantRepository.findByEventAndUser(event, user)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        participant.setStatus(EventParticipant.ParticipantStatus.CANCELLED);
        participant.setIsActive(false);
        eventParticipantRepository.save(participant);

        return new ApiResponse(true, "Registration cancelled successfully", null);
    }

    @Transactional
    public ApiResponse deleteEvent(Long eventId) {
        User user = getAuthenticatedUser();

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getUserId().equals(user.getUserId())) {
            return new ApiResponse(false, "Unauthorized to delete this event", null);
        }

        event.softDelete();
        eventRepository.save(event);

        return new ApiResponse(true, "Event deleted successfully", null);
    }

    private EventResponse convertToResponse(Event event, User currentUser) {
        EventResponse response = new EventResponse();
        response.setEventId(event.getEventId());
        response.setEventName(event.getEventName());
        response.setEventDescription(event.getEventDescription());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setOrganizerName(event.getOrganizer().getName());
        response.setOrganizerEmail(event.getOrganizer().getEmail());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setEventType(event.getEventType());
        response.setCreatedAt(event.getCreatedAt());

        Long registeredCount = eventParticipantRepository.countRegisteredParticipants(event);
        response.setRegisteredParticipants(registeredCount);

        if (currentUser != null) {
            response.setRegistered(
                    eventParticipantRepository.existsByEventAndUserAndIsActiveTrue(event, currentUser)
            );
        } else {
            response.setRegistered(false);
        }

        return response;
    }
}