import { notifyUsers } from "../../../BACKEND/services/notifyUsers.js";
import { connectDB } from "../../../BACKEND/database/db.js";

export default async (req) => {
  await connectDB();
  // Call the function once. Wait, notifyUsers() in BACKEND starts a cron! 
  // Let's execute the logic directly instead.
}
