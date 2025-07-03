const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const GlobalJoin = require("../models/GlobalJoin");
const User = require("../models/User");
const GlobalEarning = require("../models/GlobalEarning");
const { processLevelUpgrade } = require("../utils/globalUpgrade");
  const { triggerUpgrade } = require("../utils/upgradeHelper");
const { generateRegenIdsForUser } = require("../utils/regenGlobalId");

const COMPANY_ID = "SAMPUR01";

// ✅ Ensure uploads directory exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ✅ File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });

// ✅ Utility: Find available upline in 2x2 matrix
async function findAvailableParent() {
  const queue = [COMPANY_ID];
  while (queue.length) {
    const current = queue.shift();
    const children = await GlobalJoin.find({ parentId: current });
    if (children.length < 2) return current;
    queue.push(...children.map(child => child.userId));
  }
  return COMPANY_ID;
}


 //✅ Step 1: Global eligibility (5 direct joins)
router.get("/can-join-global/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    const joined = await GlobalJoin.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ eligible: false });
    res.json({ eligible: user.directJoin >= 5 && !joined });
  } catch (err) {
    res.status(500).json({ eligible: false });
  }
});








// ✅ Check if already joined
router.get("/check/:userId", async (req, res) => {
  try {
    const entry = await GlobalJoin.findOne({ userId: req.params.userId });
    res.json({ isJoined: !!entry, entry: entry || null });
  } catch (err) {
    res.status(500).json({ message: "Error checking global join" });
  }
});

// ✅ Create Global Join Request
router.post("/global-join", async (req, res) => {
  try {
    const { userId, userName, sponsorId } = req.body;

    const existing = await GlobalJoin.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Already joined global." });

    const parentId = await findAvailableParent();

    const entry = await GlobalJoin.create({
      userId,
      userName: `$userName +(GLOBAL)`,
      parentId,
      sponsorId: sponsorId || COMPANY_ID,
      isApproved: false,
    });

    res.json({ message: "Global join request created.", parentId });
  } catch (err) {
    res.status(500).json({ message: "Global join error" });
  }
});

// ✅ Upload Screenshot
router.post("/upload", upload.single("screenshot"), async (req, res) => {
  const { userId } = req.body;
  const entry = await GlobalJoin.findOne({ userId:req.body.userId });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  entry.paymentScreenshot = req.file.filename;
  entry.isPaid = true;
  await entry.save();

  res.json({ message: "Screenshot uploaded" });
});

// ✅ Approve Join Payment
router.put("/approve/:userId", async (req, res) => {
  const { userId } = req.params;
  const approvedBy = req.body.approvedBy || "SAMPUR01";

  const entry = await GlobalJoin.findOne({ userId });
  if (!entry || !entry.isPaid)
    return res.status(400).json({ message: "Payment not submitted" });

  // ✅ Auto-approve company join if approving self
  if (entry.userId === "SAMPUR01" && entry.parentId === "SAMPUR01") {
    entry.isApproved = true;
    entry.approvedBy = "COMPANY";
    await entry.save();

    const user = await User.findOne({ userId });
    if (user) {
      user.globalPaid = true;
      await user.save();
    }

    await GlobalEarning.create({
      userId: "SAMPUR01",
      sourceUserId: "SAMPUR01",
      level: 1,
      type: "join",
      amount: 500,
      isCompanyIncome: true,
    });

    return res.json({ message: "✅ Company Global Join Auto-Approved" });
  }

  // Normal approval flow
  entry.isApproved = true;
  entry.approvedBy = approvedBy;
  await entry.save();

  const user = await User.findOne({ userId });
  if (user) {
    user.globalPaid = true;
    await user.save();
  }

  const receiverId = entry.parentId || "SAMPUR01";
  const receiver = await User.findOne({ userId: receiverId });

  if (receiver) {
    receiver.globalIncome = (receiver.globalIncome || 0) + 500;
    receiver.totalIncome = (receiver.totalIncome || 0) + 500;
    await receiver.save();

  // ✅ Trigger regeneration if level 3 complete (example condition: user has 8 directs)
  const regenCount = await GlobalJoin.countDocuments({ parentId: userId });
  if (regenCount >= 8) {
    await generateRegenIdsForUser(userId, user.fullName);
    console.log(`✅ Regeneration started for ${userId}`);
  }

  await triggerUpgrade(userId, 1, entry.sponsorId);



  if (user && entry.sponsorId && level >= 3) {
  const sponsor = await User.findOne({ userId: entry.sponsorId });
  if (sponsor) {
    sponsor.globalSponsorHelp = (sponsor.globalSponsorHelp || 0) + amount;
    sponsor.totalIncome = (sponsor.totalIncome || 0) + amount;
    await sponsor.save();
  }
}
// ✅ Trigger first upgrade
await triggerUpgrade(userId, 1, entry.sponsorId);
    await GlobalEarning.create({
      userId: receiverId,
      sourceUserId: userId,
      level: 1,
      type: "join",
      amount: 500,
      isCompanyIncome: receiverId === "SAMPUR01"
    });
  }

  res.json({ message: "✅ Global Join Approved" });
});

