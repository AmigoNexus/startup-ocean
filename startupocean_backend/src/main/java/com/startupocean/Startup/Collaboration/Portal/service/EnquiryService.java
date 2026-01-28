package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.EnquiryRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.EnquiryResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.Enquiry;
import com.startupocean.Startup.Collaboration.Portal.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    @Transactional
    public ApiResponse submitEnquiry(EnquiryRequest request) {
        Enquiry enquiry = new Enquiry();
        enquiry.setName(request.getName());
        enquiry.setEmail(request.getEmail());
        enquiry.setPhone(request.getPhone());
        enquiry.setMessage(request.getMessage());
        enquiry.setStatus(Enquiry.EnquiryStatus.NEW);
        enquiry.setIsActive(true);

        Enquiry savedEnquiry = enquiryRepository.save(enquiry);

        return new ApiResponse(true, "Enquiry submitted successfully", convertToResponse(savedEnquiry));
    }

    public ApiResponse getAllEnquiries() {
        List<Enquiry> enquiries = enquiryRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        List<EnquiryResponse> responses = enquiries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Enquiries retrieved successfully", responses);
    }

    @Transactional
    public ApiResponse updateEnquiryStatus(Long enquiryId, String status) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        enquiry.setStatus(Enquiry.EnquiryStatus.valueOf(status));
        Enquiry updatedEnquiry = enquiryRepository.save(enquiry);

        return new ApiResponse(true, "Enquiry status updated successfully", convertToResponse(updatedEnquiry));
    }

    @Transactional
    public ApiResponse deleteEnquiry(Long enquiryId) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new RuntimeException("Enquiry not found"));

        enquiry.softDelete();
        enquiryRepository.save(enquiry);

        return new ApiResponse(true, "Enquiry deleted successfully", null);
    }

    private EnquiryResponse convertToResponse(Enquiry enquiry) {
        EnquiryResponse response = new EnquiryResponse();
        response.setEnquiryId(enquiry.getEnquiryId());
        response.setName(enquiry.getName());
        response.setEmail(enquiry.getEmail());
        response.setPhone(enquiry.getPhone());
        response.setMessage(enquiry.getMessage());
        response.setStatus(enquiry.getStatus().name());
        response.setCreatedAt(enquiry.getCreatedAt());
        return response;
    }
}