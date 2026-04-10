
export const PASSWORD = {
  MIN_LENGTH: 6,
  MAX_LENGTH: 128,
};


export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, 
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
};


export const BORROW = {
  DEFAULT_DURATION_DAYS: 8,
  MAX_FINE_PER_DAY: 0.1, 
};


export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};


export const PASSWORD_RESET = {
  EXPIRY_MINUTES: 15,
};


export const OTP = {
  EXPIRY_MINUTES: 10,
};


export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};


export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
};
