const mongoose = require("mongoose");

const globalCloneSchema = new mongoose.Schema({
  originalUserId: String,
  cloneNumber: Number, // from 1 to 511
  cloneUserId: String, // e.g. USER01-CLONE-3
  name: String,
  level: Number,
  isActive: { type: Boolean, default: false },
  parentId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GlobalClone", globalCloneSchema);
