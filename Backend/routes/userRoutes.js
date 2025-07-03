// ✅ Complete backend code (combined & updated)

// 📁 backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const shortid = require("shortid");

const User = require("../models/User");
const Epin = require("../models/Epin");
const GlobalJoin = require("../models/GlobalJoin");


// 🔐 Register User
router.post("/register", async (req, res) => {
  try {
    const {
      referralId,
      sponsorName,
      fullName,
      email,
      password,
      phone,
      epin,
      address,
      city,
      state,
    } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already used." });

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) return res.status(400).json({ message: "Phone number already used." });

    const epinData = await Epin.findOne({ code: epin, used: false });
    if (!epinData) return res.status(400).json({ message: "Invalid or already used E-PIN." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = shortid.generate().toUpperCase();

    let sponsorId = referralId || "SAMPUR01";
    let sponsor = await User.findOne({ userId: sponsorId });

    if (!sponsor && sponsorId === "SAMPUR01") {
      sponsor = await User.findOneAndUpdate(
        { userId: "SAMPUR01" },
        {
          userId: "SAMPUR01",
          fullName: "Sampurna",
          email: "sampurnahelp893@gmail.com",
          password: await bcrypt.hash("admin@123", 10),
          phone: "9187703536",
          address: "Jaunpur Utter pradesh",
          city: "Jaunpur",
          state: "India",
          sponsorId: null,
          sponsorName: null,
          isActive: true,
        },
        { upsert: true, new: true }
      );
    }

    const sponsorDisplayName = sponsor ? sponsor.fullName : "Company";

    const newUser = new User({
      userId,
      fullName,
      email,
      password: hashedPassword,
      phone,
      epin,
      address,
      city,
      state,
      sponsorId,
      sponsorName: sponsorDisplayName,
    });

    await newUser.save();

    epinData.used = true;
    epinData.usedBy = userId;
    await epinData.save();

    if (sponsor) {
      sponsor.downlines.push(userId);
      await sponsor.save();
    }

    res.status(201).json({ userId, fullName, sponsorId });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json({ name: user.fullName });
  } catch {
    res.status(500).json({ message: "Error fetching sponsor name." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    res.json({ userId: user.userId, fullName: user.fullName });
  } catch {
    res.status(500).json({ message: "Login error" });
  }
});



// ✅ Verify user by ID and phone
router.post("/verify-user", async (req, res) => {
  const { userId, phone } = req.body;
  const user = await User.findOne({ userId, phone });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Verified" });
});

// ✅ Reset password
router.put("/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;
  const hashed = await bcrypt.hash(newPassword, 10);
  const updated = await User.findOneAndUpdate({ userId }, { password: hashed });
  if (!updated) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Password updated successfully" });
});


router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) return res.status(404).json({ message: "Not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Profile error" });
  }
});

router.get("/downline/full/:userId", async (req, res) => {
  try {
    const root = await User.findOne({ userId: req.params.userId });
    if (!root) return res.status(404).json({ message: "User not found" });

    const queue = [{ user: root, level: 0 }];
    const result = [];

    while (queue.length) {
      const { user, level } = queue.shift();
      const children = await User.find({ sponsorId: user.userId });

      for (const child of children) {
        result.push({
          userId: child.userId,
          fullName: child.fullName,
          sponsorName: child.sponsorName,
          isActive: child.isActive,
          level: level + 1,
        });
        queue.push({ user: child, level: level + 1 });
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});




// 🌳 Level-wise Downline Tree API
router.get("/downline-levels/:userId", async (req, res) => {
  try {
    const root = await User.findOne({ userId: req.params.userId });
    if (!root) return res.status(404).json({ message: "User not found" });

    const levels = {};
    let currentLevelUsers = [root]; // Start from root user
    let level = 1;

    while (level <= 13 && currentLevelUsers.length > 0) {
      const nextLevelUsers = [];

      for (const user of currentLevelUsers) {
        const downlines = await User.find({ sponsorId: user.userId });

        if (downlines.length > 0) {
          levels[level] = levels[level] || [];

          downlines.forEach((child) => {
            levels[level].push({
              userId: child.userId,
              fullName: child.fullName,
            });
            nextLevelUsers.push(child); // For next level
          });
        }
      }

      currentLevelUsers = nextLevelUsers;
      level++;
    }

    res.json(levels);
  } catch (err) {
    console.error("Downline Level Tree Error:", err);
    res.status(500).json({ message: "Server error fetching level tree" });
  }
});



// 👥 All users (for admin income view)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});


router.get("/downline/direct/:userId", async (req, res) => {
  try {
    const directs = await User.find({ sponsorId: req.params.userId });
    res.json(directs);
  } catch (err) {
    console.error("Direct Downline Fetch Error:", err);
    res.json([]);  // ✅ Safe fallback
  }
});

// ✅ Check eligibility to join global (after 5 directs and Level 1 paid)
router.get("/can-join-global/:userId", async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ message: "User not found" });

  const hasEnoughDirects = user.directJoin >= 5;
  const hasPaidLevel1 = user.levelPaid?.[1] === true;

  res.json({
    eligible: hasEnoughDirects && hasPaidLevel1,
  });
});

// 🔍 Get direct joins with payment status
router.get("/downline/direct/:userId", async (req, res) => {
  try {
    const directs = await User.find({ sponsorId: req.params.userId });

    const results = await Promise.all(directs.map(async (u) => {
      // Find sponsor payment for this direct user
      const sponsorPayment = await Payment.findOne({
        userId: u.userId,
        sponsorId: u.sponsorId,
        type: "sponsor",
      });

      return {
        userId:       u.userId,
        fullName:     u.fullName,
        createdAt:    u.createdAt,
        paymentStatus: sponsorPayment?.status || "pending",
        paymentAmount: sponsorPayment?.amount || 200  // default ₹200 if not found
      };
    }));

    res.json(results);
  } catch (err) {
    console.error("Error fetching directs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// update globle table 

router.get("/upgrade-history/:userId", async (req, res) => {
  try {
    const payments = await GlobalUpgradePayment.find({ userId: req.params.userId });
    res.json(payments);
  } catch {
    res.status(500).json([]);
  }
});


// ✅ GET Regenerated Clones
router.get("/regenerated/:originalId", async (req, res) => {
  const { originalId } = req.params;
  try {
    const clones = await GlobalJoin.find({ userId: { $regex: `^${originalId}-R` } });
    res.json(clones);
  } catch (err) {
    console.error("Clone fetch error:", err);
    res.status(500).json({ message: "Clone fetch failed" });
  }
});

module.exports = router;
