// 📁 backend/routes/paymentRoutes.js
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Payment = require("../models/Payment");
const LevelPayment = require("../models/LevelPayment");
const LevelUnlockPayment = require("../models/LevelUnlockPayment");
const User = require("../models/User");
const findUpline = require("../utils/findUpline");

const router = express.Router();

// Ensure uploads dir exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// ─── Sponsor Payment Upload ─────────────────────────────────────────────────
router.post("/upload", upload.single("screenshot"), async (req, res) => {
  try {
    const { userId, sponsorId, senderName, senderPhone } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Screenshot is required." });
    }

    // Prevent duplicate pending
    const existing = await Payment.findOne({ userId, status: "pending", type: "sponsor" });
    if (existing) {
      return res.status(400).json({ message: "A pending sponsor payment already exists." });
    }

    const payment = new Payment({
      userId,
      sponsorId,
      senderName,
      senderPhone,
      screenshot: req.file.filename,
      type: "sponsor",
      status: "pending",
    });
    await payment.save();
    res.status(201).json({ message: "Sponsor payment uploaded successfully." });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Approve Sponsor Payment ────────────────────────────────────────────────
router.put("/approve/:paymentId", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status === "approved") {
      return res.status(400).json({ message: "Already approved." });
    }

    const user = await User.findOne({ userId: payment.userId });
    const sponsor = await User.findOne({ userId: payment.sponsorId });
    if (!user || !sponsor) {
      return res.status(404).json({ message: "User or Sponsor not found" });
    }

    payment.status = "approved";
    await payment.save();

    // Activate new user
    user.isActive = true;
    await user.save();

    // Credit sponsor
    sponsor.sponsorIncome += 200;
    sponsor.totalIncome += 200;
    sponsor.directJoin += 1;
    await sponsor.save();

    res.json({ message: "Sponsor payment approved successfully." });
  } catch (err) {
    console.error("Approval Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Fetch Pending Sponsor Payments ────────────────────────────────────────
router.get("/pending/:sponsorId", async (req, res) => {
  try {
    const referrals = await User.find({ sponsorId: req.params.sponsorId });
    const userIds = referrals.map(u => u.userId);
    const payments = await Payment.find({
      userId: { $in: userIds },
      status: "pending",
      type: "sponsor",
    });
    res.json(payments);
  } catch (err) {
    console.error("Fetch Pending Sponsor Payments Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Level Payment Upload ───────────────────────────────────────────────────
router.post("/upload-level", upload.single("screenshot"), async (req, res) => {
  try {
    const { userId, level, senderName, senderPhone } = req.body;
    console.log("👉 /upload-level payload:", { userId, level, senderName, senderPhone, file: req.file });
    if (!req.file) {
      return res.status(400).json({ message: "Screenshot file is required." });
    }

    const lvl = parseInt(level, 10);
    if (isNaN(lvl) || lvl < 1) {
      return res.status(400).json({ message: "Invalid level provided." });
    }

    const toUserId = await findUpline(userId, lvl);
    if (!toUserId) {
      return res.status(500).json({ message: "Could not determine upline for level payment." });
    }

    // ₹100 per level
    const amount = lvl * 100;

    const payment = new LevelPayment({
      userId,
      toUserId,
      level: lvl,
      amount,
      senderName,
      senderPhone,
      screenshot: req.file.filename,
      status: "pending",
    });
    await payment.save();
    console.log("✅ Level payment saved:", payment);

    res.status(201).json({ message: `Level ${lvl} payment of ₹${amount} submitted.` });
  } catch (err) {
    console.error("🚨 Level Payment Upload Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Approve Level Payment ──────────────────────────────────────────────────
router.put("/approve-level/:paymentId", async (req, res) => {
  try {
    const payment = await LevelPayment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.status === "approved") {
      return res.status(400).json({ message: "Already approved." });
    }

    payment.status = "approved";
    payment.approvedAt = new Date();
    await payment.save();

    const receiver = await User.findOne({ userId: payment.toUserId });
    if (receiver) {
      receiver.uplineIncome = (receiver.uplineIncome || 0) + payment.amount;
      receiver.totalIncome = (receiver.totalIncome || 0) + payment.amount;
      await receiver.save();
    }

    res.json({ message: `Level ${payment.level} payment approved.` });
  } catch (err) {
    console.error("Level Approval Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Reject Level Payment ───────────────────────────────────────────────────
router.put("/reject-level/:paymentId", async (req, res) => {
  try {
    const payment = await LevelPayment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    await payment.save();

    res.json({ message: `Level ${payment.level} payment rejected.` });
  } catch (err) {
    console.error("Level Reject Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Fetch All Level Payments for a User ────────────────────────────────────
router.get("/levels/:userId", async (req, res) => {
  try {
    const levels = await LevelPayment.find({ userId: req.params.userId }).sort({ level: 1 });
    res.json(levels);
  } catch (err) {
    console.error("Fetch level payments error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Fetch Pending Level Payments for Approval ──────────────────────────────
router.get("/pending-levels/:toUserId", async (req, res) => {
  try {
    const payments = await LevelPayment.find({
      toUserId: req.params.toUserId,
      status: "pending",
    });
    res.json(payments);
  } catch (err) {
    console.error("Pending level fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── Payment History (Sponsor & Debit) ─────────────────────────────────────
router.get("/history/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const debits = await Payment.find({ userId });
    const credits = await Payment.find({ sponsorId: userId, status: "approved" });
    res.json({ credits, debits });
  } catch (err) {
    console.error("Payment history error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ─── All Sponsor Payments (Admin) ──────────────────────────────────────────
router.get("/all", async (req, res) => {
  try {
    const sponsorPayments = await Payment.find().sort({ createdAt: -1 });
    res.json(sponsorPayments);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
