// 📁 backend/routes/unlockRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const LevelUnlockPayment = require("../models/LevelUnlockPayment");
const User = require("../models/User");

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// 🆕 Upload level unlock payment
router.post("/upload", upload.single("screenshot"), async (req, res) => {
  try {
    const { userId, sponsorId, level, amount } = req.body;

    const payment = new LevelUnlockPayment({
      userId,
      sponsorId,
      level,
      amount,
      screenshot: req.file.filename,
    });

    await payment.save();
    res.status(201).json({ message: "Payment uploaded", payment });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// ✅ Sponsor approval
router.put("/approve/:paymentId", async (req, res) => {
  try {
    const payment = await LevelUnlockPayment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "approved";
    payment.approvedAt = new Date();
    await payment.save();

    res.json({ message: "Payment approved." });
  } catch (err) {
    res.status(500).json({ message: "Approval error" });
  }
});

// ❌ Reject
router.put("/reject/:paymentId", async (req, res) => {
  try {
    const payment = await LevelUnlockPayment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "rejected";
    await payment.save();

    res.json({ message: "Payment rejected." });
  } catch (err) {
    res.status(500).json({ message: "Rejection error" });
  }
});

// ✅ Get user's approved unlock levels
router.get("/approved/:userId", async (req, res) => {
  try {
    const payments = await LevelUnlockPayment.find({
      userId: req.params.userId,
      status: "approved",
    });
    const levels = payments.map((p) => p.level);
    res.json({ unlockedLevels: levels });
  } catch (err) {
    res.status(500).json({ message: "Error fetching unlocks" });
  }
});

module.exports = router;
