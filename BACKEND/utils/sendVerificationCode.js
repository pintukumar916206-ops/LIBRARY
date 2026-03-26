import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendVerificationCode(verificationCode, email, res, next) {
  try {
    const message = generateVerificationOtpEmailTemplate(verificationCode);
    await sendEmail({
      email,
      subject: "Your Verification Code - Nexus Library",
      message,
    });
    res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "Account created. If verification email fails, contact support.",
      emailError: true,
    });
  }
}

