const express = require("express");
const router = express.Router();

const {
  createReview,
  editReview,
  getBusReviews,
  checkCanReview,
  upvoteReview,
  reportReview,
  getMyReviews,
  adminToggleHideReview,
} = require("../controllers/reviewController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

// Public
router.get("/bus/:busId", getBusReviews);

// Authenticated
router.use(isAuthenticated);
router.post("/", createReview);
router.put("/:id", editReview);
router.get("/check/:bookingId", checkCanReview);
router.post("/:id/upvote", upvoteReview);
router.post("/:id/report", reportReview);
router.get("/my-reviews", getMyReviews);

// Admin
router.put("/:id/toggle-hide", isAdmin, adminToggleHideReview);

module.exports = router;