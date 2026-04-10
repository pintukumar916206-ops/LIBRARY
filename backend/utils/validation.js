import { EMAIL_REGEX, PASSWORD, FILE_UPLOAD } from "../constants/index.js";

export const validateEmail = (email) => {
  return EMAIL_REGEX.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;
  return (
    password.length >= PASSWORD.MIN_LENGTH &&
    password.length <= PASSWORD.MAX_LENGTH
  );
};

export const validatePagination = (page = 1, limit = 20) => {
  let validPage = parseInt(page);
  let validLimit = parseInt(limit);
  if (isNaN(validPage) || validPage < 1) validPage = 1;
  if (isNaN(validLimit) || validLimit < 1) validLimit = 20;
  if (validLimit > 50) validLimit = 50;
  return { page: validPage, limit: validLimit };
};

export const validateFileUpload = (file) => {
  if (!file) {
    return { valid: false, error: "File is required." };
  }
  if (file.size > FILE_UPLOAD.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${FILE_UPLOAD.MAX_FILE_SIZE / 1024 / 1024}MB.`,
    };
  }
  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${FILE_UPLOAD.ALLOWED_IMAGE_TYPES.join(", ")}`,
    };
  }
  return { valid: true };
};

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/<[^>]*>?/gm, "")
    .replace(/[<>]/g, "")
    .trim();
};

export const validateRequiredFields = (obj, fields) => {
  const missing = fields.filter((field) => !obj[field]);
  return {
    valid: missing.length === 0,
    missing: missing.length > 0 ? missing : undefined,
  };
};

export const validateStringLength = (str, min = 1, max = 500) => {
  if (typeof str !== "string") return false;
  return str.length >= min && str.length <= max;
};

export const validateNumber = (num, min = 0, max = Infinity) => {
  const parsed = Number(num);
  if (isNaN(parsed)) return false;
  return parsed >= min && parsed <= max;
};
