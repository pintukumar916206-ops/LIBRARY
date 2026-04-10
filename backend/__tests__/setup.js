import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app.js";
process.env.JWT_SECRET_KEY = "test_secret_key";
process.env.FRONTEND_URL = "http://localhost:5173";
process.env.NODE_ENV = "test";
process.env.JWT_EXPIRE = "7d";
let mongoServer;
export const setupDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};
export const teardownDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};
export const clearDB = async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
