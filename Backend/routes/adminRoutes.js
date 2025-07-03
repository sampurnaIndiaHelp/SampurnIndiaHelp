const express = require("express");
const router = express.Router();
const Epin = require("../models/Epin");

const ADMIN_SECRET = process.env.ADMIN_SECRET || "sampurnaadmin123";

// Middleware to protect admin routes
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key === ADMIN_SECRET) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Generate E-PINs
router.post("/generate-epins", adminAuth, async (req, res) => {
  try {
    const { count } = req.body;
    if (!count || count <= 0) {
      return res.status(400).json({ message: "Invalid count" });
    }

    const pins = [];
    for (let i = 0; i < count; i++) {
      const code = `EPIN${Math.floor(100000 + Math.random() * 900000)}`;
      pins.push({ code });
    }

    const saved = await Epin.insertMany(pins);
    res.status(201).json({ message: `${count} E-PINs generated`, epins: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// View all E-PINs
router.get("/epins", adminAuth, async (req, res) => {
  try {
    const epins = await Epin.find().sort({ createdAt: -1 });
    res.json(epins);
  } catch (err) {
    res.status(500).json({ message: "Error fetching E-PINs" });
  }
});


// logic show direct join in company 

// Get direct joiners under SAMPUR01
router.get("/company-directs", async (req, res) => {
  try {
    const directUsers = await User.find({ sponsorId: "SAMPUR01" }).sort({ createdAt: -1 });
    res.json(directUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching directs" });
  }
});


//👥 Get users directly joined under SAMPUR01
router.get("/direct-company-joiners", async (req, res) => {
  try {
    const joiners = await User.find({ sponsorId: "SAMPUR01" }).select(
      "userId fullName email phone city state createdAt"
    );
    res.json(joiners);
  } catch (err) {
    console.error("Admin fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
