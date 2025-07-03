const mongoose = require("mongoose");

const epinSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Epin", epinSchema);
