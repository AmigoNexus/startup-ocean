package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.*;
import com.startupocean.Startup.Collaboration.Portal.entity.Company;
import com.startupocean.Startup.Collaboration.Portal.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final CompanyRepository companyRepository;
    private final EmailService emailService;

    private static final Logger log =
            LoggerFactory.getLogger(AuthService.class);

    @Transactional
    public ApiResponse sendOtp(String email) {

        log.info("OTP request received for email: {}", email);
        if (companyRepository.findByEmailAndIsActiveTrue(email).isPresent()) {
            log.warn("OTP blocked - account already exists: {}", email);

            return new ApiResponse(
                    false,
                    "Account already exists with this Email",
                    null
            );
        }

        String otp = generateOTP();
        String k = key(email);

        log.debug("Generated OTP for {} -> {}", email, otp);

        otpStore.put(k, otp);
        otpExpiryStore.put(k,
                LocalDateTime.now().plusMinutes(10));

        log.info("OTP stored and expiry set for {}", email);

        emailService.sendOtpEmail(email, otp);

        log.info("OTP email sent successfully to {}", email);

        return new ApiResponse(
                true,
                "OTP sent successfully",
                null
        );
    }

    @Transactional
    public ApiResponse verifyOtp(OtpRequest request) {

        String otpKey = key(request.getEmail());

        String storedOtp = otpStore.get(otpKey);
        LocalDateTime expiry = otpExpiryStore.get(otpKey);

        if(storedOtp == null || !storedOtp.equals(request.getOtp()))
            return new ApiResponse(false,"Invalid OTP",null);

        if(expiry.isBefore(LocalDateTime.now()))
            return new ApiResponse(false,"OTP expired",null);

        otpStore.remove(otpKey);
        otpExpiryStore.remove(otpKey);

        Map<String,Object> claims = new HashMap<>();

        String jwtToken = jwtService.generateToken(
                claims,
                new org.springframework.security.core.userdetails.User(
                        request.getEmail(),
                        "",
                        java.util.List.of()
                )
        );

        return new ApiResponse(true,"OTP verified",
                new AuthResponse(
                        jwtToken,
                        request.getEmail(),
                        request.getEmail(),
                        null,
                        true,
                        false
                ));
    }

    @Transactional
    public ApiResponse register(RegisterRequest request) {

        String otp = generateOTP();

        String k = key(request.getEmail());

        otpStore.put(k, otp);
        otpExpiryStore.put(k, LocalDateTime.now().plusMinutes(10));

        emailService.sendOtpEmail(request.getEmail(), otp);

        return new ApiResponse(true,"OTP sent",null);
    }

    @Transactional
    public ApiResponse requestLoginOtp(LoginRequest request) {

            Company company = companyRepository
                    .findByEmailAndIsActiveTrue(request.getEmail())
                    .orElseThrow(() ->
                            new RuntimeException("Company not found with this email"));


            String otp = generateOTP();

        String k = key(request.getEmail());
        otpStore.put(k, otp);
        otpExpiryStore.put(k, LocalDateTime.now().plusMinutes(10));

        emailService.sendOtpEmail(company.getEmail(), otp);

        return new ApiResponse(true, "Login OTP sent successfully", null);
    }
    @Transactional
    public AuthResponse verifyLoginOtp(OtpRequest request) {

            Company company = companyRepository
                    .findByEmailAndIsActiveTrue(request.getEmail())
                    .orElseThrow(() ->
                            new RuntimeException("Company not found"));


            String otpKey = key(request.getEmail());
        String storedOtp = otpStore.get(otpKey);
        LocalDateTime expiry = otpExpiryStore.get(otpKey);

        if (storedOtp == null) {
            throw new RuntimeException("OTP not requested");
        }

        if (!storedOtp.equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (expiry == null || expiry.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        otpStore.remove(otpKey);
        otpExpiryStore.remove(otpKey);

        String jwtToken = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        company.getEmail(),
                        "",
                        java.util.Collections.emptyList()
                )
        );

        return new AuthResponse(
                jwtToken,
                company.getCompanyName(),
                company.getEmail(),
                company.getCompanyId(),
                true,
                true
        );
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
    private static final Map<String, String> otpStore = new ConcurrentHashMap<>();
    private static final Map<String, LocalDateTime> otpExpiryStore = new ConcurrentHashMap<>();
    private String key(String email){
        return email;
    }

}