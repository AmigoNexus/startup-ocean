package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.MessageRequest;
import com.startupocean.Startup.Collaboration.Portal.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse> sendMessage(@Valid @RequestBody MessageRequest request) {
        ApiResponse response = messageService.sendMessage(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @GetMapping("/collaboration/{collaborationId}")
    public ResponseEntity<ApiResponse> getMessages(@PathVariable Long collaborationId) {
        ApiResponse response = messageService.getMessages(collaborationId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long messageId) {
        ApiResponse response = messageService.markAsRead(messageId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse> getUnreadMessageCount() {
        ApiResponse response = messageService.getUnreadMessageCount();
        return ResponseEntity.ok(response);
    }
}