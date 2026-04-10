import { z } from "zod";

const emailSchema = z.string().email("Invalid email address.");
const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.")
  .max(128, "Password is too long.");

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: z.string().length(5, "OTP must be 5 digits.").or(z.number()),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match.",
    path: ["confirmNewPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
});
