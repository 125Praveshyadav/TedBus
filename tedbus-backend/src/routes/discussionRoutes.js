const express = require("express");
const router = express.Router();

const {
  createDiscussion,
  getDiscussionsByForum,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  createReply,
  getRepliesByDiscussion,
  updateReply,
  deleteReply,
  markBestAnswer,
} = require("../controllers/discussionController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const verifyUser = require("../middleware/verifyUser");

const {
  validateCreateDiscussion,
  validateUpdateDiscussion,
  validateCreateReply,
  validateUpdateReply,
  validateDiscussionQuery,
  validateReplyQuery,
  validateIdParam,
  validateForumIdParam,
  validateDiscussionIdParam,
  validateReplyIdParam,
} = require("../validations/discussionValidation");

router.get(
  "/forum/:forumId",
  validateForumIdParam,
  validateDiscussionQuery,
  getDiscussionsByForum
);

router.post(
  "/forum/:forumId",
  isAuthenticated,
  verifyUser,
  validateForumIdParam,
  validateCreateDiscussion,
  createDiscussion
);

router.get("/:id", validateIdParam, getDiscussionById);

router.put(
  "/:id",
  isAuthenticated,
  validateIdParam,
  validateUpdateDiscussion,
  updateDiscussion
);

router.delete("/:id", isAuthenticated, validateIdParam, deleteDiscussion);

router.get(
  "/:discussionId/replies",
  validateDiscussionIdParam,
  validateReplyQuery,
  getRepliesByDiscussion
);

router.post(
  "/:discussionId/replies",
  isAuthenticated,
  verifyUser,
  validateDiscussionIdParam,
  validateCreateReply,
  createReply
);

router.put(
  "/replies/:replyId",
  isAuthenticated,
  validateReplyIdParam,
  validateUpdateReply,
  updateReply
);

router.delete("/replies/:replyId", isAuthenticated, validateReplyIdParam, deleteReply);

router.put(
  "/:discussionId/replies/:replyId/best-answer",
  isAuthenticated,
  validateDiscussionIdParam,
  validateReplyIdParam,
  markBestAnswer
);

module.exports = router;