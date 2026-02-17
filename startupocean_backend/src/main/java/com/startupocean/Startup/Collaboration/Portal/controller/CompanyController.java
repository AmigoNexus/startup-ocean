package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.CompanyRequest;
import com.startupocean.Startup.Collaboration.Portal.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse> createCompany(
            @Valid @RequestBody CompanyRequest request) {

        log.info("➡️ Create Company Request received | Name: {}",
                request.getCompanyName());

        try {
            ApiResponse response = companyService.createCompany(request);
            if(response.isSuccess()){
                log.info("✅ Company created successfully | Name: {}",
                        request.getCompanyName());
            } else {
                log.warn("⚠️ Company creation failed | Reason: {}",
                        response.getMessage());
            }

            return ResponseEntity
                    .status(response.isSuccess()
                            ? HttpStatus.CREATED
                            : HttpStatus.BAD_REQUEST)
                    .body(response);

        } catch (Exception ex) {
            log.error("🔥 Exception during company creation", ex);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false,
                            "Internal server error",
                            null));
        }
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<ApiResponse> updateCompany(
            @PathVariable Long companyId,
            @Valid @RequestBody CompanyRequest request) {
        log.info("Updating company {}", companyId);

        ApiResponse response = companyService.updateCompany(companyId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-company")
    public ResponseEntity<ApiResponse> getMyCompany() {
        log.info("Fetching logged-in user company");
        ApiResponse response = companyService.getMyCompany();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/public/{companyId}")
    public ResponseEntity<ApiResponse> getCompanyById(@PathVariable Long companyId) {
        log.info("Fetching company by ID {}", companyId);
        ApiResponse response = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchCompanies(@RequestParam String keyword) {
        log.info("Searching companies with keyword {}", keyword);
        ApiResponse response = companyService.searchCompanies(keyword);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/offering")
    public ResponseEntity<ApiResponse> searchByOffering(@RequestParam String offering) {
        log.info("Searching companies by offering {}", offering);
        ApiResponse response = companyService.searchByOffering(offering);
        return ResponseEntity.ok(response);
    }
}