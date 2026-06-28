const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Otp", otpSchema);