export const emailTemplates = {
    otp: (otp = '{{OTP}}') => ({
        subject: "StartupOcean - Email Verification OTP",
        body: `Your OTP for email verification is: ${otp}

This OTP is valid for 10 minutes.

If you didn't request this, please ignore this email.

Thanks,
StartupOcean Team`
    }),

    collaborationRequest: (senderCompanyName, message) => ({
        subject: `New Collaboration Request from ${senderCompanyName}`,
        body: `You have received a new collaboration request from ${senderCompanyName}.

Message: ${message}

Please login to StartupOcean to respond.

Thanks,
StartupOcean Team`
    })
};
