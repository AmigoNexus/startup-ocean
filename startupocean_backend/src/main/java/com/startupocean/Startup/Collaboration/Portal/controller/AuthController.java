package com.startupocean.Startup.Collaboration.Portal.controller;

import com.startupocean.Startup.Collaboration.Portal.dto.*;
import com.startupocean.Startup.Collaboration.Portal.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse> resendOtp(
            @RequestParam String email
    ) {
        return ResponseEntity.ok(
                authService.sendOtp(email)
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse> verifyOtp(@Valid @RequestBody OtpRequest request) {
        ApiResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse response = authService.register(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    @PostMapping("/login/request-otp")
    public ResponseEntity<ApiResponse> requestLoginOtp(@Valid @RequestBody LoginRequest request) {
        ApiResponse response = authService.requestLoginOtp(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login/verify-otp")
    public ResponseEntity<AuthResponse> verifyLoginOtp(@Valid @RequestBody OtpRequest request) {
        AuthResponse response = authService.verifyLoginOtp(request);
        return ResponseEntity.ok(response);
    }
}