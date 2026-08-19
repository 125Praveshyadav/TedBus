// const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.SMTP_MAIL,
// //     pass: process.env.SMTP_PASSWORD,
// //   },
// // });
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: Number(process.env.EMAIL_PORT) || 587,
//   secure: false,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Test connection on startup
// transporter.verify((error) => {
//   if (error) {
//     console.error("❌ Email service error:", error.message);
//   } else {
//     console.log("✅ Email service ready");
//   }
// });

// // /**
// //  * Send email
// //  *
// //  * @param {Object} options
// //  * @param {string} options.to - recipient
// //  * @param {string} options.subject - subject line
// //  * @param {string} options.html - html body
// //  * @param {Array}  [options.attachments] - nodemailer attachments
// //  */
// const sendEmail = async ({ to, subject, html, attachments }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.EMAIL_FROM || `TedBus <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//       attachments,
//     });

//     console.log("📨 Email sent:", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("EMAIL SEND ERROR:", error.message);
//     throw error;
//   }
// };
// module.exports = sendEmail;

const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

/**
 * Send email using Brevo API
 *
 * @param {Object} options
 * @param {string} options.to - recipient email
 * @param {string} options.subject - subject line
 * @param {string} options.html - HTML body
 * @param {Array} [options.attachments] - optional attachments
 */
const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!process.env.BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error("EMAIL_FROM is not configured");
    }

    const emailData = {
      sender: {
        name: process.env.EMAIL_FROM_NAME || "TedBus",
        email: process.env.EMAIL_FROM,
      },

      to: [
        {
          email: to,
        },
      ],

      subject: subject,
      htmlContent: html,
    };

    // Support attachments if any existing TedBus functionality uses them
    if (attachments && attachments.length > 0) {
      emailData.attachment = attachments.map((file) => ({
        name: file.filename,
        content: file.content,
      }));
    }

    const response =
      await brevo.transactionalEmails.sendTransacEmail(emailData);

    console.log("📨 Brevo email sent successfully");

    return response;
  } catch (error) {
    console.error(
      "❌ BREVO EMAIL SEND ERROR:",
      error?.message || error
    );

    throw error;
  }
};

module.exports = sendEmail;