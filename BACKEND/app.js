import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookandmangaRoutes from "./routes/bookandmangaRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expressFileupload from "express-fileupload";
import { notifyUsers } from "./services/notifyUsers.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";


export const app = express();
config({ path: "./config/config.env", quiet: true });

// Security Middleware
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Apply rate limiter to all api routes
app.use("/api", limiter);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL, 
      "http://localhost:5173", 
      "http://localhost:5174", 
      "http://localhost:5175",
      "https://library-frontend-r5qc.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressFileupload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  }),
  
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookandmanga", bookandmangaRoutes);
app.use("/api/v1/borrow", borrowRoutes);
app.use("/api/v1/user", userRoutes);
notifyUsers();
removeUnverifiedAccounts();
connectDB();
app.use(errorMiddleware);
