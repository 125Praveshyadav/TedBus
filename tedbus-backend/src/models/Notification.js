const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "booking_confirmed",
        "booking_cancelled",
        "schedule_changed",
        "journey_reminder",
        "promotional",
        "community_like",
        "community_comment",
        "community_reply",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "bell",
    },
    actionUrl: {
      type: String,
      default: null,
    },
    referenceType: {
      type: String,
      enum: ["Booking", "Post", "Comment", "Discussion", "Bus", null],
      default: null,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    channels: {
      inApp: { sent: { type: Boolean, default: false }, sentAt: { type: Date, default: null } },
      email: { sent: { type: Boolean, default: false }, sentAt: { type: Date, default: null } },
      push:  { sent: { type: Boolean, default: false }, sentAt: { type: Date, default: null } },
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "partial", "delivered", "failed"],
      default: "pending",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
     metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ deliveryStatus: 1, retryCount: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Notification", notificationSchema);