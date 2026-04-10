import { ERROR_MESSAGES } from "../constants/errorMessages.js";
import ErrorHandler from "./errorMiddleware.js";
import {
  validateEmail,
  validatePassword,
  validateStringLength,
  validateNumber,
  sanitizeInput,
} from "../utils/validation.js";

export const validateRegisterInput = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler(ERROR_MESSAGES.MISSING_FIELDS, 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler(ERROR_MESSAGES.PASSWORD_MISMATCH, 400));
  }

  if (!validateEmail(email)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_EMAIL, 400));
  }

  if (!validatePassword(password)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_PASSWORD, 400));
  }

  req.body.name = sanitizeInput(name).trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateBookInput = (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author) {
    return next(new ErrorHandler(ERROR_MESSAGES.MISSING_FIELDS, 400));
  }

  if (!validateStringLength(title, 1, 200)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_TITLE, 400));
  }

  if (!validateStringLength(author, 2, 100)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_AUTHOR, 400));
  }

  if (description && !validateStringLength(description, 0, 2000)) {
    return next(new ErrorHandler("Description must be under 2000 characters.", 400));
  }

  if (price !== undefined && !validateNumber(price, 0, 999999)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_PRICE, 400));
  }

  if (quantity !== undefined && !validateNumber(quantity, 0, 999999)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_QUANTITY, 400));
  }

  req.body.title = sanitizeInput(title).trim();
  req.body.author = sanitizeInput(author).trim();
  if (description) req.body.description = sanitizeInput(description).trim();
  next();
};

export const validatePaginationInput = (req, res, next) => {
  const pageStr = req.query.page;
  const limitStr = req.query.limit;

  const page = pageStr ? parseInt(pageStr) : 1;
  const limit = limitStr ? parseInt(limitStr) : 20;

  if (isNaN(page) || page < 1) {
    return next(new ErrorHandler("Page must be a positive number.", 400));
  }

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return next(new ErrorHandler("Limit must be between 1 and 100.", 400));
  }

  req.validated = { page, limit };
  next();
};

export const validateOTPInput = (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler(ERROR_MESSAGES.MISSING_FIELDS, 400));
  }

  if (!validateEmail(email)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_EMAIL, 400));
  }

  if (String(otp).length !== 6) {
    return next(new ErrorHandler("OTP must be exactly 6 digits.", 400));
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler(ERROR_MESSAGES.MISSING_FIELDS, 400));
  }

  if (!validateEmail(email)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_EMAIL, 400));
  }

  next();
};

export const validateProfileUpdateInput = (req, res, next) => {
  const { name, email } = req.body;

  if (name !== undefined && !validateStringLength(name, 1, 100)) {
    return next(new ErrorHandler("Name must be between 1 and 100 characters.", 400));
  }

  if (email !== undefined && !validateEmail(email)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_EMAIL, 400));
  }

  next();
};

export const validatePasswordUpdateInput = (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler(ERROR_MESSAGES.MISSING_FIELDS, 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler(ERROR_MESSAGES.PASSWORD_MISMATCH, 400));
  }

  if (!validatePassword(newPassword)) {
    return next(new ErrorHandler(ERROR_MESSAGES.INVALID_PASSWORD, 400));
  }

  next();
};
