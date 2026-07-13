const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Forum name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "💬",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    discussionCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Forum", forumSchema);