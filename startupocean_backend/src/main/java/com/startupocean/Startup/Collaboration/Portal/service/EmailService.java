package com.startupocean.Startup.Collaboration.Portal.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp, String customTemplate) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
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

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("New Collaboration Request from " + companyName);

            String html = """
                    <div style="margin:0;padding:0;background:#f0fdfa;font-family:'Segoe UI',Arial,sans-serif">
                           <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,148,136,0.10)">
                                  <div style="background:linear-gradient(135deg,#0d9488 0%%,#0f766e 100%%);padding:36px 40px;text-align:center">
                                            <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800">StartupOcean 🌊</h1>
                                            <p style="margin:0;color:#99f6e4;font-size:13px;text-transform:uppercase;letter-spacing:1px">Collaboration Request</p>
                                          </div>
                                          <div style="padding:36px 40px">
                                            <p style="margin:0 0 16px;color:#374151;font-size:15px">Hello,</p>
                                            <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.8">
                                              You have received a new collaboration request on <strong>StartupOcean</strong>.
                                            </p>
                                            <div style="background:#f0fdfa;border:1.5px solid #99f6e4;border-radius:12px;padding:16px 24px;margin-bottom:20px">
                                              <p style="margin:0 0 2px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600">From</p>
                                              <p style="margin:0;color:#0d9488;font-size:19px;font-weight:800">%s</p>
                                            </div>
                                            <div style="background:#f9fafb;border-left:4px solid #0d9488;border-radius:0 10px 10px 0;padding:18px 20px;margin-bottom:28px">
                                              <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Message</p>
                                              <p style="margin:0;color:#111827;font-size:14px;line-height:1.8;font-style:italic">"%s"</p>
                                            </div>
                                            <div style="text-align:center;margin:32px 0 8px">
                                              <a href="https://startupocean.in"
                                                 style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px">
                                                Respond Now →
                                              </a>
                                            </div>
                                          </div>
                                          <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
                                            <p style="margin:0;color:#9ca3af;font-size:12px">© StartupOcean · All rights reserved</p>
                                          </div>
                                  </div>
                    </div>
            """.formatted(companyName, message);

            helper.setText(html, true);
            mailSender.send(mimeMessage);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send collaboration email", e);
        }
    }

    @Async
    public void sendNewStartupNotification(String to, String startupName, String template) {

        String subject = "New Startup Joined StartupOcean";

        String body;

        if (template != null && !template.isBlank()) {
            body = template.replace("{{companyName}}", startupName);
        } else {

            body = """
            <div style="font-family:Arial;background:#f4f7f9;padding:30px">
              <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px">

                <h2 style="color:#0d9488">StartupOcean 🌊</h2>

                <p>Hello,</p>

                <p>A new <b>Startup</b> has joined the StartupOcean Community.</p>

                <h3 style="color:#0d9488">%s</h3>

                <p>This could be a great opportunity to collaborate.</p>

                <div style="margin:20px 0">
                  <a href="https://startupocean.in"
                     style="background:#0d9488;color:white;padding:12px 20px;
                     border-radius:6px;text-decoration:none">
                     Explore Startup
                  </a>
                </div>

                <p style="font-size:12px;color:#888;margin-top:30px">
                  © StartupOcean
                </p>

              </div>
            </div>
            """.formatted(startupName);
        }

        sendEmail(to, subject, body);
    }

    @Async
    public void sendNewServiceProviderNotification(String to, String providerName, String template) {

        String subject = "New Service Provider Joined StartupOcean";

        String body;

        if (template != null && !template.isBlank()) {
            body = template.replace("{{companyName}}", providerName);
        } else {

            body = """
            <div style="font-family:Arial;background:#f4f7f9;padding:30px">
              <div style="max-width:600px;margin:auto;background:white;border-radius:10px;padding:30px">

                <h2 style="color:#0d9488">StartupOcean 🌊</h2>

                <p>Hello,</p>

                <p>A new <b>Service Provider</b> has joined StartupOcean.</p>

                <h3 style="color:#0d9488">%s</h3>

                <p>You can now explore their services for your startup.</p>

                <div style="margin:20px 0">
                  <a href="https://startupocean.in"
                     style="background:#0d9488;color:white;padding:12px 20px;
                     border-radius:6px;text-decoration:none">
                     Explore Services
                  </a>
                </div>

                <p style="font-size:12px;color:#888;margin-top:30px">
                  © StartupOcean
                </p>

              </div>
            </div>
            """.formatted(providerName);
        }

        sendEmail(to, subject, body);
    }

    @Async
    public void sendEmail(String to, String subject, String body) {

        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            helper.setText(body, true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}