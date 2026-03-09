export const emailTemplates = {

  otp: (otp = "{{OTP}}") => `
  <div style="font-family:Arial;background:#f5f5f5;padding:30px">
    <div style="background:white;padding:20px;border-radius:10px">
      <h2 style="color:#0d9488">StartupOcean</h2>

      <p>Your OTP for email verification:</p>

      <h1 style="
        text-align:center;
        letter-spacing:6px;
        color:#0d9488;
        border:2px dashed #0d9488;
        padding:12px;
      ">
        ${otp}
      </h1>

      <p>This OTP is valid for 10 minutes.</p>
      <p>If you didn't request this, ignore this email.</p>

      <hr/>
      <p style="font-size:12px;color:gray">
        StartupOcean Team
      </p>
    </div>
  </div>
  `,

  collaborationRequest: (companyName, message) => ({
    subject: `New Collaboration Request from ${companyName}`,
    body: `
<div style="margin:0;padding:0;background:#f0fdfa;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,148,136,0.10)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:36px 40px;text-align:center">
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800">StartupOcean 🌊</h1>
      <p style="margin:0;color:#99f6e4;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:500">Collaboration Request</p>
    </div>

    <!-- Alert Badge -->
    <div style="background:#fefce8;border-bottom:1px solid #fde68a;padding:18px 40px;text-align:center">
      <span style="display:inline-block;background:#fef9c3;color:#854d0e;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:20px">
        🤝 New Request Received
      </span>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px">
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Hello,</p>

      <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.8">
        You have received a new collaboration request on <strong>StartupOcean</strong>.
      </p>

      <!-- Sender Card -->
      <div style="background:#f0fdfa;border:1.5px solid #99f6e4;border-radius:12px;padding:16px 24px;margin-bottom:20px">
        <p style="margin:0 0 2px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600">From</p>
        <p style="margin:0;color:#0d9488;font-size:19px;font-weight:800">${companyName}</p>
      </div>

      <!-- Message Card -->
      <div style="background:#f9fafb;border-left:4px solid #0d9488;border-radius:0 10px 10px 0;padding:18px 20px;margin-bottom:28px">
        <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px">Message</p>
        <p style="margin:0;color:#111827;font-size:14px;line-height:1.8;font-style:italic">
          "${message || "No message provided"}"
        </p>
      </div>

      <p style="margin:0 0 28px;color:#374151;font-size:14px;line-height:1.8">
        Log in to StartupOcean to review this request and send your response.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0 8px">
        <a href="https://startupocean.in"
           style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px">
          Respond Now →
        </a>
      </div>
    </div>

    <!-- Sign-off -->
    <div style="padding:0 40px 32px">
      <p style="margin:0;color:#374151;font-size:14px">Regards,</p>
      <p style="margin:4px 0 0;color:#0d9488;font-weight:700;font-size:15px">Team StartupOcean</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        You are receiving this because you are registered on StartupOcean.<br>
        © ${new Date().getFullYear()} StartupOcean · All rights reserved
      </p>
    </div>

  </div>
</div>
    `,
  }),

  newCompanyNotification: (companyName = "{{companyName}}") => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:30px">

  <table align="center" width="600" style="background:white;border-radius:10px;padding:30px">

    <tr>
      <td style="text-align:center;padding-bottom:20px">
        <h2 style="color:#0d9488;margin:0">StartupOcean</h2>
        <p style="color:#6b7280;font-size:14px;margin-top:4px">
          Connecting Startups & Service Providers
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:20px 0">
        <h3 style="margin:0;color:#111827;font-size:20px">
          A New Company Joined StartupOcean
        </h3>
      </td>
    </tr>

    <tr>
      <td style="
        background:#ecfeff;
        border-left:4px solid #0d9488;
        padding:16px;
        border-radius:6px;
        font-size:16px;
        color:#0f172a;
      ">
        <strong>{{companyName}}</strong>
      </td>
    </tr>

    <tr>
      <td style="padding-top:20px;font-size:15px;color:#374151">
        Explore new collaboration opportunities and connect with innovative companies in the StartupOcean ecosystem.
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:30px 0">
        <a href="https://startupocean.in"
           style="
           background:#0d9488;
           color:white;
           text-decoration:none;
           padding:12px 24px;
           border-radius:6px;
           font-weight:bold;
           display:inline-block">
           View Platform
        </a>
      </td>
    </tr>

    <tr>
      <td style="border-top:1px solid #e5e7eb;padding-top:20px;text-align:center">
        <p style="font-size:12px;color:#9ca3af;margin:0">
          You are receiving this email because you are registered on StartupOcean.
        </p>

        <p style="font-size:12px;color:#9ca3af;margin-top:6px">
          © ${new Date().getFullYear()} StartupOcean
        </p>
      </td>
    </tr>

  </table>

</div>
`,
  newWelcomeEmail: (companyName = "{{companyName}}") => `
<div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7f9;padding:30px">
  <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:30px">

    <h2 style="color:#0d9488;margin-bottom:10px">StartupOcean 🌊</h2>

    <p>Dear <b>${companyName}</b>,</p>

    <p style="font-size:16px;margin-top:10px">
      <b>Welcome Aboard !! 💐</b>
    </p>

    <p>
      Thank you for joining <b>Startup Ocean Community 🌊</b>. 
      We truly appreciate your trust and confidence in our platform 🤝 
      and are excited to have you as part of our growing community.
    </p>

    <p>
      We believe every startup deserves the right environment to grow — 
      the right people, services, and opportunities at every stage 🚀.
      Your journey with Startup Ocean begins with collaboration, guidance,
      and access to a powerful network built to support your success 🌐.
    </p>

    <p>
      Our mission is to support you across every phase of your venture — 
      from early validation and partnerships to scaling, visibility, and growth 📈.
    </p>

    <p>
      You are now part of a collaborative ecosystem of founders,
      service providers, and innovators who believe in building and growing together.
    </p>

    <div style="margin:25px 0">
      <a href="https://startupocean.in"
         style="background:#0d9488;color:white;padding:12px 22px;
         border-radius:6px;text-decoration:none;font-weight:bold">
        Explore StartupOcean
      </a>
    </div>

    <p>We look forward to supporting your journey and celebrating your milestones ahead.</p>

    <p style="margin-top:30px">
      Warm regards,<br>
      <b>Team StartupOcean</b>
    </p>

  </div>
</div>
`,

  newStartupJoined: (startupName = "{{startupName}}") => `
<div style="margin:0;padding:0;background:#f0fdfa;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,148,136,0.10)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:36px 40px;text-align:center">
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800">StartupOcean 🌊</h1>
      <p style="margin:0;color:#99f6e4;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:500">New Opportunity Alert</p>
    </div>

    <!-- Alert Badge -->
    <div style="background:#ecfdf5;border-bottom:1px solid #bbf7d0;padding:18px 40px;text-align:center">
      <span style="display:inline-block;background:#dcfce7;color:#166534;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:20px">
        🚀 New Startup Joined
      </span>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px">
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Hello,</p>

      <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.8">
        A new startup has joined the <strong>StartupOcean Community</strong> and this could be your next big collaboration opportunity!
      </p>

      <!-- Company Name Card -->
      <div style="background:#f0fdfa;border:1.5px solid #99f6e4;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center">
        <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600">Startup Name</p>
        <p style="margin:0;color:#0d9488;font-size:22px;font-weight:800">${startupName}</p>
      </div>

      <p style="margin:0 0 28px;color:#374151;font-size:14px;line-height:1.8">
        Visit the platform to explore collaboration opportunities and offer your services to this new venture.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0 8px">
        <a href="https://startupocean.in"
           style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px">
          Explore StartupOcean →
        </a>
      </div>
    </div>

    <!-- Sign-off -->
    <div style="padding:0 40px 32px">
      <p style="margin:0;color:#374151;font-size:14px">Regards,</p>
      <p style="margin:4px 0 0;color:#0d9488;font-weight:700;font-size:15px">Team StartupOcean</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        You are receiving this because you are a registered Service Provider on StartupOcean.<br>
        © ${new Date().getFullYear()} StartupOcean · All rights reserved
      </p>
    </div>

  </div>
</div>
`,

  newServiceProviderJoined: (providerName = "{{providerName}}") => `
<div style="margin:0;padding:0;background:#f0fdfa;font-family:'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(13,148,136,0.10)">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0d9488 0%,#0f766e 100%);padding:36px 40px;text-align:center">
      <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800">StartupOcean 🌊</h1>
      <p style="margin:0;color:#99f6e4;font-size:13px;text-transform:uppercase;letter-spacing:1px;font-weight:500">New Service Available</p>
    </div>

    <!-- Alert Badge -->
    <div style="background:#eff6ff;border-bottom:1px solid #bfdbfe;padding:18px 40px;text-align:center">
      <span style="display:inline-block;background:#dbeafe;color:#1d4ed8;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 14px;border-radius:20px">
        🛠️ New Service Provider Joined
      </span>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px">
      <p style="margin:0 0 16px;color:#374151;font-size:15px">Hello,</p>

      <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.8">
        A new <strong>Service Provider</strong> has joined StartupOcean. Explore their services and see how they can support your startup's growth!
      </p>

      <!-- Company Name Card -->
      <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center">
        <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600">Service Provider</p>
        <p style="margin:0;color:#1d4ed8;font-size:22px;font-weight:800">${providerName}</p>
      </div>

      <p style="margin:0 0 28px;color:#374151;font-size:14px;line-height:1.8">
        Visit the platform to learn more about their offerings and connect with them for your business needs.
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin:32px 0 8px">
        <a href="https://startupocean.in"
           style="display:inline-block;background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px">
          Explore Services →
        </a>
      </div>
    </div>

    <!-- Sign-off -->
    <div style="padding:0 40px 32px">
      <p style="margin:0;color:#374151;font-size:14px">Regards,</p>
      <p style="margin:4px 0 0;color:#0d9488;font-weight:700;font-size:15px">Team StartupOcean</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
      <p style="margin:0;color:#9ca3af;font-size:12px">
        You are receiving this because you are a registered Startup on StartupOcean.<br>
        © ${new Date().getFullYear()} StartupOcean · All rights reserved
      </p>
    </div>

  </div>
</div>
`,
};