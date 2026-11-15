const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    unique: true,
  },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["student", "organizer"], required: true },
  isVerified: { type: Boolean, default: false },
  verificationCodeHash: { type: String, select: false },
  verificationExpiresAt: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
