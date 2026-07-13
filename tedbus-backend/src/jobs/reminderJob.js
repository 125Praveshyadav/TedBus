const cron = require("node-cron");
const { sendJourneyReminders } = require("../services/reminderService");

const startReminderJob = () => {
  // Har roz subah 8:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("═══════════════════════════════════════");
    console.log("⏰ CRON: Journey Reminder Job Started");
    console.log("═══════════════════════════════════════");

    const result = await sendJourneyReminders();

    console.log("⏰ CRON: Journey Reminder Job Result:", result);
    console.log("═══════════════════════════════════════");
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log("📅 Journey reminder cron scheduled: Every day at 8:00 AM IST");
};

module.exports = { startReminderJob };