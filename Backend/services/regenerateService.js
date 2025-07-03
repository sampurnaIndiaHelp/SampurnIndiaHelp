const GlobalJoin = require("../models/GlobalJoin");
const User = require("../models/User");

let regenerateCounter = 1;

async function regenerateIDs(originalUserId, fullName, level) {
  const count = Math.pow(2, level - 4); // Level 4 = 1, Level 5 = 2, ...
  const newIds = [];

  for (let i = 0; i < count; i++) {
    const newUserId = `${originalUserId}-R${regenerateCounter++}`;

    const parentId = await findAvailableGlobalParent(); // Your 2x2 logic

    const name = `${fullName} (R${i + 1})`;

    await GlobalJoin.create({
      userId: newUserId,
      userName: name,
      parentId,
      isApproved: true,
      isPaid: true,
      approvedBy: "System",
    });

    await User.create({
      userId: newUserId,
      fullName: name,
      sponsorId: originalUserId,
      globalPaid: true,
      isActive: true,
    });

    newIds.push(newUserId);
  }

  return newIds;
}

module.exports = { regenerateIDs };
