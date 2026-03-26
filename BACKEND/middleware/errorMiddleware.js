class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    err = new ErrorHandler("A record with that value already exists.", 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid token. Please log in again.", 400);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Session expired. Please log in again.", 400);
  }

  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid value for field: ${err.path}`, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((e) => e.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
