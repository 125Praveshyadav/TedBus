const express = require("express");
const router = express.Router();

const {
  createReport,
  getReports,
  updateReportStatus,
  removeReportedContent,
} = require("../controllers/reportController");

const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const verifyUser = require("../middleware/verifyUser");
const reportLimiter = require("../middleware/reportLimiter");

const {
  validateCreateReport,
  validateUpdateReportStatus,
  validateReportQuery,
  validateIdParam,
} = require("../validations/reportValidation");

router.post(
  "/",
  isAuthenticated,
  verifyUser,
  reportLimiter,
  validateCreateReport,
  createReport
);

router.get("/", isAuthenticated, isAdmin, validateReportQuery, getReports);

router.put(
  "/:id/status",
  isAuthenticated,
  isAdmin,
  validateIdParam,
  validateUpdateReportStatus,
  updateReportStatus
);

router.delete("/:id/remove-content", isAuthenticated, isAdmin, validateIdParam, removeReportedContent);

module.exports = router;