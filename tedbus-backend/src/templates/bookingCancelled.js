const bookingCancelled = ({ userName, pnr, busName, source, destination, journeyDate, refundAmount, cancellationReason }) => {
  const subject = `❌ Booking Cancelled — PNR: ${pnr}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #475569, #1e293b); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">❌ Booking Cancelled</h1>
        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">PNR: ${pnr}</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;">Your booking has been cancelled. Details below:</p>

        <div style="background: #f1f5f9; border-radius: 16px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Bus</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${busName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Route</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${source} → ${destination}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Journey Date</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${journeyDate}</td>
            </tr>
            ${cancellationReason ? `
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Reason</td>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; text-align: right;">${cancellationReason}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${refundAmount ? `
        <div style="background: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 16px; padding: 16px; text-align: center; margin: 20px 0;">
          <p style="color: #166534; margin: 0; font-size: 13px; font-weight: 600;">Refund Amount</p>
          <p style="color: #16a34a; margin: 4px 0 0; font-size: 28px; font-weight: 900;">₹${refundAmount}</p>
          <p style="color: #4ade80; margin: 4px 0 0; font-size: 11px;">Will be credited within 5-7 business days</p>
        </div>
        ` : ''}

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">Need help? Contact our support team.</p>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus — Book. Ride. Relax.</p>
    </div>
  `;

  return { subject, html };
};

module.exports = bookingCancelled;