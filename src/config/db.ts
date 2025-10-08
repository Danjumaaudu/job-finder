import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log("⚡ Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    isConnected = true;
    console.log("🧠 MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}
