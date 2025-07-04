const mongoose = require("mongoose");
require("dotenv").config(); // Load env vars from .env

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Read Mongo URI from environment
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop the server if DB fails
  }
}

module.exports = connectDB;
