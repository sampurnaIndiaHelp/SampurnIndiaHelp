// 📁 backend/models/GlobalEarning.js

const mongoose = require("mongoose");

const globalEarningSchema = new mongoose.Schema({
  userId: { type: String, required: true },              // earning owner
  sourceUserId: { type: String },                        // who triggered the income
  level: { type: Number, required: true },               // global level L1 to L11
  type: { type: String, enum: ["join", "sponsor", "upgrade", "regen"], required: true },
  amount: { type: Number, required: true },
  fromRegenId: { type: String },                         // if earning came from regen ID
  isCompanyIncome: { type: Boolean, default: false },    // whether fallback company earned
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GlobalEarning", globalEarningSchema);
