import { config } from "dotenv";
config({ path: "./config/config.env", quiet: true });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";
// import mongoSanitize from "express-mongo-sanitize";
// import hpp from "hpp";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookandmangaRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import { FILE_UPLOAD } from "./constants/index.js";
import { siteOriginMiddleware } from "./middleware/siteOriginMiddleware.js";

export const app = express();
app.set("trust proxy", 1);

// THE INFALLIBLE MANUAL CORS FIX + LOGGING
app.use((req, res, next) => {
  console.log(`INC: ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  
  const origin = req.headers.origin;
  const allowedOrigins = ["https://library-frontend-u4vq.onrender.com", "http://localhost:5173"];
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback for safety
    res.setHeader("Access-Control-Allow-Origin", "https://library-frontend-u4vq.onrender.com");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, X-XSRF-TOKEN, Cookie");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  if (req.method === "OPTIONS") {
    console.log("OPTIONS Preflight Handled");
    return res.status(204).send();
  }
  next();
});

// app.use(helmet()); // Temporarily disabled for production connection stability
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
  // express-mongo-sanitize and hpp removed due to Express 5 compatibility issues
  // req.query is read-only in Express 5, and Zod validation already handles sanitization.
app.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
    limits: { fileSize: FILE_UPLOAD.MAX_FILE_SIZE },
  }),
);
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/bookandmanga", bookRoutes);
app.use("/api/v1/borrow", borrowRoutes);
app.use("/api/v1/user", userRoutes);

notifyUsers();
removeUnverifiedAccounts();
// connectDB() removed, handled in server.js
app.use(errorMiddleware);
