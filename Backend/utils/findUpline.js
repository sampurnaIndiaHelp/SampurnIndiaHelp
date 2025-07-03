const User = require("../models/User");

// Recursive function to trace uplines
async function findUpline(userId, level) {
  let currentUser = await User.findOne({ userId });

  for (let i = 0; i < level; i++) {
    if (!currentUser || !currentUser.sponsorId) {
      return "SAMPUR01"; // Fallback to company if sponsor missing
    }
    currentUser = await User.findOne({ userId: currentUser.sponsorId });
  }

  return currentUser?.userId || "SAMPUR01";
}

module.exports = findUpline;
