export function generateVerificationOtpEmailTemplate(VERIFICATION_CODE) {
  return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Verify Your Email Address</h2>
    <p>Dear User,</p>
    <p>Thank you for registering with us! To complete your registration, please use the verification code below:</p>
    <div style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; display: inline-block; margin: 20px 0;">
      <h3 style="margin: 0; color: #000;">${VERIFICATION_CODE}</h3>
    </div>
    <p>Please enter this code in the verification field on our website to activate your account.</p>
    <p>If you did not request this code, please ignore this email.</p>
    <p>Best regards,<br/>The Team</p>
  </div>`;
}

export function generatePasswordResetEmailTemplate(RESET_LINK) {
  return `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Password Reset Request</h2>
    <p>Dear User,</p>
    <p>We received a request to reset your password. If you made this request, please click the link below to reset your password:</p>
    <div style="margin: 20px 0;">
      <a href="${RESET_LINK}" style="background-color: #4caf50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </div>
    <p>If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
    <p>Best regards,<br/>The Team</p>
  </div>`;
}
