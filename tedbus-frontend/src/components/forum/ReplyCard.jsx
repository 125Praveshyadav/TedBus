import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Award,
  CheckCircle2,
  CornerDownRight,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import useDiscussions from "../../hooks/useDiscussions";

const formatTimeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return "some time ago";
  }
};

/* Single reply item */
const ReplyItem = ({
  reply,
  theme,
  isBestAnswer,
  canMarkBest,
  onMarkBest,
  onNestedReply,
  isNested = false,
}) => {
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState("");

  const authorName = reply.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const handleSubmit = () => {
    if (!text.trim()) return;
    onNestedReply?.(text, reply._id);
    setText("");
    setShowBox(false);
  };

  return (
    <div className={isNested ? "ml-8 mt-3" : "pt-4"}>
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all ${
          isBestAnswer
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md shadow-emerald-500/10 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-teal-950/30"
            : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/50"
        }`}
      >
        {/* Best answer accent */}
        {isBestAnswer && (
          <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />
        )}

        <div className="p-4">
          {/* Best badge */}
          {isBestAnswer && (
            <div className="mb-3 flex items-center gap-2 border-b border-emerald-100 pb-3 dark:border-emerald-900/40">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-md shadow-emerald-500/20">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Best Answer
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {/* Avatar */}
            <div className="shrink-0">
              {reply.author?.profileImage ? (
                <img
                  src={reply.author.profileImage}
                  alt={authorName}
                  className="h-9 w-9 rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${theme.avatarBg} text-xs font-black text-white shadow-sm`}
                >
                  {authorInitial}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* Name + time */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                  {authorName}
                  {reply.author?.isVerified && (
                    <ShieldCheck className={`h-3.5 w-3.5 ${theme.accentText}`} />
                  )}
                </p>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {formatTimeAgo(reply.createdAt)}
                </span>
              </div>

              {/* Reply text */}
              <p className="mt-2 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300 whitespace-pre-line break-words">
                {reply.text}
              </p>

              {/* Nested replies */}
              {Array.isArray(reply.replies) && reply.replies.length > 0 && (
                <div className="mt-3 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                  {reply.replies.map((nested) => (
                    <ReplyItem
                      key={nested._id}
                      reply={nested}
                      theme={theme}
                      isBestAnswer={false}
                      canMarkBest={false}
                      isNested
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!isNested && (
                  <button
                    type="button"
                    onClick={() => setShowBox((p) => !p)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-black transition-all ${
                      showBox
                        ? `${theme.softBg} ${theme.softBorder} ${theme.accentText}`
                        : "border-transparent text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
                    }`}
                  >
                    <CornerDownRight className="h-3 w-3" />
                    {showBox ? "Cancel" : "Reply"}
                  </button>
                )}

                {canMarkBest && !isBestAnswer && !isNested && (
                  <button
                    type="button"
                    onClick={() => onMarkBest?.(reply._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-black text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400"
                  >
                    <Award className="h-3 w-3" />
                    Mark as Best
                  </button>
                )}
              </div>

              {/* Nested reply box */}
              {showBox && !isNested && (
                <div
                  className={`mt-3 overflow-hidden rounded-2xl border ${theme.softBorder} ${theme.softBg}`}
                >
                  <div className="flex items-start gap-2 p-3">
                    <CornerDownRight className="mt-3 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <div className="flex-1">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`Reply to ${authorName}...`}
                        rows={2}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.ctrlKey) handleSubmit();
                        }}
                        className={`w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:ring-4 dark:bg-slate-900 dark:text-white placeholder:text-slate-400 border-slate-200 dark:border-slate-700 ${theme.replyInputFocus}`}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-[9px] font-bold text-slate-400">
                          Ctrl + Enter to post
                        </p>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!text.trim()}
                          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0 active:scale-[0.98] ${theme.replyBtnBg}`}
                        >
                          <Send className="h-3.5 w-3.5" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Main ReplyCard panel */
const ReplyCard = ({
  discussionId,
  replies: initialReplies = [],
  theme,
  bestAnswerId,
  canMarkBest = false,
  onMarkBest,
}) => {
  const { postReply, loading } = useDiscussions();
  const [replies, setReplies] = useState(initialReplies);
  const [replyText, setReplyText] = useState("");

  const handlePostReply = async () => {
    if (!replyText.trim() || loading) return;

    const newReply = await postReply(discussionId, {
      text: replyText.trim(),
    });

    if (newReply) {
      setReplies((prev) => [...prev, newReply]);
      setReplyText("");
      toast.success("Reply posted!");
    }
  };

  const handleNestedReply = async (text, parentId) => {
    if (!text.trim()) return;

    const newReply = await postReply(discussionId, {
      text: text.trim(),
      parentId,
    });

    if (newReply) {
      setReplies((prev) =>
        prev.map((r) =>
          r._id === parentId
            ? { ...r, replies: [...(r.replies || []), newReply] }
            : r,
        ),
      );
      toast.success("Reply posted!");
    }
  };

  const handleMarkBest = (replyId) => {
    onMarkBest?.(discussionId, replyId);
  };

  return (
    <div>
      {/* Quick reply box */}
      <div className={`p-4 sm:p-5 ${theme.softBg}`}>
        <p className={`mb-3 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${theme.accentText}`}>
          <MessageCircle className="h-3.5 w-3.5" />
          Write a reply
        </p>

        <div className="flex items-start gap-3">
          {/* Your avatar placeholder */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.avatarBg} text-xs font-black text-white shadow-sm`}
          >
            Y
          </div>

          <div className="flex-1">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your thoughts, answer or tips..."
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey) handlePostReply();
              }}
              className={`w-full resize-none rounded-xl border bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:ring-4 dark:bg-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-200 dark:border-slate-700 ${theme.replyInputFocus}`}
            />

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                Ctrl + Enter to post
              </p>

              <button
                type="button"
                onClick={handlePostReply}
                disabled={!replyText.trim() || loading}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-black text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${theme.replyBtnHover} hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0 active:scale-[0.98] ${theme.replyBtnBg}`}
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {loading ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Existing replies */}
      <div className="divide-y divide-slate-100 px-4 pb-4 dark:divide-slate-800 sm:px-5">
        {replies.length === 0 ? (
          <div className="py-6 text-center">
            <div
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${theme.softBg}`}
            >
              <MessageCircle className={`h-5 w-5 ${theme.accentText}`} />
            </div>
            <p className="text-sm font-black text-slate-700 dark:text-slate-300">
              No replies yet
            </p>
            <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
              Be the first to reply to this discussion!
            </p>
          </div>
        ) : (
          replies.map((reply) => (
            <ReplyItem
              key={reply._id}
              reply={reply}
              theme={theme}
              isBestAnswer={bestAnswerId === reply._id}
              canMarkBest={canMarkBest}
              onMarkBest={handleMarkBest}
              onNestedReply={handleNestedReply}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReplyCard;