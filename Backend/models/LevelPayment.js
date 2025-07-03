const mongoose = require("mongoose");

const levelPaymentSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // who paid
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  toUserId: { type: String, required: true }, // who receives
  senderName: String,
  senderPhone: String,
  screenshot: String,
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: String },
  type: { type: String, default: "sponsor" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  approvedAt: Date,
});

module.exports = mongoose.model("LevelPayment", levelPaymentSchema);
