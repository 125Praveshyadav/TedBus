const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
  getPostsByUserId,
} = require("../controllers/postController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const verifyUser = require("../middleware/verifyUser");
const upload = require("../middleware/uploadMiddleware");

const {
  validateCreatePost,
  validateUpdatePost,
  validatePostQuery,
  validateIdParam,
} = require("../validations/postValidation");

router.get("/", validatePostQuery, getPosts);
router.get("/my-posts", isAuthenticated, getMyPosts);
router.get("/user/:id", validateIdParam, getPostsByUserId);
router.get("/:id", validateIdParam, getPostById);

router.post(
  "/",
  isAuthenticated,
  verifyUser,
  upload.array("images", 5),
  validateCreatePost,
  createPost
);

router.put(
  "/:id",
  isAuthenticated,
  verifyUser,
  validateIdParam,
  validateUpdatePost,
  updatePost
);

router.delete("/:id", isAuthenticated, validateIdParam, deletePost);

module.exports = router;