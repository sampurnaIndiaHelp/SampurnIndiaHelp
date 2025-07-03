const GlobalJoin = require("../models/GlobalJoin");
let cloneCounter = 1;

async function findAvailableGlobalSlot() {
  const queue = ["SAMPUR01"];
  while (queue.length) {
    const current = queue.shift();
    const children = await GlobalJoin.find({ parentId: current });
    if (children.length < 2) return current;
    queue.push(...children.map(c => c.userId));
  }
  return "SAMPUR01";
}

async function generateClones(originalUserId, fullName, numberOfClones) {
  for (let i = 0; i < numberOfClones; i++) {
    const cloneId = `${originalUserId}_CL${cloneCounter++}`;
    const parentId = await findAvailableGlobalSlot();

    const clone = new GlobalJoin({
      userId: cloneId,
      userName: fullName + ` (CLONE-${cloneCounter})`,
      parentId,
      isApproved: true,
      isPaid: true,
      approvedBy: "SYSTEM"
    });

    await clone.save();
    console.log(`✅ Clone ${cloneId} placed under ${parentId}`);
  }
}
module.exports = { generateClones };
