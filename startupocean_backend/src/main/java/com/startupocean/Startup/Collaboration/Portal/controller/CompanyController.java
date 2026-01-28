package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.ApiResponse;
import com.startupocean.Startup.Collaboration.Portal.dto.CompanyRequest;
import com.startupocean.Startup.Collaboration.Portal.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ResponseEntity<ApiResponse> createCompany(@Valid @RequestBody CompanyRequest request) {
        ApiResponse response = companyService.createCompany(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<ApiResponse> updateCompany(
            @PathVariable Long companyId,
            @Valid @RequestBody CompanyRequest request) {
        ApiResponse response = companyService.updateCompany(companyId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-company")
    public ResponseEntity<ApiResponse> getMyCompany() {
        ApiResponse response = companyService.getMyCompany();
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCompanies(
            @RequestParam(required = false) String companyType) {
        ApiResponse response = companyService.getAllCompanies(companyType);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/public/{companyId}")
    public ResponseEntity<ApiResponse> getCompanyById(@PathVariable Long companyId) {
        ApiResponse response = companyService.getCompanyById(companyId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchCompanies(@RequestParam String keyword) {
        ApiResponse response = companyService.searchCompanies(keyword);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search/offering")
    public ResponseEntity<ApiResponse> searchByOffering(@RequestParam String offering) {
        ApiResponse response = companyService.searchByOffering(offering);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{companyId}")
    public ResponseEntity<ApiResponse> deleteCompany(@PathVariable Long companyId) {
        ApiResponse response = companyService.deleteCompany(companyId);
        return ResponseEntity.ok(response);
    }
}
