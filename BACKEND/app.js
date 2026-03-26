import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookandmangaRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

export const app = express();
config({ path: "./config/config.env", quiet: true });

app.set("trust proxy", 1);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP. Please try again after 15 minutes.",
});

app.use("/api", limiter);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://library-frontend-r5qc.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookandmanga", bookRoutes);
app.use("/api/v1/borrow", borrowRoutes);
app.use("/api/v1/user", userRoutes);

notifyUsers();
removeUnverifiedAccounts();
connectDB();

app.use(errorMiddleware);
