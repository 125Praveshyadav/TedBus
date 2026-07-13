const notificationService = require("../services/notificationService");
const { notifyUser } = require("../services/notificationDispatcher");

const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(
      req.user._id,
      req.query
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, unreadCount: count });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user._id
    );
    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const count = await notificationService.markAllAsRead(req.user._id);
    res
      .status(200)
      .json({ success: true, message: `${count} notifications marked as read` });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user._id);
    res
      .status(200)
      .json({ success: true, message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

const deleteAllRead = async (req, res, next) => {
  try {
    const count = await notificationService.deleteAllRead(req.user._id);
    res.status(200).json({
      success: true,
      message: `${count} read notifications deleted`,
    });
  } catch (error) {
    next(error);
  }
};



const sendNotification = async (req, res, next) => {
  try {
    const { title, message, type, recipientIds, sendToAll, offerCode, discountValue, expiryDate } = req.body;

    const notificationMetadata = {
      title,
      message,
      offerCode: offerCode || null,
      discountValue: discountValue || null,
      expiryDate: expiryDate || null,
    };

    if (sendToAll) {
      const User = require("../models/User");
      const users = await User.find({ isVerified: true }).select("_id");

      const promises = users.map((user) =>
        notifyUser({
          recipientId: user._id,
          type,
          title,
          message,
          icon: type === "promotional" ? "gift" : "bell",
          metadata: notificationMetadata,
        })
      );

      await Promise.allSettled(promises);

      res.status(200).json({
        success: true,
        message: `Notification sent to ${users.length} users`,
      });
    } else if (recipientIds && recipientIds.length > 0) {
      const promises = recipientIds.map((id) =>
        notifyUser({
          recipientId: id,
          type,
          title,
          message,
          icon: type === "promotional" ? "gift" : "bell",
          metadata: notificationMetadata,
        })
      );

      await Promise.allSettled(promises);

      res.status(200).json({
        success: true,
        message: `Notification sent to ${recipientIds.length} users`,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Provide recipientIds or sendToAll" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  sendNotification,
};