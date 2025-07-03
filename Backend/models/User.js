const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  fullName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  address: String,
  city: String,
  state: String,
  sponsorId: String,
  sponsorName: String,
  epin: String,
  isActive: { type: Boolean, default: false },
sponsorIncome: { type: Number, default: 0 },
totalIncome: { type: Number, default: 0 },
directJoin: { type: Number, default: 0 },
downlines: [String],
levelIncome: { type: Number, default: 0 },
levelAccess: { type: Number, default: 2 },
uplineIncome: { type: Number, default: 0 },
 

} , { timestamps: true });

module.exports = mongoose.model("User", userSchema);
