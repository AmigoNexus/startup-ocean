package com.startupocean.Startup.Collaboration.Portal.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp, String customTemplate) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("noreply@startupocean.in");
            helper.setTo(toEmail);
            helper.setSubject("StartupOcean - Email Verification OTP");

            String htmlContent = (customTemplate != null && !customTemplate.isBlank())
                    ? customTemplate.replace("{{OTP}}", otp)
                    : getDefaultOtpTemplate(otp);

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String getDefaultOtpTemplate(String otp) {
        return """
        <div style="font-family:Arial;background:#f5f5f5;padding:30px">
          <div style="background:white;padding:20px;border-radius:10px">
            <h2 style="color:#0d9488">StartupOcean</h2>
    
            <p>Your OTP for verification:</p>
    
            <h1 style="
              text-align:center;
              letter-spacing:6px;
              color:#0d9488;
              border:2px dashed #0d9488;
              padding:12px;
            ">
              %s
            </h1>
    
            <p>This OTP is valid for 10 minutes.</p>
    
            <hr/>
            <p style="font-size:12px;color:gray">
              StartupOcean Team
            </p>
          </div>
        </div>
        """.formatted(otp);
    }
    public void sendCollaborationRequestEmail(String toEmail, String companyName, String message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom("noreply@startupocean.in");
            helper.setTo(toEmail);
            helper.setSubject("New Collaboration Request from " + companyName);

            String html = """
            <div style="font-family:Arial;padding:20px">
              <h2 style="color:#0d9488">StartupOcean</h2>
    
              <p>You received a collaboration request from:</p>
              <h3 style="color:#0d9488">%s</h3>
    
              <div style="background:#f5f5f5;padding:15px;border-radius:8px">
                <b>Message:</b>
                <p>%s</p>
              </div>
    
              <p>Login to StartupOcean to respond.</p>
            </div>
            """.formatted(companyName, message);

            helper.setText(html, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send collaboration email", e);
        }
    }
}
