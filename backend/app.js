import { config } from "dotenv";
config({ path: "./config/config.env", quiet: true });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { authLimiter } from "./middleware/rateLimiter.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookandmangaRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";
import { FILE_UPLOAD } from "./constants/index.js";

export const app = express();
app.set("trust proxy", 1);


app.use(
  cors({
    origin: ["https:,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "X-XSRF-TOKEN", "Cookie"],
  })
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

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
app.use(errorMiddleware);
