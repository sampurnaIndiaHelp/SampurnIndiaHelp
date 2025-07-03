const GlobalJoin = require("../models/GlobalJoin");

// async function generateRegenIdsForUser(originalUserId, baseName, startSerial, levels = 9) {
//   let ids = [];
//   let queue = [{ parentId: originalUserId, level: 1, count: 1 }];
//   let serial = startSerial;

//   while (queue.length) {
//     const { parentId, level, count } = queue.shift();
//     const childCount = Math.pow(2, level - 1);

//     for (let i = 0; i < childCount && serial <= 511 && level <= levels; i++) {
//       const newUserId = `${originalUserId}_R${serial}`;
//       const newUserName = `${baseName}_REGEN${serial}`;

//       const exists = await GlobalJoin.findOne({ userId: newUserId });
//       if (!exists) {
//         await GlobalJoin.create({
//           userId: newUserId,
//           userName: newUserName,
//           parentId,
//           isApproved: true,
//           isPaid: true,
//           autoRegen: true
//         });
//         ids.push(newUserId);
//         queue.push({ parentId: newUserId, level: level + 1 });
//         serial++;
//       }
//     }
//   }

//   return ids;
// }

async function generateRegenIdsForUser(baseUserId, baseName, startSerial = 1) {
  let serial = startSerial;
  let queue = [{ userId: `${baseUserId}_R${serial++}`, parentId: baseUserId }];
  const entries = [];

  for (let level = 0; level < 9; level++) {
    const nextQueue = [];
    for (let node of queue) {
      const entry = new GlobalJoin({
        userId: node.userId,
        userName: `${baseName} (GLOBAL ${node.userId})`,
        parentId: node.parentId,
        sponsorId: "REGEN",
        isApproved: true,
        isPaid: true,
        autoRegen: true,
      });
      entries.push(entry);
      nextQueue.push({ userId: `${baseUserId}_R${serial++}`, parentId: node.userId });
      nextQueue.push({ userId: `${baseUserId}_R${serial++}`, parentId: node.userId });
    }
    queue = nextQueue;
  }

  await GlobalJoin.insertMany(entries);
  return entries.length;
}

module.exports = generateRegenIdsForUser;
