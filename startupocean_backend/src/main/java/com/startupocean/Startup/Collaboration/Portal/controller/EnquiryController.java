package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.EnquiryRequest;
import com.startupocean.Startup.Collaboration.Portal.service.EnquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/enquiries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse> submitEnquiry(@Valid @RequestBody EnquiryRequest request) {
        ApiResponse response = enquiryService.submitEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllEnquiries() {
        ApiResponse response = enquiryService.getAllEnquiries();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{enquiryId}/status")
    public ResponseEntity<ApiResponse> updateEnquiryStatus(
            @PathVariable Long enquiryId,
            @RequestParam String status) {
        ApiResponse response = enquiryService.updateEnquiryStatus(enquiryId, status);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{enquiryId}")
    public ResponseEntity<ApiResponse> deleteEnquiry(@PathVariable Long enquiryId) {
        ApiResponse response = enquiryService.deleteEnquiry(enquiryId);
        return ResponseEntity.ok(response);
    }
}
