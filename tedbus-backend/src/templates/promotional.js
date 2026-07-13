const promotional = ({ userName, title, message, offerCode, discountValue, expiryDate }) => {
  const subject = `🎁 ${title}`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 30px; border-radius: 20px 20px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🎁 Special Offer!</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">${title}</p>
      </div>

      <div style="background: white; padding: 30px; border-radius: 0 0 20px 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName || 'Traveler'}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;">${message}</p>

        ${offerCode ? `
        <div style="background: linear-gradient(135deg, #fef2f2, #fff7ed); border: 2px dashed #dc2626; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0; font-weight: 700; text-transform: uppercase;">Use Code</p>
          <p style="color: #dc2626; font-size: 32px; font-weight: 900; margin: 8px 0; letter-spacing: 4px;">${offerCode}</p>
          ${discountValue ? `<p style="color: #64748b; font-size: 14px; margin: 0;">Get <strong style="color: #dc2626;">${discountValue}</strong> off on your next booking!</p>` : ''}
          ${expiryDate ? `<p style="color: #94a3b8; font-size: 11px; margin: 8px 0 0;">Valid till: ${expiryDate}</p>` : ''}
        </div>
        ` : ''}

        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/search-bus" style="background: #dc2626; color: white; padding: 14px 32px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block;">Book Now →</a>
        </div>

        <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-bottom: 0;">You are receiving this because you opted in for promotional emails. <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/notification-settings" style="color: #dc2626;">Unsubscribe</a></p>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus — Book. Ride. Relax.</p>
    </div>
  `;

  return { subject, html };
};

module.exports = promotional;