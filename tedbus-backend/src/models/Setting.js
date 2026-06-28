const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "TedBus",
    },

    contactEmail: {
      type: String,
      default: "support@tedbus.com",
    },

    supportNumber: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    commissionRate: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);