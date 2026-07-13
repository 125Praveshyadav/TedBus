const express = require("express");
const router = express.Router();

const {
  createForum,
  getForums,
  getForumBySlug,
  getForumById,
  updateForum,
  deleteForum,
} = require("../controllers/forumController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");

const {
  validateCreateForum,
  validateUpdateForum,
  validateForumQuery,
  validateIdParam,
  validateSlugParam,
} = require("../validations/forumValidation");

router.get("/", validateForumQuery, getForums);
router.get("/slug/:slug", validateSlugParam, getForumBySlug);
router.get("/:id", validateIdParam, getForumById);

router.post("/", isAuthenticated, isAdmin, validateCreateForum, createForum);
router.put("/:id", isAuthenticated, isAdmin, validateIdParam, validateUpdateForum, updateForum);
router.delete("/:id", isAuthenticated, isAdmin, validateIdParam, deleteForum);

module.exports = router;