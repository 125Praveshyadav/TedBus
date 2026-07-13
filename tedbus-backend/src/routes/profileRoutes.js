const express = require("express");
const router = express.Router();

const {
  getUserCommunityProfile,
  getMyCommunityProfile,
  toggleSavePost,
  getSavedPosts,
  getLeaderboard,
} = require("../controllers/profileController");

const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/me", isAuthenticated, getMyCommunityProfile);
router.get("/leaderboard", getLeaderboard);
router.get("/saved-posts", isAuthenticated, getSavedPosts);
router.post("/save/:postId", isAuthenticated, toggleSavePost);
router.get("/:id", getUserCommunityProfile);

module.exports = router;