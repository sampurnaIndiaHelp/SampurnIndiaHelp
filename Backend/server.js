// // require("dotenv").config();
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const cors = require("cors");

// // const userRoutes = require("./routes/userRoutes");
// // const adminRoutes = require("./routes/adminRoutes");
// // const paymentRoutes = require('./routes/paymentRoutes');
// // const globalRoutes = require("./routes/globalRoutes");
// // const unlockRoutes = require("./routes/unlockRoutes");
// // const globalUpgradeRoutes = require("./routes/globalUpgradeRoutes");


// // const app = express();
// // app.use(cors());
// // app.use(express.json());

// // app.use("/api/users", userRoutes);

// // app.use("/api/admin", adminRoutes);

// // app.use('/api/payments', paymentRoutes);

// // app.use("/api/global", globalRoutes);

// // app.use("/api/unlocks", unlockRoutes);

// // app.use("/api/upgrade", globalUpgradeRoutes);


// // app.use("/uploads", express.static("uploads"));
// // const path = require("path");
// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // }).then(() => {
// //   console.log("✅ MongoDB connected");
// //   app.listen(process.env.PORT || 5000, () =>
// //     console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
// //   );
// // }).catch((err) => console.error("DB connection error:", err));


// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const path = require("path");

// const userRoutes = require("./routes/userRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");
// const globalRoutes = require("./routes/globalRoutes");
// const unlockRoutes = require("./routes/unlockRoutes");
// const globalUpgradeRoutes = require("./routes/globalUpgradeRoutes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Static uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Routes
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/global", globalRoutes);
// app.use("/api/unlocks", unlockRoutes);
// app.use("/api/upgrade", globalUpgradeRoutes);

// // DB Connection and Server Start
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected");

//     const PORT = process.env.PORT || 5000; // Render sets PORT automatically
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ DB connection error:", err);
//   });
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const globalRoutes = require("./routes/globalRoutes");
const unlockRoutes = require("./routes/unlockRoutes");
const globalUpgradeRoutes = require("./routes/globalUpgradeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Default test route
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/global", globalRoutes);
app.use("/api/unlocks", unlockRoutes);
app.use("/api/upgrade", globalUpgradeRoutes);

// Static folder for file uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ DB connection error:", err));
