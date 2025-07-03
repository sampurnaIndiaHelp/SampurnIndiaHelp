// const User = require("../models/User");

// async function sendLevelEarnings(referralId, levels) {
//   let currentId = referralId;
//   for (let i = 0; i < levels; i++) {
//     if (!currentId) break;
//     const user = await User.findOne({ userId: currentId });
//     if (!user) break;

//     user.totalIncome = (user.totalIncome || 0) + 100;
//     await user.save();

//     currentId = user.referralId;
//   }
// }

// module.exports = { sendLevelEarnings };
