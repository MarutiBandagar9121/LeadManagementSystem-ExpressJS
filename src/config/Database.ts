import mongoose from "mongoose";
import Config from "./Config";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(`mongodb://${Config.mongoUsername}:${Config.mongoPassword}@${Config.mongoHost}:${Config.mongoPort}/${Config.mongoDbName}?authSource=admin`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;