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
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final ServiceRepository CompanyServiceRepository;
    private final OfferingRepository offeringRepository;
    private final SocialLinkRepository socialLinkRepository;
    private final JwtService jwtService;
    @Transactional
    public ApiResponse createCompany(CompanyRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return new ApiResponse(false, "Email is required", null);
        }
        if (companyRepository.findByEmailAndIsActiveTrue(request.getEmail()).isPresent()) {
            return new ApiResponse(false, "Company already registered with this email", null);
        }

        Company company = new Company();
        company.setEmail(request.getEmail());
        company.setCompanyName(request.getCompanyName());
        company.setCity(request.getCity());
        company.setIsActive(true);

        Company savedCompany = companyRepository.save(company);

        if (request.getServices() != null) {
            for (ServiceRequest s : request.getServices()) {

                ServiceEntity service = new ServiceEntity();
                service.setCompany(savedCompany);
                service.setDescription(s.getDescription());
                service.setType(Company.CompanyType.valueOf(s.getType()));
                service.setPhoneNumber(
                        s.getPhoneNumber() != null && !s.getPhoneNumber().isBlank()
                                ? s.getPhoneNumber()
                                : null
                );

                service.setIsPhoneVisible(
                        s.getIsPhoneVisible() != null
                                ? s.getIsPhoneVisible()
                                : true
                );

                ServiceEntity savedService = CompanyServiceRepository.save(service);

                if (s.getOfferings() != null) {
                    for (String offeringName : s.getOfferings()) {

                        Offering offering = new Offering();
                        offering.setService(savedService);
                        offering.setOfferingName(offeringName);
                        offering.setIsActive(true);

                        offeringRepository.save(offering);
                    }
                }
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

        return new ApiResponse(true, "Company created successfully", convertToResponse(savedCompany));
    }
    @Transactional
    public ApiResponse updateCompany(Long companyId, CompanyRequest request) {

        Company company = companyRepository
                .findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        if (!company.getEmail().equals(email)) {
            return new ApiResponse(false, "Unauthorized", null);
        }

        company.setCompanyName(request.getCompanyName());
        company.setCity(request.getCity());

        Company updatedCompany = companyRepository.save(company);

        List<ServiceEntity> existingServices = CompanyServiceRepository.findByCompany(company);
        CompanyServiceRepository.deleteAll(existingServices);

        if (request.getServices() != null) {

            for (ServiceRequest s : request.getServices()) {

                ServiceEntity service = new ServiceEntity();
                service.setCompany(updatedCompany);
                service.setDescription(s.getDescription());
                service.setType(Company.CompanyType.valueOf(s.getType()));

                service.setPhoneNumber(
                        s.getPhoneNumber() != null && !s.getPhoneNumber().isBlank()
                                ? s.getPhoneNumber()
                                : null
                );

                service.setIsPhoneVisible(
                        s.getIsPhoneVisible() != null
                                ? s.getIsPhoneVisible()
                                : true
                );

                ServiceEntity savedService =
                        CompanyServiceRepository.save(service);

                if (s.getOfferings() != null) {
                    for (String offeringName : s.getOfferings()) {

                        Offering offering = new Offering();
                        offering.setService(savedService);
                        offering.setOfferingName(offeringName);
                        offering.setIsActive(true);

                        offeringRepository.save(offering);
                    }
                }
            }
        }

        if (request.getSocialLinks() != null) {

            SocialLink socialLink = socialLinkRepository
                    .findByCompanyAndIsActiveTrue(company)
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

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        Company company = companyRepository
                .findByEmailAndIsActiveTrue(email)
                .orElse(null);

        if (company == null)
            return new ApiResponse(false,"No company found",null);

        return new ApiResponse(true,
                "Company retrieved",
                convertToResponse(company));
    }

    public ApiResponse getAllCompanies() {

        List<Company> companies = companyRepository.findByIsActiveTrue();

        List<CompanyResponse> responses = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return new ApiResponse(true,
                "Companies retrieved successfully",
                responses);
    }
    public ApiResponse getCompanyById(Long companyId) {
        Company company = (Company) companyRepository.findByCompanyIdAndIsActiveTrue(companyId)
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

    CompanyResponse convertToResponse(Company company) {

        CompanyResponse response = new CompanyResponse();

        response.setCompanyId(company.getCompanyId());
        response.setCompanyName(company.getCompanyName());
        response.setEmail(company.getEmail());
        response.setCity(company.getCity());
        response.setCreatedAt(company.getCreatedAt());

        List<ServiceEntity> serviceEntities =
                CompanyServiceRepository.findByCompany(company);
        List<ServiceResponse> services = serviceEntities
                .stream()
                .map(service -> {
                    ServiceResponse sr = new ServiceResponse();
                    sr.setType(service.getType().name());
                    sr.setDescription(service.getDescription());
                    sr.setPhoneNumber(service.getPhoneNumber());
                    sr.setIsPhoneVisible(service.getIsPhoneVisible());

                    List<String> offerings = offeringRepository
                            .findByServiceAndIsActiveTrue(service)
                            .stream()
                            .map(Offering::getOfferingName)
                            .collect(Collectors.toList());

                    sr.setOfferings(offerings);

                    return sr;
                })
                .collect(Collectors.toList());

        response.setServices(services);

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