// const mongoose = require("mongoose");

// const globalJoinSchema = new mongoose.Schema({
//   userId: String,
//   userName: String,
//   parentId: String,
//   sponsorId: String, // ✅ required for approval matching
//   paymentScreenshot: String,
//   isApproved: { type: Boolean, default: false },
//   approvedBy: String,
//   isPaid: Boolean,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("GlobalJoin", globalJoinSchema);
// 📁 models/GlobalJoin.js
const mongoose = require("mongoose");

const globalJoinSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  parentId: String,
  sponsorId: String,
  isApproved: { type: Boolean, default: false },
  approvedBy: String,
  isPaid: { type: Boolean, default: false },
  paymentScreenshot: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GlobalJoin", globalJoinSchema);
