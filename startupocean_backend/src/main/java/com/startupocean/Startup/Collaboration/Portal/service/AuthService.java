package com.startupocean.Startup.Collaboration.Portal.service;

import com.startupocean.Startup.Collaboration.Portal.dto.*;
import com.startupocean.Startup.Collaboration.Portal.entity.User;
import com.startupocean.Startup.Collaboration.Portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Transactional
    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already registered", null);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(User.UserRole.valueOf(request.getRole()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setProfileComplete(false);

        String otp = generateOTP();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);
        emailService.sendOtpEmail(user.getEmail(), otp);

        return new ApiResponse(true, "Registration successful. Please verify your email with OTP.", null);
    }

    @Transactional
    public ApiResponse verifyOtp(OtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            return new ApiResponse(false, "Invalid OTP", null);
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return new ApiResponse(false, "OTP expired", null);
        }

        user.setIsVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        "", // No password
                        java.util.Collections.emptyList()
                )
        );

        AuthResponse authResponse = new AuthResponse(
                jwtToken,
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getUserId(),
                user.getIsVerified(),
                user.getProfileComplete()
        );

        return new ApiResponse(true, "Email verified successfully", authResponse);
    }

    @Transactional
    public ApiResponse resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = generateOTP();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return new ApiResponse(true, "OTP resent successfully", null);
    }

    @Transactional
    public ApiResponse requestLoginOtp(LoginRequest request) {
        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found or inactive"));

        String otp = generateOTP();
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), otp);

        return new ApiResponse(true, "OTP sent to your email", null);
    }

    @Transactional
    public AuthResponse verifyLoginOtp(OtpRequest request) {
        User user = userRepository.findByEmailAndIsActiveTrue(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsVerified()) {
            throw new RuntimeException("Email not verified. Please verify your email first.");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        "",
                        java.util.Collections.emptyList()
                )
        );

        return new AuthResponse(
                jwtToken,
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getUserId(),
                user.getIsVerified(),
                user.getProfileComplete()
        );
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}