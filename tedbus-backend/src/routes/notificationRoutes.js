const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/adminMiddleware");
const { validateSendNotification } = require("../validations/notificationValidation");

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} = require("../controllers/notificationController");

const { isAuthenticated } = require("../middleware/authMiddleware");

const {
  validateNotificationQuery,
  validateIdParam,
} = require("../validations/notificationValidation");

router.use(isAuthenticated);
router.post("/send", isAuthenticated, isAdmin, validateSendNotification, require("../controllers/notificationController").sendNotification);

router.get("/", validateNotificationQuery, getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.delete("/read-all", deleteAllRead);
router.put("/:id/read", validateIdParam, markAsRead);
router.delete("/:id", validateIdParam, deleteNotification);

module.exports = router;