import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 15;

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar image is required.", 400));
  }
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all required fields.", 400));
  }
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return next(new ErrorHandler("Password must be between 6 and 15 characters.", 400));
  }
  const existing = await User.findOne({ email, accountVerified: true });
  if (existing) {
    return next(new ErrorHandler("An account with that email is already registered.", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("Only jpg, jpeg, and png formats are allowed.", 400));
  }

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(avatar.tempFilePath, {
      folder: "ADMIN_AVATARS",
      width: 150,
      crop: "scale",
    });
  } catch (error) {
    return next(new ErrorHandler("Avatar upload failed.", 500));
  } finally {
    if (avatar.tempFilePath) {
      fs.unlinkSync(avatar.tempFilePath);
    }
  }

  if (!uploadResult || !uploadResult.secure_url) {
    return next(new ErrorHandler("Avatar upload failed.", 500));
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountVerified: true,
    avatar: {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully.",
    admin,
  });
});
