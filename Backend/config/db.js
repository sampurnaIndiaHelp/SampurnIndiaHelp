// /Backend/config/db.js
const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://sampurna:sam123456@cluster0.sxwyu6w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log("✅ MongoDB Atlas connected");
}

module.exports = connectDB;
