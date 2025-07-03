// backend/routes/globalUpgradeRoutes.js
const express = require("express");
const router = express.Router();
const GlobalUpgradePayment = require("../models/GlobalUpgradePayment");
const User = require("../models/User");
const GlobalEarning = require("../models/GlobalEarning");

// 📌 GET all pending upgrades for upline
router.get("/pending/:userId", async (req, res) => {
  const upgrades = await GlobalUpgradePayment.find({
    paidTo: req.params.userId,
    isApproved: false,
  });
  res.json(upgrades);
});

// ✅ Approve upgrade
router.put("/approve/:paymentId", async (req, res) => {
  const payment = await GlobalUpgradePayment.findById(req.params.paymentId);
  if (!payment) return res.status(404).json({ message: "Upgrade not found" });

  payment.isApproved = true;
  await payment.save();

  // 💰 Credit income to upline
  const receiver = await User.findOne({ userId: payment.paidTo });
  if (receiver) {
    receiver.globalIncome = (receiver.globalIncome || 0) + payment.amount;
    receiver.totalIncome = (receiver.totalIncome || 0) + payment.amount;
    await receiver.save();

    await GlobalEarning.create({
      userId: payment.paidTo,
      sourceUserId: payment.userId,
      amount: payment.amount,
      type: "upgrade",
      level: payment.level,


      
    });
    if (payment.level >= 4 && payment.level <= 12) {
  const fullName = user.fullName;
  const generated = await regenerateIDs(user.userId, fullName, payment.level);
  console.log("✅ Regenerated IDs:", generated);
}
  }

  res.json({ message: `✅ Level ${payment.level} payment approved` });
});

// ❌ Reject upgrade
router.put("/reject/:paymentId", async (req, res) => {
  await GlobalUpgradePayment.findByIdAndDelete(req.params.paymentId);
  res.json({ message: "❌ Upgrade rejected" });
});

module.exports = router;
