import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "MEARN_STACK_MANGA_MANAGEMENT_SYSTEM",
    })
    .then(() => {
      console.log(`DATABASE CONNECTED SUCCESSFULLY.`);
    })
    .catch((err) => {
      console.log(`Error Connecting To Database`, err);
    });
};
