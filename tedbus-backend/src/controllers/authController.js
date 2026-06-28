const User = require("../models/User");
const Otp = require("../models/Otp");

const generateToken = require("../utils/generateToken");
const generateOTP = require("../utils/generateOTP");
const sendOTP = require("../services/otpService");
const { validateRegister } = require("../validations/authValidation");
const { verify } = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendEmail = require("../services/emailService");
console.log("Loaded User.js from:", require.resolve("../models/User"));

//register logic
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email });
    console.log("BEFORE OTP CREATE");
    const otpDoc = await Otp.create({
      name,
      email,
      phone,
      password,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    console.log("AFTER OTP CREATE");
    console.log("SAVED OTP DOC =>", otpDoc);

    await sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//login  API
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const token = generateToken(user._id);

   const userData = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
     console.error("LOGIN ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify API

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const otpData = await Otp.findOne({
      email,
      otp,
    });
    console.log("OTP DATA =>", otpData);

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpData.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    console.log("creating user....");
    const user = await User.create({
      name: otpData.name,
      email: otpData.email,
      phone: otpData.phone,
      password: otpData.password,
      isVerified: true,
    });
    //  console.log("2. User Created");
    await Otp.deleteMany({ email });
    // console.log("3. OTP Deleted");
    const token = generateToken(user._id);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
    };

    res.status(201).json({
      success: true,
      message: "Account Created Successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//forgot password API
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    await sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//varify Reset OPT API
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = await Otp.findOne({
      email,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpData.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//reset Password API
exports.resetPassword = async (req, res) => {
  try {
    const {
      email,
      otp,
      password,
      newPassword,
      confirmPassword,
    } = req.body;

    const finalPassword = password || newPassword;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    if (!finalPassword) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (finalPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (confirmPassword && finalPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpRecord = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = finalPassword;

    await user.save();

    await Otp.deleteMany({
      email: email.toLowerCase(),
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//logout
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

