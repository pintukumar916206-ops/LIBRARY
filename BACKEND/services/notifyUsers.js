import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
  cron.schedule("0*/30 * * * *", async () => {
    try {
      
      console.log("CRON RUNNING...");
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: { $lte: oneDayAgo },
        returned: false,
        notified: false,
      });
      console.log("FOUND RECORDS:", borrowers.length);
      for (const borrower of borrowers) {
        console.log("PROCESSING:", borrower._id);
        if (borrower.user && borrower.user.email) {
          const user = await User.findById(borrower.user.id);
          sendEmail({
            email: user.email,
            subject: "Overdue of Book/Manga Reminder",
            message: `Dear ${user.name},\n\nThis is a friendly reminder that the book/manga you borrowed is overdue. Please return it as soon as possible to avoid further penalties.`,
          });
          borrower.notified = true;
          await borrower.save();
          console.log("EMAIL SENT TO:", borrower.user.email);
        }
      }
    } catch (error) {
      console.error("Error notifying users about overdue items:", error);
    }
  });
};
