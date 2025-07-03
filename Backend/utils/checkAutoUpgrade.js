const GlobalJoin = require("../models/GlobalJoin");
const User = require("../models/User");

async function checkAutoUpgrade(userId, currentLevel) {
  // Define how many IDs are required at each level to qualify for upgrade
  const requiredIDs = Math.pow(2, currentLevel + 1); // Level 1 => 4, Level 2 => 8...
  const all = await GlobalJoin.find();

  // Build the tree under this userId
  const queue = [{ id: userId, level: 0 }];
  let count = 0;

  while (queue.length) {
    const { id, level } = queue.shift();
    if (level >= currentLevel + 1) break;
    const children = all.filter(u => u.parentId === id);
    queue.push(...children.map(child => ({ id: child.userId, level: level + 1 })));
    count += children.length;
  }

  if (count >= requiredIDs) {
    // Trigger upgrade
    return true;
  }

  return false;
}

module.exports = { checkAutoUpgrade };
