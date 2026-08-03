import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Lock,
  MapPin,
  MessageCircle,
  Pin,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import ReplyCard from "./ReplyCard";

const CARD_THEMES = [
  {
    id: "rose",
    gradient: "from-rose-600 via-pink-500 to-fuchsia-500",
    accentText: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-50 dark:bg-rose-950/40",
    softBorder: "border-rose-100 dark:border-rose-900/50",
    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-900/60",
    hoverShadow: "hover:shadow-rose-500/10",
    titleHover: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    avatarGradient: "from-rose-500 via-pink-500 to-fuchsia-400",
    avatarBg: "from-rose-600 to-pink-500",
    stripGradient: "from-rose-300 via-pink-300 to-fuchsia-300 dark:from-rose-800 dark:via-pink-800 dark:to-fuchsia-800",
    statBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    replyBtnBg: "bg-gradient-to-r from-rose-600 to-pink-500 shadow-rose-500/25",
    replyBtnHover: "hover:shadow-rose-500/40",
    replyInputFocus: "focus:border-rose-400 focus:ring-rose-400/10",
    countBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
    routeBadge: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-700 dark:text-rose-400",
    glow: "from-rose-500 to-pink-500",
    expandBtn: "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50",
  },
  {
    id: "cyan",
    gradient: "from-cyan-600 via-sky-500 to-blue-500",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    hoverBorder: "hover:border-cyan-200 dark:hover:border-cyan-900/60",
    hoverShadow: "hover:shadow-cyan-500/10",
    titleHover: "group-hover:text-cyan-600 dark:group-hover:text-cyan-400",
    avatarGradient: "from-cyan-500 via-sky-500 to-blue-400",
    avatarBg: "from-cyan-600 to-sky-500",
    stripGradient: "from-cyan-300 via-sky-300 to-blue-300 dark:from-cyan-800 dark:via-sky-800 dark:to-blue-800",
    statBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400",
    replyBtnBg: "bg-gradient-to-r from-cyan-600 to-sky-500 shadow-cyan-500/25",
    replyBtnHover: "hover:shadow-cyan-500/40",
    replyInputFocus: "focus:border-cyan-400 focus:ring-cyan-400/10",
    countBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400",
    routeBadge: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-100 dark:border-cyan-900/50 text-cyan-700 dark:text-cyan-400",
    glow: "from-cyan-500 to-sky-500",
    expandBtn: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-100 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-950/50",
  },
  {
    id: "emerald",
    gradient: "from-emerald-600 via-teal-500 to-green-500",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    hoverShadow: "hover:shadow-emerald-500/10",
    titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    avatarGradient: "from-emerald-500 via-teal-500 to-green-400",
    avatarBg: "from-emerald-600 to-teal-500",
    stripGradient: "from-emerald-300 via-teal-300 to-green-300 dark:from-emerald-800 dark:via-teal-800 dark:to-green-800",
    statBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    replyBtnBg: "bg-gradient-to-r from-emerald-600 to-teal-500 shadow-emerald-500/25",
    replyBtnHover: "hover:shadow-emerald-500/40",
    replyInputFocus: "focus:border-emerald-400 focus:ring-emerald-400/10",
    countBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    routeBadge: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400",
    glow: "from-emerald-500 to-teal-500",
    expandBtn: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50",
  },
  {
    id: "orange",
    gradient: "from-orange-600 via-amber-500 to-yellow-500",
    accentText: "text-orange-600 dark:text-orange-400",
    softBg: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
    hoverBorder: "hover:border-orange-200 dark:hover:border-orange-900/60",
    hoverShadow: "hover:shadow-orange-500/10",
    titleHover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
    avatarGradient: "from-orange-500 via-amber-500 to-yellow-400",
    avatarBg: "from-orange-600 to-amber-500",
    stripGradient: "from-orange-300 via-amber-300 to-yellow-300 dark:from-orange-800 dark:via-amber-800 dark:to-yellow-800",
    statBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
    replyBtnBg: "bg-gradient-to-r from-orange-600 to-amber-500 shadow-orange-500/25",
    replyBtnHover: "hover:shadow-orange-500/40",
    replyInputFocus: "focus:border-orange-400 focus:ring-orange-400/10",
    countBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400",
    routeBadge: "bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50 text-orange-700 dark:text-orange-400",
    glow: "from-orange-500 to-amber-500",
    expandBtn: "bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50",
  },
  {
    id: "purple",
    gradient: "from-purple-600 via-violet-600 to-indigo-500",
    accentText: "text-purple-600 dark:text-purple-400",
    softBg: "bg-purple-50 dark:bg-purple-950/40",
    softBorder: "border-purple-100 dark:border-purple-900/50",
    hoverBorder: "hover:border-purple-200 dark:hover:border-purple-900/60",
    hoverShadow: "hover:shadow-purple-500/10",
    titleHover: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    avatarGradient: "from-purple-500 via-violet-500 to-indigo-400",
    avatarBg: "from-purple-600 to-violet-600",
    stripGradient: "from-purple-300 via-violet-300 to-indigo-300 dark:from-purple-800 dark:via-violet-800 dark:to-indigo-800",
    statBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    replyBtnBg: "bg-gradient-to-r from-purple-600 to-violet-600 shadow-purple-500/25",
    replyBtnHover: "hover:shadow-purple-500/40",
    replyInputFocus: "focus:border-purple-400 focus:ring-purple-400/10",
    countBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400",
    routeBadge: "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50 text-purple-700 dark:text-purple-400",
    glow: "from-purple-500 to-violet-500",
    expandBtn: "bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50",
  },
];

