import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { promises as fsPromises } from "fs";
import { z } from "zod";

const adminRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").max(15, "Password must be at most 15 characters"),
});

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments({ role: "User" });
  const users = await User.find({ role: "User" }).skip(skip).limit(limit);

  res.status(200).json({
    success: true,
    users,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!role || !["Admin", "User"].includes(role)) {
    return next(new ErrorHandler("Invalid role.", 400));
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
    user,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar image is required.", 400));
  }

  const validation = adminRegistrationSchema.safeParse(req.body);
  if (!validation.success) {
    return next(new ErrorHandler(validation.error.errors[0].message, 400));
  }
  const { name, email, password } = validation.data;
  const existing = await User.findOne({ email, accountVerified: true });
  if (existing) {
    return next(new ErrorHandler("An account with that email is already registered.", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    if (avatar.tempFilePath) {
      await fsPromises.unlink(avatar.tempFilePath).catch(() => {});
    }
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
      await fsPromises.unlink(avatar.tempFilePath).catch(() => {});
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
