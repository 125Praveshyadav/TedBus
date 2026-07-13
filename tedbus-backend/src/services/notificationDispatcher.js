const { sendToUser, isUserOnline } = require("../config/socket");
const notificationService = require("./notificationService");
const { sendNotificationEmail } = require("./emailNotificationService");
const User = require("../models/User");

const dispatch = async (notification, preference) => {
  const results = {
    inApp: false,
    email: false,
    push: false,
  };

  if (isInQuietHours(preference)) {
    if (preference.channels.inApp) {
      results.inApp = await sendInApp(notification);
    }
    await notificationService.updateDeliveryStatus(
      notification._id,
      "inApp",
      results.inApp
    );
    return results;
  }

  if (preference.channels.inApp) {
    results.inApp = await sendInApp(notification);
    await notificationService.updateDeliveryStatus(
      notification._id,
      "inApp",
      results.inApp
    );
  }

  if (preference.channels.email && preference.emailDigest === "instant") {
    results.email = await sendEmail(notification);
    await notificationService.updateDeliveryStatus(
      notification._id,
      "email",
      results.email
    );
  }

  if (preference.channels.push) {
    results.push = await sendPush(notification);
    await notificationService.updateDeliveryStatus(
      notification._id,
      "push",
      results.push
    );
  }

  return results;
};

const sendInApp = async (notification) => {
  try {
    const populatedNotification = await notification.populate(
      "sender",
      "name profileImage"
    );

    const sent = sendToUser(
      notification.recipient.toString(),
      "new_notification",
      {
        _id: populatedNotification._id,
        type: populatedNotification.type,
        title: populatedNotification.title,
        message: populatedNotification.message,
        icon: populatedNotification.icon,
        actionUrl: populatedNotification.actionUrl,
        sender: populatedNotification.sender,
        isRead: false,
        createdAt: populatedNotification.createdAt,
      }
    );

    return sent || true;
  } catch (error) {
    console.error("In-app notification failed:", error.message);
    return false;
  }
};

const sendEmail = async (notification) => {
  try {
    // 🔑 Booking types ke liye email SKIP karo
    // kyunki sendTicketEmail already PDF wali email bhejta hai
    const bookingTypes = ["booking_confirmed", "booking_cancelled"];
    if (bookingTypes.includes(notification.type)) {
      console.log(`📧 Skipping email for ${notification.type} (handled by sendTicketEmail)`);
      return true; // true return karo taki delivery status "delivered" ho
    }

    const user = await User.findById(notification.recipient).select("name email");

    if (!user || !user.email) {
      console.warn("No email found for user:", notification.recipient);
      return false;
    }

    // 🔑 metadata se extra template data merge karo
    const templateData = {
      userName: user.name,
      ...(notification.metadata || {}),
    };

    const result = await sendNotificationEmail({
      to: user.email,
      type: notification.type,
      templateData,
    });

    return result;
  } catch (error) {
    console.error("Email notification failed:", error.message);
    return false;
  }
};

const sendPush = async (notification) => {
  try {
    console.log(
      `🔔 Push would be sent to user ${notification.recipient}: ${notification.title}`
    );
    return true;
  } catch (error) {
    console.error("Push notification failed:", error.message);
    return false;
  }
};

const isInQuietHours = (preference) => {
  if (!preference?.quietHours?.enabled) return false;

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  const [startH, startM] = preference.quietHours.start.split(":").map(Number);
  const [endH, endM] = preference.quietHours.end.split(":").map(Number);
  const startTime = startH * 60 + startM;
  const endTime = endH * 60 + endM;

  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime;
  }

  return currentTime >= startTime && currentTime < endTime;
};

const notifyUser = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  icon = "bell",
  actionUrl = null,
  referenceType = null,
  referenceId = null,
  expiresAt = null,
  metadata = {},  // 🔑 NEW
}) => {
  try {
    const preference = await notificationService.getOrCreatePreference(
      recipientId
    );

    if (preference.categories[type] === false) {
      return null;
    }

    const notification = await notificationService.createNotification({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      icon,
      actionUrl,
      referenceType,
      referenceId,
      expiresAt,
      metadata,  // 🔑 NEW
    });

    if (!notification) return null;

    const results = await dispatch(notification, preference);

    return { notification, deliveryResults: results };
  } catch (error) {
    console.error("Notification dispatch error:", error.message);
    return null;
  }
};

module.exports = {
  dispatch,
  notifyUser,
  sendInApp,
  sendEmail,
  sendPush,
};