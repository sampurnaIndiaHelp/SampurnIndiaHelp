// backend/models/LevelUnlockPayment.js
const mongoose = require("mongoose");

const unlockSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sponsorId: { type: String, required: true },
  level: { type: Number, required: true },
  amount: Number,
  screenshot: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  approvedAt: Date,
});

module.exports = mongoose.model("LevelUnlockPayment", unlockSchema);
