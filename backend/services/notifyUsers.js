import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const overdueBorrows = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        returned: false,
        notified: false,
      }).populate("user", "name email");
      for (const borrow of overdueBorrows) {
        if (borrow.user) {
          await sendEmail({
            email: borrow.user.email,
            subject: "Overdue Book Reminder",
            message: `Dear ${borrow.user.name},<br/><br/>This is a reminder that the book you borrowed is overdue. Please return it as soon as possible to avoid further penalties.`,
          });
          borrow.notified = true;
          await borrow.save();
        }
      }
    } catch (error) {
      console.error("Failed to send overdue notifications:", error.message);
    }
  });
};
