import Cron from "node-cron";
import { User } from "../models/userModel.js";
export const removeUnverifiedAccounts = () => {
  Cron.schedule("*/5 * * * *", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await User.deleteMany({
      accountVerified: false,
      createdAt: { $lt: thirtyMinutesAgo },
    });
  });
};
