const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    postType: {
      type: String,
      enum: ["story", "tip", "photo", "discussion"],
      default: "story",
    },
    images: [
      {
        url: { type: String },
        publicId: { type: String },
      },
    ],
    route: {
      source: { type: String, trim: true },
      destination: { type: String, trim: true },
    },
    tags: [{ type: String, trim: true, lowercase: true }],
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
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

postSchema.index({ title: "text", content: "text", tags: "text" });
postSchema.index({ "route.source": 1, "route.destination": 1 });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;