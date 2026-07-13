const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const verifyUser = require("../middleware/verifyUser");

const {
  validateCreateComment,
  validateUpdateComment,
  validateCommentQuery,
  validatePostIdParam,
  validateCommentIdParam,
} = require("../validations/commentValidation");

router.get("/", validatePostIdParam, validateCommentQuery, getCommentsByPost);

router.post(
  "/",
  isAuthenticated,
  verifyUser,
  validatePostIdParam,
  validateCreateComment,
  createComment
);

router.get("/:commentId/replies", validateCommentIdParam, getReplies);

router.put(
  "/:commentId",
  isAuthenticated,
  verifyUser,
  validateCommentIdParam,
  validateUpdateComment,
  updateComment
);

router.delete("/:commentId", isAuthenticated, validateCommentIdParam, deleteComment);

module.exports = router;