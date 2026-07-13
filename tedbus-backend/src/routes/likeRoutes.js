const express = require("express");
const router = express.Router();

const {
  toggleLike,
  getLikesByPost,
  checkUserLiked,
} = require("../controllers/likeController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const verifyUser = require("../middleware/verifyUser");

router.post("/toggle", isAuthenticated, verifyUser, toggleLike);
router.get("/check", isAuthenticated, checkUserLiked);
router.get("/post/:postId", getLikesByPost);

module.exports = router;