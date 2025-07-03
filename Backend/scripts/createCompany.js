const connectDB = require("../config/db");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function createCompanyID() {
  await connectDB();

  const sponsor = await User.findOneAndUpdate(
    { userId: "SAMPUR01" },
    {
      userId: "SAMPUR01",
      fullName: "Sampurna",
      email: "sampurnahelp893@gmail.com",
      password: await bcrypt.hash("admin@123", 10),
      phone: "9187703536",
      address: "Jaunpur Uttar Pradesh",
      city: "Jaunpur",
      state: "India",
      sponsorId: null,
      sponsorName: null,
      isActive: true,
    },
    { upsert: true, new: true }
  );

  console.log("✅ Company ID created:", sponsor.userId);
  mongoose.disconnect();
}

createCompanyID();
