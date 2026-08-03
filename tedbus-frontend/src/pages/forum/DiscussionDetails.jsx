import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  Eye,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Pin,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

import useDiscussions from "../../hooks/useDiscussions";
import ReplyCard from "../../components/forum/ReplyCard";
import discussionService from "../../services/discussionService";
import { useAuth } from "../../components/context/AuthContext";

const TAG_COLORS = [
  "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50",
  "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900/50",
  "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/50",
  "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100 dark:bg-fuchsia-950/40 dark:text-fuchsia-400 dark:border-fuchsia-900/50",
  "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50",
];

const formatTimeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return "some time ago";
  }
};

const StatBadge = ({ icon: Icon, value, color }) => (
  <span
    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[11px] font-black ${color}`}
  >
    <Icon className="h-3.5 w-3.5" />
    {value}
  </span>
);

const DiscussionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const {
    singleDiscussion,
    fetchDiscussionById,
    loading,
  } = useDiscussions();

  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [repliesLoading, setRepliesLoading] =
    useState(false);

  useEffect(() => {
    fetchDiscussionById(id);
    loadReplies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadReplies = async () => {
    try {
      setRepliesLoading(true);
      const data =
        await discussionService.getRepliesByDiscussion(
          id,
        );
      setReplies(data?.replies || []);
    } catch {
      // silent
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleAddReply = async (
    text = null,
    parentReply = null,
  ) => {
    const replyText = text || newReply;

    if (!user)
      return toast.error("Please login to reply");
    if (!replyText.trim()) return;

    setSubmitting(true);

    try {
      await discussionService.createReply(id, {
        text: replyText,
        parentReply: parentReply || null,
      });

      toast.success(
        parentReply ? "Reply added!" : "Answer posted!",
      );

      if (!parentReply) setNewReply("");

      loadReplies();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to post reply",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkBest = async (replyId) => {
    try {
      await discussionService.markBestAnswer(
        id,
        replyId,
      );
      toast.success("Marked as best answer!");
      loadReplies();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to mark best answer",
      );
    }
  };

  /* ── Loading state ── */
  if (loading || !singleDiscussion) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Loading discussion...
          </p>
        </div>
      </main>
    );
  }

  const isDiscussionAuthor =
    user?._id === singleDiscussion.author?._id;

  const topLevelReplies = replies.filter(
    (r) => !r.parentReply,
  );
  const bestAnswer = replies.find(
    (r) => r.isBestAnswer,
  );
  const otherReplies = topLevelReplies.filter(
    (r) => !r.isBestAnswer,
  );

  const getNestedReplies = (parentId) =>
    replies.filter((r) => r.parentReply === parentId);

  const hasRoute =
    singleDiscussion.route?.source &&
    singleDiscussion.route?.destination;

  const authorName =
    singleDiscussion.author?.name || "Anonymous";
  const authorInitial = authorName
    .charAt(0)
    .toUpperCase();

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "Y";

  /* ── Dummy theme for ReplyCard ── */
  const replyTheme = {
    accentText:
      "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder:
      "border-violet-100 dark:border-violet-900/50",
    avatarBg: "from-violet-600 to-indigo-600",
    replyInputFocus:
      "focus:border-violet-400 focus:ring-violet-400/10",
    replyBtnBg:
      "bg-gradient-to-r from-violet-600 to-indigo-500 shadow-violet-500/25",
    replyBtnHover: "hover:shadow-violet-500/40",
    tagColor:
      "text-violet-500 dark:text-violet-400",
  };

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            to={`/community/forums/${singleDiscussion.forum?.slug || ""}`}
            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:text-violet-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
              {singleDiscussion.title}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {singleDiscussion.forum?.name ||
                "Community Forum"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <StatBadge
              icon={MessageCircle}
              value={`${replies.length} ${replies.length === 1 ? "answer" : "answers"}`}
              color="bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/50"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Discussion header card */}
        <div className="relative mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Gradient header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:38px_38px] opacity-20" />

            <div className="relative">
              {/* Status badges */}
              {(singleDiscussion.isPinned ||
                singleDiscussion.isClosed) && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {singleDiscussion.isPinned && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/40 bg-amber-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200 backdrop-blur">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </span>
                  )}
                  {singleDiscussion.isClosed && (
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur">
                      <Lock className="h-3 w-3" />
                      Closed
                    </span>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-xl font-black leading-snug tracking-tight sm:text-2xl lg:text-3xl">
                {singleDiscussion.title}
              </h1>

              {/* Route */}
              {hasRoute && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-bold backdrop-blur">
                  <MapPin className="h-4 w-4" />
                  {singleDiscussion.route.source} →{" "}
                  {singleDiscussion.route.destination}
                </div>
              )}

              {/* Stats row */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                  <Eye className="h-3.5 w-3.5" />
                  {singleDiscussion.views || 0} views
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {replies.length}{" "}
                  {replies.length === 1
                    ? "answer"
                    : "answers"}
                </span>
                <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatTimeAgo(
                    singleDiscussion.createdAt,
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket notch */}
          <div className="relative z-10">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6">
            {/* Content */}
            <p className="whitespace-pre-line text-sm font-medium leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
              {singleDiscussion.content}
            </p>

            {/* Tags */}
            {singleDiscussion.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {singleDiscussion.tags.map(
                  (tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`rounded-xl border px-3 py-1 text-[10px] font-black ${TAG_COLORS[index % TAG_COLORS.length]}`}
                    >
                      #{tag}
                    </span>
                  ),
                )}
              </div>
            )}

            {/* Author row */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <Link
                to={`/community/profile/${singleDiscussion.author?._id}`}
                className="group flex items-center gap-3"
              >
                <div className="rounded-xl bg-gradient-to-tr from-violet-500 via-indigo-500 to-blue-400 p-[2px]">
                  <div className="rounded-[10px] bg-white p-[2px] dark:bg-slate-900">
                    {singleDiscussion.author
                      ?.profileImage ? (
                      <img
                        src={
                          singleDiscussion.author
                            .profileImage
                        }
                        alt={authorName}
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white">
                        {authorInitial}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="flex items-center gap-1.5 text-sm font-black text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                    {authorName}
                    {singleDiscussion.author
                      ?.isVerified && (
                      <ShieldCheck className="h-3.5 w-3.5 text-violet-500" />
                    )}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    Posted by discussion author
                  </p>
                </div>
              </Link>

              {isDiscussionAuthor && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-black text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                  <Sparkles className="h-3 w-3" />
                  Your Discussion
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Answers section */}
        <div className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Section header */}
          <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-teal-950/20 sm:p-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/15" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-white shadow-lg shadow-teal-500/25">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    {replies.length}{" "}
                    {replies.length === 1
                      ? "Answer"
                      : "Answers"}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    Sorted by best answer first
                  </p>
                </div>
              </div>

              {bestAnswer && (
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Best answer found
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {repliesLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Loading answers...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Best answer */}
                {bestAnswer && (
                  <div className="mb-5">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-emerald-100 dark:bg-emerald-900/40" />
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <Award className="h-3.5 w-3.5" />
                        Best Answer
                      </span>
                      <span className="h-px flex-1 bg-emerald-100 dark:bg-emerald-900/40" />
                    </div>

                    <ReplyCard
                      reply={bestAnswer}
                      theme={replyTheme}
                      isBestAnswer
                      onReply={handleAddReply}
                      canMarkBest={isDiscussionAuthor}
                      onMarkBest={handleMarkBest}
                    />

                    {getNestedReplies(
                      bestAnswer._id,
                    ).map((nested) => (
                      <ReplyCard
                        key={nested._id}
                        reply={nested}
                        theme={replyTheme}
                        isNested
                        onReply={handleAddReply}
                      />
                    ))}
                  </div>
                )}

                {/* Other answers */}
                {otherReplies.length === 0 &&
                !bestAnswer ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 text-teal-600 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400">
                      <MessageCircle className="h-6 w-6" />
                    </div>
                    <p className="mt-4 text-sm font-black text-slate-700 dark:text-slate-300">
                      No answers yet
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                      Be the first to share your
                      knowledge!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
                    {otherReplies.map((reply) => (
                      <div key={reply._id}>
                        <ReplyCard
                          reply={reply}
                          theme={replyTheme}
                          onReply={handleAddReply}
                          canMarkBest={
                            isDiscussionAuthor
                          }
                          onMarkBest={handleMarkBest}
                        />
                        {getNestedReplies(
                          reply._id,
                        ).map((nested) => (
                          <ReplyCard
                            key={nested._id}
                            reply={nested}
                            theme={replyTheme}
                            isNested
                            onReply={handleAddReply}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Reply box */}
        {user && !singleDiscussion.isClosed && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            {/* Header */}
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 sm:p-5">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/15" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
                  <Send className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Your Answer
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    Share your knowledge or experience
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                {/* User avatar */}
                <div className="shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="You"
                      className="h-10 w-10 rounded-xl object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-md shadow-indigo-500/20">
                      {userInitial}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <textarea
                    value={newReply}
                    onChange={(e) =>
                      setNewReply(e.target.value)
                    }
                    placeholder="Share your thoughts, answer or experience in detail..."
                    rows={4}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        e.ctrlKey
                      )
                        handleAddReply();
                    }}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      Ctrl + Enter to post quickly
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddReply()}
                      disabled={
                        submitting || !newReply.trim()
                      }
                      className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-black text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0 active:scale-[0.98]"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {submitting
                        ? "Posting..."
                        : "Post Answer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Closed notice */}
        {singleDiscussion.isClosed && (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 py-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              This discussion is closed for new replies
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default DiscussionDetails;