const getTheme = (index) =>
  CARD_THEMES[(Number(index) || 0) % CARD_THEMES.length];

const TAG_COLORS = [
  "text-rose-500 dark:text-rose-400",
  "text-cyan-500 dark:text-cyan-400",
  "text-emerald-500 dark:text-emerald-400",
  "text-orange-500 dark:text-orange-400",
  "text-purple-500 dark:text-purple-400",
  "text-sky-500 dark:text-sky-400",
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

const DiscussionCard = ({
  discussion,
  index = 0,
  canMarkBest = false,
  onMarkBest,
}) => {
  const theme = getTheme(index);
  const [showReplies, setShowReplies] = useState(false);

  const authorName = discussion.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const hasRoute = discussion.route?.source && discussion.route?.destination;
  const hasTags = Array.isArray(discussion.tags) && discussion.tags.length > 0;
  const replyCount = discussion.replyCount || 0;
  const viewCount = discussion.views || 0;
  const isPinned = Boolean(discussion.isPinned);
  const isClosed = Boolean(discussion.isClosed);

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${theme.hoverBorder} ${theme.hoverShadow} hover:-translate-y-0.5 hover:shadow-xl`}
    >
      {/* Pinned strip */}
      {isPinned && (
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500" />
      )}

      {/* Themed top strip */}
      {!isPinned && (
        <div
          className={`h-0.5 w-full bg-gradient-to-r ${theme.stripGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
      )}

      {/* Main card content */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          {/* Avatar */}
          <div className="shrink-0">
            <div
              className={`rounded-xl bg-gradient-to-tr ${theme.avatarGradient} p-[2px]`}
            >
              <div className="rounded-[10px] bg-white p-[2px] dark:bg-slate-900">
                {discussion.author?.profileImage ? (
                  <img
                    src={discussion.author.profileImage}
                    alt={authorName}
                    className="h-10 w-10 rounded-xl object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${theme.avatarBg} text-sm font-black text-white`}
                  >
                    {authorInitial}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            {/* Status badges */}
            {(isPinned || isClosed) && (
              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                {isPinned && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
                    <Pin className="h-2.5 w-2.5" />
                    Pinned
                  </span>
                )}
                {isClosed && (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    <Lock className="h-2.5 w-2.5" />
                    Closed
                  </span>
                )}
              </div>
            )}

           <Link
  to={`/community/forums/discussions/${discussion._id}`}
  className="block"
>
  <h3
    className={`font-black leading-snug text-slate-900 transition-colors dark:text-white sm:text-[15px] ${theme.titleHover}`}
  >
    {discussion.title}
  </h3>
</Link>

            {/* Content preview */}
            {discussion.content && (
              <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                {discussion.content}
              </p>
            )}

            {/* Route badge */}
            {hasRoute && (
              <div
                className={`mt-2.5 inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 ${theme.routeBadge}`}
              >
                <MapPin className="h-3 w-3" />
                <span className="text-[10px] font-black">
                  {discussion.route.source} → {discussion.route.destination}
                </span>
              </div>
            )}

            {/* Tags */}
            {hasTags && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {discussion.tags.slice(0, 4).map((tag, tagIndex) => (
                  <span
                    key={`${tag}-${tagIndex}`}
                    className={`text-[10px] font-black ${TAG_COLORS[tagIndex % TAG_COLORS.length]}`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              {/* Author + time */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 font-bold text-slate-400 dark:text-slate-500">
                  {discussion.author?.isVerified && (
                    <ShieldCheck className={`h-3 w-3 ${theme.accentText}`} />
                  )}
                  <span className="font-black text-slate-700 dark:text-slate-300">
                    {authorName}
                  </span>
                </span>

                <span className="text-slate-300 dark:text-slate-700">·</span>

                <span className="font-bold text-slate-400 dark:text-slate-500">
                  {formatTimeAgo(discussion.createdAt)}
                </span>
              </div>

              {/* Stats + Reply button */}
              <div className="flex items-center gap-2">
                {/* Reply count */}
                <span
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-black ${theme.countBg}`}
                >
                  <MessageCircle className="h-3 w-3" />
                  {replyCount}
                </span>

                {/* Views */}
                <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Eye className="h-3 w-3" />
                  {viewCount}
                </span>

                {/* Reply button */}
                {!isClosed && (
                  <button
                    type="button"
                    onClick={() => setShowReplies((prev) => !prev)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-black transition-all duration-200 active:scale-95 ${theme.expandBtn}`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {showReplies ? "Hide Replies" : "Reply"}
                    {showReplies ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply panel — slides open */}
      {showReplies && !isClosed && (
        <div
          className={`border-t ${theme.softBorder} animate-in slide-in-from-top-2 duration-200`}
        >
          <ReplyCard
            discussionId={discussion._id}
            replies={discussion.replies || []}
            theme={theme}
            bestAnswerId={discussion.bestAnswer}
            canMarkBest={canMarkBest}
            onMarkBest={onMarkBest}
          />
        </div>
      )}

      {/* Closed notice */}
      {isClosed && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/50">
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            This discussion is closed for new replies
          </p>
        </div>
      )}

      {/* Hover glow */}
      <div
        className={`pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.07]`}
      />
    </div>
  );
};

export default DiscussionCard;