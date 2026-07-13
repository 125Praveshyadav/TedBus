const cron = require("node-cron");
const { retryFailedNotifications } = require("../services/deliveryService");

const startRetryJob = () => {
  // Har 30 minute mein
  cron.schedule("*/30 * * * *", async () => {
    console.log("═══════════════════════════════════════");
    console.log("🔄 CRON: Retry Failed Notifications Job Started");
    console.log("═══════════════════════════════════════");

    const result = await retryFailedNotifications();

    console.log("🔄 CRON: Retry Job Result:", result);
    console.log("═══════════════════════════════════════");
  });

  console.log("🔄 Retry cron scheduled: Every 30 minutes");
};

module.exports = { startRetryJob };