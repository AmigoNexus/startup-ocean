package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.CollaborationRequest;
import com.startupocean.Startup.Collaboration.Portal.service.CollaborationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/collaborations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CollaborationController {

    private final CollaborationService collaborationService;

    @PostMapping
    public ResponseEntity<ApiResponse> sendCollaborationRequest(
            @Valid @RequestBody CollaborationRequest request) {
        ApiResponse response = collaborationService.sendCollaborationRequest(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse> getSentCollaborations() {
        ApiResponse response = collaborationService.getSentCollaborations();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse> getReceivedCollaborations() {
        ApiResponse response = collaborationService.getReceivedCollaborations();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{collaborationId}/accept")
    public ResponseEntity<ApiResponse> acceptCollaboration(@PathVariable Long collaborationId) {
        ApiResponse response = collaborationService.acceptCollaboration(collaborationId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{collaborationId}/reject")
    public ResponseEntity<ApiResponse> rejectCollaboration(@PathVariable Long collaborationId) {
        ApiResponse response = collaborationService.rejectCollaboration(collaborationId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{collaborationId}")
    public ResponseEntity<ApiResponse> deleteCollaboration(@PathVariable Long collaborationId) {
        ApiResponse response = collaborationService.deleteCollaboration(collaborationId);
        return ResponseEntity.ok(response);
    }
}