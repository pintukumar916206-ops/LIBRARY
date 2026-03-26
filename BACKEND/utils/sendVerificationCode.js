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
    console.error("SMTP Error:", error.message);
    return next({
      message: "Failed to send verification email. Check your SMTP settings.",
      statusCode: 500,
    });
  }
}
