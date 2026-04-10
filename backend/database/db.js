import mongoose from "mongoose";
import dns from "dns";


dns.setServers(['8.8.8.8', '8.8.4.4']);

export const connectDB = async () => {
  const localUri = process.env.MONGO_URL;
  if (!localUri) {
    console.error("MONGO_URL is not defined in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(localUri);
    console.log(`Database connected successfully to MongoDB`);
  } catch (error) {
    console.error("================ DATABASE CONNECTION ERROR ================");
    console.error(`Connection Failed: ${error.message}`);
    console.error("===========================================================");
  }
};
