const sendEmail = require("./emailService");

/**
 * Send OTP email to user
 *
 * @param {string} email - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOTP = async (email, otp) => {
  if (!email) {
    throw new Error("Email is required to send OTP");
  }

  if (!otp) {
    throw new Error("OTP is required to send");
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
      <div style="background: linear-gradient(135deg, #dc2626, #f97316); padding: 24px; border-radius: 16px; color: #fff; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">TedBus</h1>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Verify your account</p>
      </div>

      <div style="background: #fff; border-radius: 16px; padding: 24px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h2 style="margin: 0 0 8px; color: #0f172a;">Your One Time Password</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Use the OTP below to verify your TedBus account. This OTP is valid for the next 5 minutes.
        </p>

        <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 2px;">OTP CODE</p>
          <p style="margin: 8px 0 0; font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px;">${otp}</p>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-top: 20px; border-radius: 8px;">
          <p style="margin: 0; color: #92400e; font-size: 13px;">
            Never share your OTP with anyone. TedBus team will never ask for your OTP.
          </p>
        </div>

        <p style="margin-top: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
          If you did not request this OTP, please ignore this email.
        </p>
      </div>

      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} TedBus • support@tedbus.com
      </p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject: "Verify Your TedBus Account - OTP Inside",
    html,
  });
};

module.exports = sendOTP;