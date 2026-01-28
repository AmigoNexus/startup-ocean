package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.CollaborationRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.CollaborationResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.Collaboration;
import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.entity.User;
import com.startupocean.Startup.Collaboration.Portal.repository.CollaborationRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final CollaborationRepository collaborationRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final CompanyService companyService;

    @Transactional
    public ApiResponse sendCollaborationRequest(CollaborationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company requesterCompany = companyRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("You must have a registered company to send collaboration requests"));

        Company targetCompany = companyRepository.findByCompanyIdAndIsActiveTrue(request.getTargetCompanyId())
                .orElseThrow(() -> new RuntimeException("Target company not found"));

        if (requesterCompany.getCompanyId().equals(targetCompany.getCompanyId())) {
            return new ApiResponse(false, "Cannot send collaboration request to your own company", null);
        }

        Collaboration collaboration = new Collaboration();
        collaboration.setRequesterCompany(requesterCompany);
        collaboration.setTargetCompany(targetCompany);
        collaboration.setMessage(request.getMessage());
        collaboration.setStatus(Collaboration.CollaborationStatus.PENDING);
        collaboration.setIsActive(true);

        Collaboration savedCollaboration = collaborationRepository.save(collaboration);
        emailService.sendCollaborationRequestEmail(
                targetCompany.getUser().getEmail(),
                requesterCompany.getCompanyName(),
                request.getMessage()
        );

        return new ApiResponse(true, "Collaboration request sent successfully", null);
    }

    public ApiResponse getSentCollaborations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        List<Collaboration> collaborations = collaborationRepository.findByRequesterCompanyAndIsActiveTrue(company);

        return new ApiResponse(true, "Sent collaborations retrieved successfully",
                collaborations.stream().map(this::convertToResponse).collect(Collectors.toList()));
    }

    public ApiResponse getReceivedCollaborations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Company company = companyRepository.findByUserAndIsActiveTrue(user)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        List<Collaboration> collaborations = collaborationRepository.findByTargetCompanyAndIsActiveTrue(company);

        return new ApiResponse(true, "Received collaborations retrieved successfully",
                collaborations.stream().map(this::convertToResponse).collect(Collectors.toList()));
    }

    @Transactional
    public ApiResponse acceptCollaboration(Long collaborationId) {
        Collaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        collaboration.setStatus(Collaboration.CollaborationStatus.ACCEPTED);
        collaborationRepository.save(collaboration);

        return new ApiResponse(true, "Collaboration accepted successfully", null);
    }

    @Transactional
    public ApiResponse rejectCollaboration(Long collaborationId) {
        Collaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        collaboration.setStatus(Collaboration.CollaborationStatus.REJECTED);
        collaborationRepository.save(collaboration);

        return new ApiResponse(true, "Collaboration rejected", null);
    }

    @Transactional
    public ApiResponse deleteCollaboration(Long collaborationId) {
        Collaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        collaboration.softDelete();
        collaborationRepository.save(collaboration);

        return new ApiResponse(true, "Collaboration deleted successfully", null);
    }

    private CollaborationResponse convertToResponse(Collaboration collaboration) {

        CollaborationResponse response = new CollaborationResponse();
        response.setCollaborationId(collaboration.getCollaborationId());
        response.setStatus(collaboration.getStatus().name());
        response.setMessage(collaboration.getMessage());
        response.setCreatedAt(collaboration.getCreatedAt());

        response.setRequesterCompany(
                companyService.convertToResponse(collaboration.getRequesterCompany())
        );

        response.setTargetCompany(
                companyService.convertToResponse(collaboration.getTargetCompany())
        );

        return response;
    }

}