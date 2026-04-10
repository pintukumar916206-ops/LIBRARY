import mongoose from "mongoose";
import { User } from "./models/userModel.js";
import { config } from "dotenv";
config({ path: "./config/config.env" });

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected");
    
    const user = await User.findOne({ email: "pintukumar918833@gmail.com" });
    if (user) {
      console.log("USER FOUND:");
      console.log("- Name:", user.name);
      console.log("- Verified:", user.accountVerified);
      console.log("- Role:", user.role);
    } else {
      console.log("USER NOT FOUND");
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error.message);
  }
};

checkUser();
