const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

// Test connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service ready");
  }
});


// /**
//  * Send email
//  *
//  * @param {Object} options
//  * @param {string} options.to - recipient
//  * @param {string} options.subject - subject line
//  * @param {string} options.html - html body
//  * @param {Array}  [options.attachments] - nodemailer attachments
//  */
const sendEmail = async ({ to, subject, html, attachments }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `TedBus <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("📨 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("EMAIL SEND ERROR:", error.message);
    throw error;
  }
};
module.exports = sendEmail;
