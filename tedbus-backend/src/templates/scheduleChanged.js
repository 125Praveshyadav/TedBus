const scheduleChanged = ({ userName, pnr, busName, source, destination, oldTime, newTime, journeyDate }) => {
  const subject = `⚠️ Schedule Update — PNR: ${pnr}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Schedule Changed</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Important update for your journey</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;">The schedule for your bus <strong>${busName}</strong> (${source} → ${destination}) on <strong>${journeyDate}</strong> has been updated.</p>

        <div style="display: flex; gap: 12px; margin: 24px 0;">
          <div style="flex: 1; background: #fef2f2; border-radius: 16px; padding: 16px; text-align: center; border: 2px solid #fecaca;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0; font-weight: 700;">OLD TIME</p>
            <p style="color: #dc2626; font-size: 22px; font-weight: 900; margin: 6px 0 0; text-decoration: line-through;">${oldTime}</p>
          </div>
          <div style="flex: 1; background: #f0fdf4; border-radius: 16px; padding: 16px; text-align: center; border: 2px solid #bbf7d0;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0; font-weight: 700;">NEW TIME</p>
            <p style="color: #16a34a; font-size: 22px; font-weight: 900; margin: 6px 0 0;">${newTime}</p>
          </div>
        </div>

        <p style="color: #64748b; font-size: 13px;">Please plan your travel accordingly. We apologize for any inconvenience.</p>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">Need to cancel? Visit My Bookings in the TedBus app.</p>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus — Book. Ride. Relax.</p>
    </div>
  `;

  return { subject, html };
};

module.exports = scheduleChanged;