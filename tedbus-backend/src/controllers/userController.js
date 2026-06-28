const User = require("../models/User");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Change Password API
// User login hai.
// Password yaad hai.
// Password change karna hai.

exports.changePassword = async (
  req,
  res
) => {
  try {
    const {
      oldPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    const isMatch =
      await user.comparePassword(
        oldPassword
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Old password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Update Profile API
// PUT /api/v1/users/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, gender } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (gender !== undefined) updateData.gender = gender;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    // if (!updatedUser) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "User not found",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// PUT /api/v1/users/profile-photo
exports.updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "tedbus/user-profiles",
      width: 500,
      height: 500,
      crop: "fill",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profileImage: result.secure_url,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("USER PROFILE PHOTO ERROR =>", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};