const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb://${config.mongoUsername}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}/${config.mongoDbName}?authSource=admin`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
