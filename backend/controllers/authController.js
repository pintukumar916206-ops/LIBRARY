import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { promises as fsPromises } from "fs";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generatePasswordResetEmailTemplate } from "../utils/emailTemplates.js";
import { sanitizeInput, validateFileUpload } from "../utils/validation.js";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  updateProfileSchema
} from "../schemas/authSchema.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { name, email, password } = result.data;

  let user = await User.findOne({ email });
  if (user && user.accountVerified) {
    return next(new ErrorHandler("User already registered. Please log in.", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const sanitizedName = sanitizeInput(name);

  if (user) {
    user.name = sanitizedName;
    user.password = hashedPassword;
  } else {
    user = new User({ name: sanitizedName, email, password: hashedPassword });
  }

  const verificationCode = user.generateVerificationCode();
  await user.save();
  await sendVerificationCode(verificationCode, email, res, next);
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const result = verifyOTPSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { email, otp } = result.data;

  const userEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });
  if (userEntries.length === 0) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const user = userEntries[0];
  if (userEntries.length > 1) {
    await User.deleteMany({ _id: { $ne: user._id }, email, accountVerified: false });
  }
  if (user.verificationCode !== Number(otp)) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }
  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) {
    return next(new ErrorHandler("OTP has expired.", 400));
  }
  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;
  await user.save({ validateModifiedOnly: true });
  sendToken(user, 200, "Account verified successfully.", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { email, password } = result.data;

  const user = await User.findOne({ email }).select("+password");
  console.log("LOGIN ATTEMPT - User found:", user ? "YES" : "NO");
  
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }
  
  if (!user.accountVerified) {
    return next(new ErrorHandler("Account not verified. Please verify your email first.", 401));
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("LOGIN ATTEMPT - Password match:", isMatch);
    
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password.", 401));
    }
    
    sendToken(user, 200, "Logged in successfully.", res);
  } catch (error) {
    console.error("BCRYPT ERROR:", error);
    return next(new ErrorHandler("Authentication failed.", 500));
  }
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Please provide an email address.", 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("No account found with that email.", 404));
  }
  if (!user.accountVerified) {
    return next(new ErrorHandler("Account not verified. Please verify your email first.", 400));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generatePasswordResetEmailTemplate(resetUrl);
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Failed to send reset email. Please try again.", 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { password } = result.data;

  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid or expired password reset link.", 400));
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, "Password reset successfully.", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const result = updatePasswordSchema.safeParse(req.body);
  if (!result.success) {
    return next(new ErrorHandler(result.error.errors[0].message, 400));
  }
  const { currentPassword, newPassword } = result.data;

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = sanitizeInput(name);

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;
    const fileValidation = validateFileUpload(file);
    if (!fileValidation.valid) {
      if (file.tempFilePath) {
        await fsPromises.unlink(file.tempFilePath).catch(() => {});
      }
      return next(new ErrorHandler(fileValidation.error, 400));
    }
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }
    try {
      const myCloud = await cloudinary.uploader.upload(file.tempFilePath, { folder: "avatars" });
      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload avatar. " + error.message, 500));
    } finally {
      if (file.tempFilePath) {
        await fsPromises.unlink(file.tempFilePath).catch(() => {});
      }
    }
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
  });
});
