const Notification = require("../models/Notification");
const NotificationPreference = require("../models/NotificationPreference");

const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message,
  icon = "bell",
  actionUrl = null,
  referenceType = null,
  referenceId = null,
  expiresAt = null,
   metadata = {},
}) => {
  const preference = await getOrCreatePreference(recipient);

  if (preference.categories[type] === false) {
    return null;
  }

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    icon,
    actionUrl,
    referenceType,
    referenceId,
    expiresAt,
     metadata,
  });

  return notification;
};

const getNotifications = async (userId, filters) => {
  const { page = 1, limit = 20, type, isRead } = filters;
  const skip = (page - 1) * limit;

  const query = { recipient: userId };
  if (type) query.type = type;
  if (isRead !== undefined) query.isRead = isRead;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("sender", "name profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  };
};

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
  return count;
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return result.modifiedCount;
};

const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  return notification;
};

const deleteAllRead = async (userId) => {
  const result = await Notification.deleteMany({
    recipient: userId,
    isRead: true,
  });

  return result.deletedCount;
};

const getOrCreatePreference = async (userId) => {
  let preference = await NotificationPreference.findOne({ user: userId });

  if (!preference) {
    preference = await NotificationPreference.create({ user: userId });
  }

  return preference;
};

const updatePreference = async (userId, updateData) => {
  let preference = await NotificationPreference.findOne({ user: userId });

  if (!preference) {
    preference = await NotificationPreference.create({ user: userId });
  }

  if (updateData.channels) {
    Object.assign(preference.channels, updateData.channels);
  }
  if (updateData.categories) {
    Object.assign(preference.categories, updateData.categories);
  }
  if (updateData.quietHours) {
    Object.assign(preference.quietHours, updateData.quietHours);
  }
  if (updateData.emailDigest) {
    preference.emailDigest = updateData.emailDigest;
  }

  await preference.save();
  return preference;
};

const updateDeliveryStatus = async (notificationId, channel, success) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) return null;

  notification.channels[channel].sent = success;
  if (success) {
    notification.channels[channel].sentAt = new Date();
  }

  const allChannelsSent = Object.values(notification.channels).every(
    (ch) => ch.sent === true
  );
  const anyChannelSent = Object.values(notification.channels).some(
    (ch) => ch.sent === true
  );

  if (allChannelsSent) {
    notification.deliveryStatus = "delivered";
  } else if (anyChannelSent) {
    notification.deliveryStatus = "partial";
  } else {
    notification.deliveryStatus = "failed";
  }

  await notification.save();
  return notification;
};

const getFailedNotifications = async (limit = 50) => {
  const notifications = await Notification.find({
    deliveryStatus: { $in: ["failed", "partial", "pending"] },
    retryCount: { $lt: 3 },
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  })
    .sort({ createdAt: 1 })
    .limit(limit);

  return notifications;
};

const incrementRetryCount = async (notificationId) => {
  await Notification.findByIdAndUpdate(notificationId, {
    $inc: { retryCount: 1 },
  });
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  getOrCreatePreference,
  updatePreference,
  updateDeliveryStatus,
  getFailedNotifications,
  incrementRetryCount,
};