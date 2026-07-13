const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    channels: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    categories: {
      booking_confirmed: { type: Boolean, default: true },
      booking_cancelled: { type: Boolean, default: true },
      schedule_changed: { type: Boolean, default: true },
      journey_reminder: { type: Boolean, default: true },
      promotional: { type: Boolean, default: false },
      community_like: { type: Boolean, default: true },
      community_comment: { type: Boolean, default: true },
      community_reply: { type: Boolean, default: true },
      system: { type: Boolean, default: true },
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      start: { type: String, default: "22:00" },
      end: { type: String, default: "08:00" },
    },
    emailDigest: {
      type: String,
      enum: ["instant", "daily", "weekly", "none"],
      default: "instant",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationPreference", notificationPreferenceSchema);