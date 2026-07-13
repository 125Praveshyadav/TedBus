const journeyReminder = ({ userName, pnr, busName, source, destination, journeyDate, departureTime, boardingPoint }) => {
  const subject = `🔔 Journey Tomorrow — ${source} to ${destination}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Journey Reminder</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your trip is tomorrow!</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;">Friendly reminder — your bus journey is tomorrow! 🚌</p>

        <div style="background: #fffbeb; border: 2px solid #fde68a; border-radius: 16px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">PNR</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 800; text-align: right;">${pnr}</td>
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
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Date</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${journeyDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Departure</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${departureTime}</td>
            </tr>
            ${boardingPoint ? `
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; font-size: 13px;">Boarding Point</td>
              <td style="padding: 8px 0; color: #1e293b; font-weight: 700; text-align: right;">${boardingPoint}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background: #fef2f2; border-radius: 12px; padding: 14px; margin: 20px 0;">
          <p style="color: #dc2626; font-size: 13px; font-weight: 700; margin: 0;">📌 Quick Tips:</p>
          <ul style="color: #64748b; font-size: 12px; margin: 8px 0 0; padding-left: 16px;">
            <li>Reach boarding point 15 minutes early</li>
            <li>Carry a valid ID proof</li>
            <li>Keep your PNR number handy</li>
          </ul>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">Have a safe and happy journey! 🎉</p>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus — Book. Ride. Relax.</p>
    </div>
  `;

  return { subject, html };
};

module.exports = journeyReminder;