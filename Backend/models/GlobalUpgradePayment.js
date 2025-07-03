// backend/models/GlobalUpgradePayment.js
const mongoose = require("mongoose");

const globalUpgradePaymentSchema = new mongoose.Schema({
  userId: String,
  level: Number,
  amount: Number,
  sponsorId: String,
  secondUpline: String,
  paidTo: String,
  isApproved: { type: Boolean, default: false },
  isCompanyApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GlobalUpgradePayment", globalUpgradePaymentSchema);
