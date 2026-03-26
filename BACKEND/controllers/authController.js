import { v2 as cloudinary } from "cloudinary";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generatePasswordResetEmailTemplate } from "../utils/emailTemplates.js";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 15;

function validatePassword(password) {
  return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }
  if (!validatePassword(password)) {
    return next(new ErrorHandler("Password must be between 6 and 15 characters.", 400));
  }
  const isRegistered = await User.findOne({ email, accountVerified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered. Please log in.", 400));
  }
  const registrationAttempts = await User.countDocuments({
    email,
    accountVerified: false,
  });
  if (registrationAttempts >= 5) {
    return next(
      new ErrorHandler("Too many registration attempts. Please contact support.", 400)
    );
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  const verificationCode = user.generateVerificationCode();
  await user.save();
  await sendVerificationCode(verificationCode, email, res, next);
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email and OTP are required.", 400));
  }
  const userEntries = await User.find({ email, accountVerified: false }).sort({ createdAt: -1 });
  if (userEntries.length === 0) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const user = userEntries[0];
  if (userEntries.length > 1) {
    await User.deleteMany({
      _id: { $ne: user._id },
      email,
      accountVerified: false,
    });
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
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  if (!user.accountVerified) {
    return next(new ErrorHandler("Account not verified. Please verify your email first.", 401));
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "Logged in successfully.", res);
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
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid or expired password reset link.", 400));
  }
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide both password fields.", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }
  if (!validatePassword(password)) {
    return next(new ErrorHandler("Password must be between 6 and 15 characters.", 400));
  }
  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, "Password reset successfully.", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Current password is incorrect.", 400));
  }
  if (!validatePassword(newPassword)) {
    return next(new ErrorHandler("Password must be between 6 and 15 characters.", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New passwords do not match.", 400));
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

  if (name) user.name = name;

  if (req.files && req.files.avatar) {
    const file = req.files.avatar;

    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "avatars",
    });

    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
  });
});
