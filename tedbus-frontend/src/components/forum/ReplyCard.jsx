import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Award, CornerDownRight, MessageSquareReply, CheckCircle2 } from "lucide-react";

const ReplyCard = ({ reply, isBestAnswer, onReply, isNested = false, canMarkBest, onMarkBest }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(replyText, reply._id);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className={`${isNested ? "ml-8 mt-3" : "mb-4"}`}>
      <div
        className={`p-5 rounded-2xl border-2 transition-all ${
          isBestAnswer
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-[0_4px_16px_rgba(34,197,94,0.1)]"
            : "bg-white border-slate-100"
        }`}
      >
        {/* Best Answer Badge */}
        {isBestAnswer && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-green-200">
            <div className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1 rounded-xl text-xs font-black">
              <CheckCircle2 size={14} />
              BEST ANSWER
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <img
            src={
              reply.author?.profileImage ||
              `https://ui-avatars.com/api/?name=${reply.author?.name}&background=fee2e2&color=dc2626`
            }
            alt={reply.author?.name}
            className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-black text-slate-800">{reply.author?.name}</p>
              <span className="text-xs text-slate-400 font-medium">
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </span>
            </div>

            <p className="text-slate-700 leading-relaxed whitespace-pre-line break-words">
              {reply.text}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              {!isNested && (
                <button
                  onClick={() => setShowReplyBox(!showReplyBox)}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <MessageSquareReply size={13} />
                  Reply
                </button>
              )}

              {canMarkBest && !isBestAnswer && !isNested && (
                <button
                  onClick={() => onMarkBest(reply._id)}
                  className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
                >
                  <Award size={13} />
                  Mark as Best
                </button>
              )}
            </div>

            {/* Reply Input */}
            {showReplyBox && (
              <div className="flex items-center gap-2 mt-3">
                <CornerDownRight size={16} className="text-slate-300 shrink-0" />
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${reply.author?.name}...`}
                  className="flex-1 text-sm px-3 py-2 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-red-400 focus:bg-white"
                  onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
                />
                <button
                  onClick={handleReplySubmit}
                  className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyCard;