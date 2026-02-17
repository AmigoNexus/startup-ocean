package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.MessageRequest;
import com.startupocean.Startup.Collaboration.Portal.dto.MessageResponse;
import com.startupocean.Startup.Collaboration.Portal.entity.Collaboration;
import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.entity.Message;
import com.startupocean.Startup.Collaboration.Portal.repository.CollaborationRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import com.startupocean.Startup.Collaboration.Portal.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final CollaborationRepository collaborationRepository;
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
    public ApiResponse sendMessage(MessageRequest request) {

        Company senderCompany = getAuthenticatedCompany();

        Collaboration collaboration = collaborationRepository.findById(request.getCollaborationId())
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        boolean isRequester = collaboration.getRequesterCompany()
                .getCompanyId().equals(senderCompany.getCompanyId());

        boolean isTarget = collaboration.getTargetCompany()
                .getCompanyId().equals(senderCompany.getCompanyId());

        if (!isRequester && !isTarget) {
            return new ApiResponse(false,
                    "You are not authorized to send messages in this collaboration",
                    null);
        }

        if (collaboration.getStatus() != Collaboration.CollaborationStatus.ACCEPTED) {
            return new ApiResponse(false,
                    "Messages can only be sent in accepted collaborations",
                    null);
        }

        Message message = new Message();
        message.setCollaboration(collaboration);
        message.setSenderCompany(senderCompany);
        message.setContent(request.getContent());
        message.setIsRead(false);
        message.setIsActive(true);

        Message savedMessage = messageRepository.save(message);

        return new ApiResponse(true,
                "Message sent successfully",
                convertToResponse(savedMessage));
    }

    public ApiResponse getMessages(Long collaborationId) {

        Company company = getAuthenticatedCompany();

        Collaboration collaboration = collaborationRepository.findById(collaborationId)
                .orElseThrow(() -> new RuntimeException("Collaboration not found"));

        boolean isRequester = collaboration.getRequesterCompany()
                .getCompanyId().equals(company.getCompanyId());

        boolean isTarget = collaboration.getTargetCompany()
                .getCompanyId().equals(company.getCompanyId());

        if (!isRequester && !isTarget) {
            return new ApiResponse(false,
                    "You are not authorized to view messages in this collaboration",
                    null);
        }

        List<Message> messages = messageRepository
                .findByCollaborationCollaborationIdAndIsActiveTrueOrderByCreatedAtAsc(collaborationId);

        List<MessageResponse> responses = messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true,
                "Messages retrieved successfully",
                responses);
    }

    @Transactional
    public ApiResponse markAsRead(Long messageId) {

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setIsRead(true);
        messageRepository.save(message);

        return new ApiResponse(true, "Message marked as read", null);
    }

    public ApiResponse getUnreadMessageCount() {

        Company company = getAuthenticatedCompany();

        List<Collaboration> collaborations = collaborationRepository
                .findByRequesterCompanyOrTargetCompanyAndIsActiveTrue(company, company);

        long unreadCount = collaborations.stream()
                .flatMap(collab -> messageRepository
                        .findByCollaborationAndIsActiveTrueOrderByCreatedAtAsc(collab)
                        .stream())
                .filter(message -> !message.getSenderCompany()
                        .getCompanyId().equals(company.getCompanyId()))
                .filter(message -> !message.getIsRead())
                .count();

        return new ApiResponse(true,
                "Unread message count retrieved",
                unreadCount);
    }

    private MessageResponse convertToResponse(Message message) {
        MessageResponse response = new MessageResponse();
        response.setMessageId(message.getMessageId());
        response.setCollaborationId(message.getCollaboration().getCollaborationId());
        response.setContent(message.getContent());
        response.setSenderCompanyName(message.getSenderCompany().getCompanyName());
        response.setSenderCompanyId(message.getSenderCompany().getCompanyId());
        response.setIsRead(message.getIsRead());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }
}