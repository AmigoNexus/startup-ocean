package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.*;
import com.startupocean.Startup.Collaboration.Portal.entity.*;
import com.startupocean.Startup.Collaboration.Portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final OfferingRepository offeringRepository;
    private final SocialLinkRepository socialLinkRepository;
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
    public ApiResponse createCompany(CompanyRequest request) {
        User user = getAuthenticatedUser();
        if (companyRepository.findByUserAndIsActiveTrue(user).isPresent()) {
            return new ApiResponse(false, "You already have a registered company", null);
        }
        Company company = new Company();
        company.setUser(user);
        company.setCompanyName(request.getCompanyName());
        company.setDescription(request.getDescription());
        company.setCompanyType(Company.CompanyType.valueOf(request.getCompanyType()));
        company.setPhoneNumber(request.getPhoneNumber());
        company.setIsActive(true);

        Company savedCompany = companyRepository.save(company);
        if (request.getOfferings() != null && !request.getOfferings().isEmpty()) {
            for (String offeringName : request.getOfferings()) {
                Offering offering = new Offering();
                offering.setCompany(savedCompany);
                offering.setOfferingName(offeringName);
                offering.setIsActive(true);
                offeringRepository.save(offering);
            }
        }
        if (request.getSocialLinks() != null) {
            SocialLink socialLink = new SocialLink();
            socialLink.setCompany(savedCompany);
            socialLink.setWebsite(request.getSocialLinks().getWebsite());
            socialLink.setLinkedin(request.getSocialLinks().getLinkedin());
            socialLink.setFacebook(request.getSocialLinks().getFacebook());
            socialLink.setInstagram(request.getSocialLinks().getInstagram());
            socialLink.setTwitter(request.getSocialLinks().getTwitter());
            socialLink.setIsActive(true);
            socialLinkRepository.save(socialLink);
        }

        return new ApiResponse(true, "Company created successfully",
                convertToResponse(savedCompany));
    }

    @Transactional
    public ApiResponse updateCompany(Long companyId, CompanyRequest request) {
        User user = getAuthenticatedUser();

        Company company = companyRepository.findByCompanyIdAndIsActiveTrue(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getUser().getUserId().equals(user.getUserId())) {
            return new ApiResponse(false, "Unauthorized to update this company", null);
        }

        company.setCompanyName(request.getCompanyName());
        company.setDescription(request.getDescription());
        company.setPhoneNumber(request.getPhoneNumber());

        Company updatedCompany = companyRepository.save(company);
        List<Offering> existingOfferings = offeringRepository.findByCompanyAndIsActiveTrue(company);
        existingOfferings.forEach(Offering::softDelete);
        offeringRepository.saveAll(existingOfferings);

        if (request.getOfferings() != null && !request.getOfferings().isEmpty()) {
            for (String offeringName : request.getOfferings()) {
                Offering offering = new Offering();
                offering.setCompany(updatedCompany);
                offering.setOfferingName(offeringName);
                offering.setIsActive(true);
                offeringRepository.save(offering);
            }
        }
        if (request.getSocialLinks() != null) {
            SocialLink socialLink = socialLinkRepository.findByCompanyAndIsActiveTrue(company)
                    .orElse(new SocialLink());
            socialLink.setCompany(updatedCompany);
            socialLink.setWebsite(request.getSocialLinks().getWebsite());
            socialLink.setLinkedin(request.getSocialLinks().getLinkedin());
            socialLink.setFacebook(request.getSocialLinks().getFacebook());
            socialLink.setInstagram(request.getSocialLinks().getInstagram());
            socialLink.setTwitter(request.getSocialLinks().getTwitter());
            socialLink.setIsActive(true);
            socialLinkRepository.save(socialLink);
        }

        return new ApiResponse(true, "Company updated successfully",
                convertToResponse(updatedCompany));
    }
    public ApiResponse getMyCompany() {
        User user = getAuthenticatedUser();

        Company company = companyRepository.findByUserAndIsActiveTrue(user)
                .orElse(null);

        if (company == null) {
            return new ApiResponse(false, "No company found for this user", null);
        }

        return new ApiResponse(true, "Company retrieved successfully",
                convertToResponse(company));
    }
    public ApiResponse getAllCompanies(String companyType) {
        List<Company> companies;

        if (companyType != null && !companyType.isEmpty()) {
            companies = companyRepository.findByCompanyTypeAndIsActiveTrue(
                    Company.CompanyType.valueOf(companyType));
        } else {
            companies = companyRepository.findByIsActiveTrue();
        }

        List<CompanyResponse> responses = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Companies retrieved successfully", responses);
    }
    public ApiResponse getCompanyById(Long companyId) {
        Company company = companyRepository.findByCompanyIdAndIsActiveTrue(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        return new ApiResponse(true, "Company retrieved successfully",
                convertToResponse(company));
    }
    public ApiResponse searchCompanies(String keyword) {
        List<Company> companies = companyRepository.searchCompanies(keyword);

        List<CompanyResponse> responses = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Search results retrieved successfully", responses);
    }
    public ApiResponse searchByOffering(String offering) {
        List<Company> companies = companyRepository.searchByOffering(offering);

        List<CompanyResponse> responses = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true, "Search results retrieved successfully", responses);
    }

    @Transactional
    public ApiResponse deleteCompany(Long companyId) {
        User user = getAuthenticatedUser();

        Company company = companyRepository.findByCompanyIdAndIsActiveTrue(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        if (!company.getUser().getUserId().equals(user.getUserId())) {
            return new ApiResponse(false, "Unauthorized to delete this company", null);
        }

        company.softDelete();
        companyRepository.save(company);

        return new ApiResponse(true, "Company deleted successfully", null);
    }

    CompanyResponse convertToResponse(Company company) {
        CompanyResponse response = new CompanyResponse();

        response.setCompanyId(company.getCompanyId());
        response.setCompanyName(company.getCompanyName());
        response.setDescription(company.getDescription());
        response.setCompanyType(company.getCompanyType().name());
        response.setEmail(company.getUser().getEmail());
        response.setPhoneNumber(company.getPhoneNumber());
        response.setCreatedAt(company.getCreatedAt());

        List<String> offeringNames = offeringRepository
                .findByCompanyAndIsActiveTrue(company)
                .stream()
                .map(Offering::getOfferingName)
                .collect(Collectors.toList());

        response.setOfferings(offeringNames);

        SocialLink socialLink = socialLinkRepository
                .findByCompanyAndIsActiveTrue(company)
                .orElse(null);

        if (socialLink != null) {
            SocialLinkResponse slResponse = new SocialLinkResponse();
            slResponse.setWebsite(socialLink.getWebsite());
            slResponse.setLinkedin(socialLink.getLinkedin());
            slResponse.setFacebook(socialLink.getFacebook());
            slResponse.setInstagram(socialLink.getInstagram());
            slResponse.setTwitter(socialLink.getTwitter());

            response.setSocialLinks(slResponse);
        }

        return response;
    }
}