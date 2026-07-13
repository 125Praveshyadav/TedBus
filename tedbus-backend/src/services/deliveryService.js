const notificationService = require("./notificationService");
const { dispatch } = require("./notificationDispatcher");

const retryFailedNotifications = async () => {
  try {
    console.log("🔄 Running retry job for failed notifications...");

    const failedNotifications = await notificationService.getFailedNotifications(50);

    if (failedNotifications.length === 0) {
      console.log("🔄 No failed notifications to retry.");
      return { retried: 0 };
    }

    console.log(`🔄 Found ${failedNotifications.length} failed notifications`);

    let retriedCount = 0;
    let successCount = 0;

    for (const notification of failedNotifications) {
      try {
        const preference = await notificationService.getOrCreatePreference(
          notification.recipient
        );

        const failedChannels = {};

        if (!notification.channels.inApp.sent && preference.channels.inApp) {
          failedChannels.inApp = true;
        }
        if (!notification.channels.email.sent && preference.channels.email) {
          failedChannels.email = true;
        }
        if (!notification.channels.push.sent && preference.channels.push) {
          failedChannels.push = true;
        }

        if (Object.keys(failedChannels).length === 0) {
          await notificationService.updateDeliveryStatus(
            notification._id,
            "inApp",
            true
          );
          continue;
        }

        const results = await dispatch(notification, preference);

        await notificationService.incrementRetryCount(notification._id);

        retriedCount++;

        const anySuccess = Object.values(results).some((r) => r === true);
        if (anySuccess) successCount++;
      } catch (err) {
        console.error(`🔄 Retry failed for ${notification._id}:`, err.message);
        await notificationService.incrementRetryCount(notification._id);
      }
    }

    console.log(`🔄 Retry complete: ${retriedCount} retried, ${successCount} succeeded`);
    return { retried: retriedCount, succeeded: successCount };
  } catch (error) {
    console.error("🔄 Retry job failed:", error.message);
    return { retried: 0, error: error.message };
  }
};

module.exports = { retryFailedNotifications };