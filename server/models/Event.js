const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["Workshop", "Seminar", "Sports", "Other"],
    required: true,
  },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Event", eventSchema);
