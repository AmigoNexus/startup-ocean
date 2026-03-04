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
      <div style="font-family:Arial;padding:20px">
        <h2 style="color:#0d9488">StartupOcean</h2>

        <p>You received a collaboration request from:</p>

        <h3 style="color:#0d9488">${companyName}</h3>

        <div style="background:#f5f5f5;padding:15px;border-radius:8px">
          <b>Message:</b>
          <p>${message || "No message provided"}</p>
        </div>

        <p>Login to StartupOcean to respond.</p>
      </div>
    `,
  }),

};