const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  getProfile,
  changePassword,
  updateProfile,
  updateProfilePhoto,
  updateTheme,
} = require("../controllers/userController");

const { isAuthenticated } = require("../middleware/authMiddleware");


router.get("/profile", isAuthenticated, getProfile);

router.put("/change-password", isAuthenticated, changePassword);

router.put("/update-profile", isAuthenticated, updateProfile);
router.put(
  "/profile-photo",
  isAuthenticated,
  upload.single("profileImage"),
  updateProfilePhoto
);
router.put("/theme", isAuthenticated, updateTheme);

module.exports = router;
