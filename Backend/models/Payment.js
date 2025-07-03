// // const mongoose = require("mongoose");

// // const paymentSchema = new mongoose.Schema({
// //   userId: { type: String, required: true },
// //   sponsorId: { type: String, required: true },
// //   senderName: { type: String, required: true },
// //   senderPhone: { type: String, required: true },
// //   screenshot: { type: String, required: true },
// //  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
// //    fromUserId: String,  // the user who paid
// //   toUserId: String,    // sponsor/upline
// //    type: {
// //     type: String,
// //     enum: ["sponsor", "level", "global"],
// //     required: true,
// //   },     // sponsor payment type
// // }, {
// //   timestamps: true
// // });

// module.exports = mongoose.model("Payment", paymentSchema);
// // 📁 models/LevelPayment.js
// const mongoose = require("mongoose");
// const LevelPayment = require("../models/LevelPayment");
// const levelPaymentSchema = new mongoose.Schema({
//   userId: String,
//   toUserId: String,
//   level: Number,
//   amount: { type: Number, default: 100 },
//   senderName: String,
//   senderPhone: String,
//   screenshot: String,
//   isApproved: { type: Boolean, default: false },
//   approvedBy: String,
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
//   approvedAt: Date,
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("LevelPayment", levelPaymentSchema);

// 📁 models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: String,
  sponsorId: String,
  senderName: String,
  senderPhone: String,
  screenshot: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  type: { type: String, required: true }, // ✅ Required
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
