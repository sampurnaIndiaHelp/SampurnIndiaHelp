// backend/utils/upgradeHelper.js

const GlobalJoin = require("../models/GlobalJoin");
const GlobalUpgradePayment = require("../models/GlobalUpgradePayment");

const LEVEL_AMOUNTS = {
  1: 1000, 2: 2000, 3: 4000, 4: 8000,
  5: 16000, 6: 32000, 7: 32000, 8: 48000, 9: 48000
};

async function findNthUpline(userId, n = 2) {
  let current = userId;
  while (n-- && current) {
    const node = await GlobalJoin.findOne({ userId: current });
    if (!node) return null;
    current = node.parentId;
  }
  return current || "SAMPUR01";
}

async function triggerUpgrade(userId, level, sponsorId) {
  const amount = LEVEL_AMOUNTS[level];
  if (!amount) return;

  const secondUpline = await findNthUpline(userId, 2);
  const payment = new GlobalUpgradePayment({
    userId,
    level,
    amount,
    sponsorId,
    secondUpline,
    paidTo: secondUpline,
  });

  await payment.save();
  return payment;
}

module.exports = { triggerUpgrade };
