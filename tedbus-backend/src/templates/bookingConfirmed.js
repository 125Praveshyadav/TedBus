const bookingConfirmed = ({ userName, pnr, busName, source, destination, journeyDate, departureTime, seatNumbers, totalAmount }) => {
  const subject = `✅ Booking Confirmed — PNR: ${pnr}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626, #ea580c); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎫 Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your ticket is ready</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;">Your bus ticket has been successfully booked. Here are the details:</p>

        <div style="background: #fef2f2; border: 2px solid #fecaca; border-radius: 16px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">PNR Number</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 800; font-size: 16px; text-align: right;">${pnr}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Bus</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${busName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Route</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: 700; text-align: right;">${source} → ${destination}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Journey Date</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${journeyDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Departure</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${departureTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Seats</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${seatNumbers}</td>
            </tr>
            <tr style="border-top: 2px solid #fecaca;">
              <td style="padding: 12px 0 0; color: #94a3b8; font-size: 13px;">Total Paid</td>
              <td style="padding: 12px 0 0; color: #dc2626; font-weight: 900; font-size: 20px; text-align: right;">₹${totalAmount}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" style="background: #dc2626; color: white; padding: 14px 32px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block;">View My Booking</a>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">Have a safe journey! 🚌</p>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus — Book. Ride. Relax.</p>
    </div>
  `;

  return { subject, html };
};

module.exports = bookingConfirmed;