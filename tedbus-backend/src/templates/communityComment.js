const communityComment = ({ userName, senderName, postTitle, commentText, postId }) => {
  const subject = `💬 ${senderName} commented on your post`;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: white; padding: 30px; border-radius: 20px; border: 1px solid #e2e8f0;">
        <p style="color: #334155; font-size: 16px; margin-top: 0;">Hi <strong>${userName}</strong>,</p>
        <p style="color: #64748b; font-size: 14px;"><strong style="color: #1e293b;">${senderName}</strong> commented on your post:</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #dc2626; padding: 12px 16px; border-radius: 0 12px 12px 0; margin: 16px 0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0 0 4px;">On: "${postTitle}"</p>
          <p style="color: #334155; font-weight: 600; margin: 0; font-size: 14px;">"${commentText}"</p>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/community/post/${postId}" style="background: #dc2626; color: white; padding: 12px 28px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block;">View Comment</a>
        </div>
      </div>

      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© TedBus Community</p>
    </div>
  `;

  return { subject, html };
};

module.exports = communityComment;