const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    forum: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Forum",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Discussion title is required"],
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    route: {
      source: { type: String, trim: true },
      destination: { type: String, trim: true },
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    replyCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    reportCount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

discussionSchema.index({ forum: 1, isPinned: -1, createdAt: -1 });
discussionSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Discussion", discussionSchema);