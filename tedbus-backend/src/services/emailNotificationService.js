const sendEmail = require("./emailService");

const bookingConfirmedTemplate = require("../templates/bookingConfirmed");
const bookingCancelledTemplate = require("../templates/bookingCancelled");
const journeyReminderTemplate = require("../templates/journeyReminder");
const scheduleChangedTemplate = require("../templates/scheduleChanged");
const promotionalTemplate = require("../templates/promotional");
const communityLikeTemplate = require("../templates/communityLike");
const communityCommentTemplate = require("../templates/communityComment");
const communityReplyTemplate = require("../templates/communityReply");

const templateMap = {
  booking_confirmed: bookingConfirmedTemplate,
  booking_cancelled: bookingCancelledTemplate,
  journey_reminder: journeyReminderTemplate,
  schedule_changed: scheduleChangedTemplate,
  promotional: promotionalTemplate,
  community_like: communityLikeTemplate,
  community_comment: communityCommentTemplate,
  community_reply: communityReplyTemplate,
};

const sendNotificationEmail = async ({ to, type, templateData }) => {
  try {
    const templateFn = templateMap[type];

    if (!templateFn) {
      console.warn(`No email template found for type: ${type}`);
      return false;
    }

    const { subject, html } = templateFn(templateData);

    await sendEmail({ to, subject, html });

    console.log(`📧 Notification email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error(`📧 Notification email failed to ${to}:`, error.message);
    return false;
  }
};

module.exports = { sendNotificationEmail };