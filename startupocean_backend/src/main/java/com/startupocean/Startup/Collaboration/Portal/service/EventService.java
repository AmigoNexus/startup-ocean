package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.EventRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.EventResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.entity.Event;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final CompanyRepository companyRepository;

    private Company getAuthenticatedCompany() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return companyRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("Company not found"));
    }

    @Transactional
    public ApiResponse createEvent(EventRequest request) {

        Company company = getAuthenticatedCompany();

        Event event = new Event();
        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setOrganizer(company.getCompanyName());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setEventType(request.getEventType());
        event.setIsActive(true);

        Event savedEvent = eventRepository.save(event);

        return new ApiResponse(true, "Event created successfully", convertToResponse(savedEvent));
    }

    @Transactional
    public ApiResponse updateEvent(Long eventId, EventRequest request) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setEventName(request.getEventName());
        event.setEventDescription(request.getEventDescription());
        event.setEventDate(request.getEventDate());
        event.setLocation(request.getLocation());
        event.setMaxParticipants(request.getMaxParticipants());
        event.setEventType(request.getEventType());

        Event updatedEvent = eventRepository.save(event);

        return new ApiResponse(true, "Event updated successfully", convertToResponse(updatedEvent));
    }

    public ApiResponse getAllEvents() {

        List<Event> events = eventRepository.findByIsActiveTrueOrderByEventDateDesc();

        List<EventResponse> responses = events.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Events retrieved successfully", responses);
    }

    public ApiResponse getEventById(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        return new ApiResponse(true, "Event retrieved successfully", convertToResponse(event));
    }

    @Transactional
    public ApiResponse deleteEvent(Long eventId) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.softDelete();
        eventRepository.save(event);

        return new ApiResponse(true, "Event deleted successfully", null);
    }

    private EventResponse convertToResponse(Event event) {

        EventResponse response = new EventResponse();

        response.setEventId(event.getEventId());
        response.setEventName(event.getEventName());
        response.setEventDescription(event.getEventDescription());
        response.setEventDate(event.getEventDate());
        response.setLocation(event.getLocation());
        response.setOrganizerName(event.getOrganizer());
        response.setMaxParticipants(event.getMaxParticipants());
        response.setEventType(event.getEventType());
        response.setCreatedAt(event.getCreatedAt());

        return response;
    }
}