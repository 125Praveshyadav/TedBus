const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const savedRouteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
      maxlength: 100,
    },
    start: { type: locationSchema, required: true },
    end: { type: locationSchema, required: true },
    waypoints: { type: [locationSchema], default: [] },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

savedRouteSchema.index({ user: 1, lastUsedAt: -1 });

module.exports = mongoose.model("SavedRoute", savedRouteSchema);