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
app.use(helmet());
app.use("/api", apiLimiter);
app.use(
  cors({
    origin: ["https://library-frontend-u4vq.onrender.com", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use((req, res, next) => {
  next();
});
app.use(siteOriginMiddleware);
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
