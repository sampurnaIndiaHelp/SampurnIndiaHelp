const GlobalJoin = require("../models/GlobalJoin");
const GlobalEarning = require("../models/GlobalEarning");
const User = require("../models/User");


const LEVELS = [
  { level: 1, cost: 1000, uplineLevel: 2, sponsorBonus: 0 },
  { level: 2, cost: 2000, uplineLevel: 3, sponsorBonus: 500 },
  { level: 3, cost: 4000, uplineLevel: 4, sponsorBonus: 1000 },
  { level: 4, cost: 8000, uplineLevel: 5, sponsorBonus: 2000 },
  { level: 5, cost: 16000, uplineLevel: 6, sponsorBonus: 4000 },
  { level: 6, cost: 32000, uplineLevel: 7, sponsorBonus: 8000 },
  { level: 7, cost: 48000, uplineLevel: 8, sponsorBonus: 16000 },
  { level: 8, cost: 48000, uplineLevel: 9, sponsorBonus: 32000 },
  { level: 9, cost: 48000, uplineLevel: 10, sponsorBonus: 64000 },
];

async function getNthUpline(userId, n) {
  let current = await GlobalJoin.findOne({ userId });
  while (n-- && current) {
    current = await GlobalJoin.findOne({ userId: current.parentId });
  }
  return current?.userId || "SAMPUR01";
}

async function processLevelUpgrade(userId, level) {
  const config = LEVELS.find(l => l.level === level);
  if (!config) return;

  const user = await User.findOne({ userId });
  if (!user) return;

  const globalEntry = await GlobalJoin.findOne({ userId });
  if (!globalEntry) return;

  // 💸 Pay Upline
  const receiverId = await getNthUpline(userId, config.uplineLevel);
  const receiver = await User.findOne({ userId: receiverId });
  if (receiver) {
    receiver.globalIncome = (receiver.globalIncome || 0) + config.cost;
    receiver.totalIncome = (receiver.totalIncome || 0) + config.cost;
    await receiver.save();
  }

  // 💰 Pay Sponsor Bonus
  if (config.sponsorBonus && user.sponsorId) {
    const sponsor = await User.findOne({ userId: user.sponsorId });
    if (sponsor) {
      sponsor.globalSponsorHelp = (sponsor.globalSponsorHelp || 0) + config.sponsorBonus;
      sponsor.totalIncome = (sponsor.totalIncome || 0) + config.sponsorBonus;
      await sponsor.save();
    }
  }
if (level >= 4) {
  const cloneCount = Math.pow(2, level - 4); // 1, 2, 4, 8, 16...
  await generateClones(userId, user.fullName, cloneCount);
}

  // 📌 Record
  await GlobalEarning.create({
    userId: receiverId,
    sourceUserId: userId,
    type: "level",
    level,
    amount: config.cost,
    isCompanyIncome: receiverId === "SAMPUR01"
  });

  if (config.sponsorBonus) {
    await GlobalEarning.create({
      userId: user.sponsorId,
      sourceUserId: userId,
      type: "sponsor",
      level,
      amount: config.sponsorBonus
    });
  }

  console.log(`✅ Level ${level} income distributed from ${userId} to ${receiverId}`);
}
// 🔁 Clone logic


module.exports = { processLevelUpgrade };
