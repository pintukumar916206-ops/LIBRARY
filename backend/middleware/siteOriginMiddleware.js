import ErrorHandler from "./errorMiddleware.js";

export const siteOriginMiddleware = (req, res, next) => {
  const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  if (req.method !== "GET" && req.method !== "HEAD") {
    const isOriginAllowed = allowedOrigins.some(ao => origin && origin.startsWith(ao));
    const isRefererAllowed = allowedOrigins.some(ao => referer && referer.startsWith(ao));

    if (origin && !isOriginAllowed) {
      return next(new ErrorHandler("Forbidden: Invalid Origin", 403));
    }
    if (!origin && referer && !isRefererAllowed) {
      return next(new ErrorHandler("Forbidden: Invalid Referer", 403));
    }
  }
  next();
};
