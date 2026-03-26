import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "MEARN_STACK_MANGA_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log("Database connected.");
    })
    .catch((err) => {
      console.error("Database connection failed:", err.message);
    });
};
