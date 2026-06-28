const { sendEmail } = require("./emailService");
const generateTicketBuffer = require("../utils/generateTicketBuffer");

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSeats = (booking) => {
  if (Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers.join(", ");
  }
  if (Array.isArray(booking.passengerDetails)) {
    return booking.passengerDetails
      .map((p) => p.seatNumber || p.seatNo)
      .filter(Boolean)
      .join(", ");
  }
  return "N/A";
};

const sendTicketEmail = async (booking) => {
  try {
    const user = booking.user || {};
    const bus = booking.bus || {};

    const recipientEmail =
      user.email ||
      booking.passengerDetails?.[0]?.email;

    if (!recipientEmail) {
      console.warn("No recipient email found for booking:", booking._id);
      return;
    }

    // Generate PDF buffer
    const pdfBuffer = await generateTicketBuffer(booking);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: linear-gradient(135deg, #dc2626, #f97316); padding: 24px; border-radius: 16px; color: #fff; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">TedBus</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Booking Confirmed</p>
        </div>

        <div style="background: #fff; border-radius: 16px; padding: 24px; margin-top: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="margin: 0 0 8px; color: #0f172a;">Hi ${user.name || "Traveller"},</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Your booking has been confirmed successfully. Your e-ticket is attached as a PDF with this email.
          </p>

          <div style="background: #f1f5f9; border-radius: 12px; padding: 16px; margin-top: 20px;">
            <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">PNR</p>
            <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #dc2626;">${booking.pnr || "N/A"}</p>
          </div>

          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Route</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${bus.source || "—"} → ${bus.destination || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Bus</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${bus.busName || "TedBus"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Date</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${formatDate(booking.journeyDate || bus.journeyDate)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Seats</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600; text-align: right;">${getSeats(booking)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px;">Total Paid</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: 700; text-align: right;">₹${booking.totalAmount || 0}</td>
            </tr>
          </table>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-top: 20px; border-radius: 8px;">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              Please carry a valid ID proof and reach boarding point at least 20 minutes early.
            </p>
          </div>

          <p style="margin-top: 24px; font-size: 13px; color: #475569; line-height: 1.6;">
            Find your full ticket attached as a PDF. You can also download it anytime from My Bookings.
          </p>
        </div>

        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">
          © ${new Date().getFullYear()} TedBus • support@tedbus.com
        </p>
      </div>
    `;

    await sendEmail({
      to: recipientEmail,
      subject: `Your TedBus E-Ticket • PNR ${booking.pnr}`,
      html,
      attachments: [
        {
          filename: `TedBus-Ticket-${booking.pnr || booking._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ Ticket email sent to:", recipientEmail);
  } catch (error) {
    console.error("SEND TICKET EMAIL ERROR:", error.message);
  }
};

module.exports = sendTicketEmail;