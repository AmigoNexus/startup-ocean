package com.startupocean.Startup.Collaboration.Portal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Async
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@startupocean.in");
        message.setTo(toEmail);
        message.setSubject("StartupOcean - Email Verification OTP");
        message.setText("Your OTP for email verification is: " + otp + "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Thanks,\nStartupOcean Team");

        mailSender.send(message);
    }

    public void sendCollaborationRequestEmail(String toEmail, String companyName, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom("noreply@startupocean.in");
        mailMessage.setTo(toEmail);
        mailMessage.setSubject("New Collaboration Request from " + companyName);
        mailMessage.setText("You have received a new collaboration request from " + companyName + ".\n\n" +
                "Message: " + message + "\n\n" +
                "Please login to StartupOcean to respond.\n\n" +
                "Thanks,\nStartupOcean Team");

        mailSender.send(mailMessage);
    }
}
