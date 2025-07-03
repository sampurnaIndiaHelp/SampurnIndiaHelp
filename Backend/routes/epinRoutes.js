const express = require("express");
const router = express.Router();
const Epin = require("../models/Epin");

const ADMIN_SECRET = process.env.ADMIN_SECRET || "sampurnaadmin123";

// 🔐 Middleware to protect admin routes
function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key === ADMIN_SECRET) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized access: Invalid admin key" });
  }
}

// 🔑 Generate a single E-PIN (2 letters + 5 alphanumeric)
function generateEpinCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphanum = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let prefix = "";
  for (let i = 0; i < 2; i++) {
    prefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  let suffix = "";
  for (let i = 0; i < 5; i++) {
    suffix += alphanum.charAt(Math.floor(Math.random() * alphanum.length));
  }

  return prefix + suffix;
}

// ✅ POST: Generate multiple E-PINs
router.post("/generate-epins", adminAuth, async (req, res) => {
  try {
    const { count } = req.body;
    if (!count || count <= 0) {
      return res.status(400).json({ message: "Invalid count" });
    }

    const pins = [];
    const existingCodes = new Set(
      (await Epin.find({}, "code")).map((e) => e.code)
    );

    while (pins.length < count) {
      const code = generateEpinCode();
      if (!existingCodes.has(code)) {
        pins.push({ code });
        existingCodes.add(code);
      }
    }

    const saved = await Epin.insertMany(pins);
    res.status(201).json({ message: `${count} E-PINs generated`, epins: saved });
  } catch (err) {
    console.error("❌ E-PIN Generation Error:", err);
    res.status(500).json({ message: "Server error while generating E-PINs" });
  }
});

// ✅ GET: All E-PINs
router.get("/epins", adminAuth, async (req, res) => {
  try {
    const epins = await Epin.find().sort({ createdAt: -1 });
    res.json(epins);
  } catch (err) {
    console.error("❌ E-PIN Fetch Error:", err);
    res.status(500).json({ message: "Error fetching E-PINs" });
  }
});

router.get("/", async (req, res) => {
  try {
    const pins = await Epin.find().sort({ createdAt: -1 });
    res.json(pins);
  } catch {
    res.status(500).json({ message: "Error loading E-PINs" });
  }
});

module.exports = router;
