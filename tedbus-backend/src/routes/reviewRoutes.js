const express = require("express");

const router = express.Router();

const { isAuthenticated } = require("../middleware/authMiddleware");

const {
  createReview,
  getBusReviews,
  getMyReviews,
} = require("../controllers/reviewController");

router.post("/", isAuthenticated, createReview);

router.get("/my-reviews", isAuthenticated, getMyReviews);

router.get("/bus/:busId", getBusReviews);

module.exports = router;