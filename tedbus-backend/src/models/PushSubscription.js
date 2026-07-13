const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    },
    deviceName: {
      type: String,
      default: "Unknown Device",
    },
    browser: {
      type: String,
      default: "Unknown Browser",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

pushSubscriptionSchema.index({ user: 1, isActive: 1 });
pushSubscriptionSchema.index({ "subscription.endpoint": 1 }, { unique: true });

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);