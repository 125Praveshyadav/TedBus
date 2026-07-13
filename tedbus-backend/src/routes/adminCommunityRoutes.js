const express = require("express");
const router = express.Router();

const {
  getPendingContent,
  updatePostStatus,
  updateDiscussionStatus,
  getCommunityStats,
} = require("../controllers/adminCommunityController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

router.use(isAuthenticated, isAdmin);

router.get("/pending", getPendingContent);
router.get("/stats", getCommunityStats);
router.put("/posts/:id/status", updatePostStatus);
router.put("/discussions/:id/status", updateDiscussionStatus);

module.exports = router;