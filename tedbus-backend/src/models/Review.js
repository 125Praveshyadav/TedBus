const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [20, "Review must be at least 20 characters"],
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    // Edit tracking
    editedAt: {
      type: Date,
      default: null,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    // Moderation
    isHidden: {
      type: Boolean,
      default: false,
    },
    hiddenReason: {
      type: String,
      default: null,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Upvotes (Trusted Reviewer system)
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// One review per user per booking
reviewSchema.index({ user: 1, booking: 1 }, { unique: true });
reviewSchema.index({ bus: 1, isHidden: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);