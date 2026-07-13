const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    discussion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentReply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
    },
    likeCount: { type: Number, default: 0 },
    isBestAnswer: { type: Boolean, default: false },
    reportCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

replySchema.index({ discussion: 1, createdAt: 1 });

module.exports = mongoose.model("Reply", replySchema);