// ✅ Reject Join Payment
router.put("/reject/:userId", async (req, res) => {
  try {
    await GlobalJoin.deleteOne({ userId: req.params.userId });
    res.json({ message: "❌ Rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: "Rejection error" });
  }
});

// ✅ Tree View (2x2 Global Tree)
router.get("/tree/:userId", async (req, res) => {
  try {
    const root = await GlobalJoin.findOne({ userId: req.params.userId });
    if (!root) return res.json([]);

    const queue = [{ node: root, level: 0 }];
    const result = [];

    while (queue.length) {
      const { node, level } = queue.shift();
      const children = await GlobalJoin.find({ parentId: node.userId });

      for (const child of children) {
        result.push({
          level: level + 1,
          userId: child.userId,
          userName: child.userName,
        });
        queue.push({ node: child, level: level + 1 });
      }
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Tree build error" });
  }
});

// ✅ Earnings History
router.get("/earnings/:userId", async (req, res) => {
  try {
    const data = await GlobalEarning.find({ userId: req.params.userId });
    res.json(data || []);
  } catch (err) {
    res.json([]);
  }
});

// ✅ Sponsor's Pending Approvals
router.get("/pending/:sponsorId", async (req, res) => {
  try {
    const globals = await GlobalJoin.find({
      sponsorId: req.params.sponsorId,
      isApproved: false,
      isPaid: true,
    });
    res.json(globals);
  } catch (err) {
    res.json([]);
  }
});

// ✅ Join Status by User
// ✅ Status for frontend
router.get("/status/:userId", async (req, res) => {
  const entry = await GlobalJoin.findOne({ userId: req.params.userId });
  if (!entry) return res.json({ joined: false });
  res.json({
    joined: true,
    userId: entry.userId,
    userName: entry.userName,
    parentId: entry.parentId,
    isApproved: entry.isApproved,
    isPaid: entry.isPaid,
    approvedBy: entry.approvedBy,
    paymentScreenshot: entry.paymentScreenshot,
    createdAt: entry.createdAt,
  });
});


// ✅ Create Global Join Request
router.post("/global-join", async (req, res) => {
  try {
    const { userId, userName, sponsorId } = req.body;

    const existing = await GlobalJoin.findOne({ userId });
    if (existing) return res.status(400).json({ message: "Already joined global." });

    const parentId = await findAvailableParent();

    const entry = await GlobalJoin.create({
      userId,
      userName: userName + " (GLOBAL)", // ✅ Ensure name is stored
      parentId,
      sponsorId,
      isApproved: false,
      isPaid: false,
    });

    res.json({ message: "Global join request created.", parentId });
  } catch (err) {
    res.status(500).json({ message: "Global join error" });
  }
});


async function findAvailableParent() {
  const queue = [COMPANY_ID];
  while (queue.length) {
    const current = queue.shift();
    const children = await GlobalJoin.find({ parentId: current });
    if (children.length < 2) return current;
    queue.push(...children.map(c => c.userId));
  }
  return COMPANY_ID;
}








router.put("/level-upgrade/:userId/:level", async (req, res) => {
  const { userId, level } = req.params;
  const upgradeAmounts = [0, 1000, 2000, 4000, 8000, 16000, 32000, 32000, 48000, 48000]; // index = level

  const uplineLevel = parseInt(level) + 1;
  const sender = await User.findOne({ userId });

  if (!sender) return res.status(404).json({ message: "User not found" });

  // Pay upgrade to upline (level+1)
  let receiver = await User.findOne({ userId: sender[`level${uplineLevel}Upline`] });

  if (!receiver || !receiver.globalPaid) {
    receiver = await User.findOne({ userId: "SAMPUR01" });
  }

  receiver.globalIncome += upgradeAmounts[level];
  receiver.totalIncome += upgradeAmounts[level];
  await receiver.save();

  // Save Global Earning
  await GlobalEarning.create({
    userId: receiver.userId,
    sourceUserId: userId,
    level: level,
    amount: upgradeAmounts[level],
    type: "level-upgrade",
    isCompanyIncome: receiver.userId === "SAMPUR01",
  });

  return res.json({ message: `Level ${level} upgraded & ₹${upgradeAmounts[level]} sent.` });
});


// level based logic

router.post("/generate-clones/:userId/:level", async (req, res) => {
  const { userId, level } = req.params;
  const cloneCounts = [0, 0, 0, 0, 1, 2, 4, 8, 16, 32, 64, 128]; // level: no. of clones

  const existing = await GlobalClone.find({ originalUserId: userId }).countDocuments();
  const clonesToCreate = cloneCounts[level];

  const user = await User.findOne({ userId });
  const created = [];

  for (let i = 1; i <= clonesToCreate; i++) {
    const cloneNumber = existing + i;
    const cloneUserId = `${userId}-CLONE-${cloneNumber}`;

    const parentId = await findAvailableParent(); // reuse logic from GlobalJoin

    await GlobalClone.create({
      originalUserId: userId,
      cloneNumber,
      cloneUserId,
      name: user.fullName + " (CLONE)",
      level,
      parentId,
      isActive: true
    });

    created.push(cloneUserId);
  }

  res.json({ message: `${clonesToCreate} clones created`, clones: created });
});




// ✅ Trigger Global Upgrade (for testing or auto-call)
router.post("/upgrade/:userId/:level", async (req, res) => {
  const { userId, level } = req.params;
  try {
    await processLevelUpgrade(userId, parseInt(level));
    res.json({ message: `✅ Global Level ${level} processed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Level upgrade error" });
  }
});

// ✅ Get global earnings for a user
router.get("/earnings/:userId", async (req, res) => {
  try {
    const earnings = await GlobalEarning.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

// ✅ ADMIN: Get all global earnings
router.get("/admin/global-earnings", async (req, res) => {
  try {
    const data = await GlobalEarning.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Admin global earnings error" });
  }
});


module.exports = router;













// // 📁 backend/routes/globalRoutes.js
// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const fs = require("fs");
// const GlobalJoin = require("../models/GlobalJoin");
// const GlobalEarning = require("../models/GlobalEarning");
// const User = require("../models/User");

// const COMPANY_ID = "SAMPUR01";

// // Create uploads folder if it doesn't exist
// const uploadDir = "./uploads";
// if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
// });
// const upload = multer({ storage });

// // ✅ Step 1: Global eligibility (5 direct joins)
// router.get("/can-join-global/:userId", async (req, res) => {
//   try {
//     const user = await User.findOne({ userId: req.params.userId });
//     const joined = await GlobalJoin.findOne({ userId: req.params.userId });
//     if (!user) return res.status(404).json({ eligible: false });
//     res.json({ eligible: user.directJoin >= 5 && !joined });
//   } catch (err) {
//     res.status(500).json({ eligible: false });
//   }
// });

// // ✅ Create global join entry
// router.post("/global-join", async (req, res) => {
//   const { userId, userName, sponsorId } = req.body;
//   const exists = await GlobalJoin.findOne({ userId });
//   if (exists) return res.status(400).json({ message: "Already joined global." });

//   const parentId = await findAvailableParent();

//   await GlobalJoin.create({
//     userId,
//     userName: `${userName} (GLOBAL)`,
//     parentId,
//     sponsorId,
//     isApproved: false,
//   });

//   res.json({ message: "Global join request created", parentId });
// });

// // ✅ Upload screenshot
// router.post("/upload", upload.single("screenshot"), async (req, res) => {
//   const entry = await GlobalJoin.findOne({ userId: req.body.userId });
//   if (!entry) return res.status(404).json({ message: "Global entry not found" });

//   entry.paymentScreenshot = req.file.filename;
//   entry.isPaid = true;
//   await entry.save();

//   res.json({ message: "Screenshot uploaded" });
// });

// // ✅ Approve global payment
// router.put("/approve/:userId", async (req, res) => {
//   const { userId } = req.params;
//   const approvedBy = req.body.approvedBy || "SAMPUR01";
//   const entry = await GlobalJoin.findOne({ userId });
//   if (!entry || !entry.isPaid) return res.status(400).json({ message: "Payment not submitted" });

//   entry.isApproved = true;
//   entry.approvedBy = approvedBy;
//   await entry.save();

//   const user = await User.findOne({ userId });
//   user.globalPaid = true;
//   await user.save();

//   // Send income to upline
//   const receiver = await User.findOne({ userId: entry.parentId || COMPANY_ID });
//   if (receiver) {
//     receiver.globalIncome = (receiver.globalIncome || 0) + 500;
//     receiver.totalIncome = (receiver.totalIncome || 0) + 500;
//     await receiver.save();

//     await GlobalEarning.create({
//       userId: receiver.userId,
//       sourceUserId: userId,
//       level: 1,
//       type: "join",
//       amount: 500,
//       isCompanyIncome: receiver.userId === COMPANY_ID,
//     });
//   }

//   res.json({ message: "✅ Global Join Approved" });
// });

// // ✅ Status for frontend
// router.get("/status/:userId", async (req, res) => {
//   const entry = await GlobalJoin.findOne({ userId: req.params.userId });
//   if (!entry) return res.json({ joined: false });
//   res.json({
//     joined: true,
//     userId: entry.userId,
//     userName: entry.userName,
//     parentId: entry.parentId,
//     isApproved: entry.isApproved,
//     isPaid: entry.isPaid,
//     approvedBy: entry.approvedBy,
//     paymentScreenshot: entry.paymentScreenshot,
//     createdAt: entry.createdAt,
//   });
// });

// async function findAvailableParent() {
//   const queue = [COMPANY_ID];
//   while (queue.length) {
//     const current = queue.shift();
//     const children = await GlobalJoin.find({ parentId: current });
//     if (children.length < 2) return current;
//     queue.push(...children.map(c => c.userId));
//   }
//   return COMPANY_ID;
// }

// module.exports = router;
