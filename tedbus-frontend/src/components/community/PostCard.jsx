import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bus,
  Heart,
  MessageCircle,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostImages from "./PostImages";
import useLikes from "../../hooks/useLikes";
import SavePostButton from "./SavePostButton";
import SharePost from "./SharePost";
import ReportPost from "./ReportPost";

/* ─── Post type themes ─── */
const POST_TYPE_THEMES = {
  story: {
    rail: "bg-violet-500",
    chip: "bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-violet-500/20",
    emoji: "✈️",
  },
  tip: {
    rail: "bg-amber-500",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20",
    emoji: "💡",
  },
  photo: {
    rail: "bg-cyan-500",
    chip: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-cyan-500/20",
    emoji: "📷",
  },
  discussion: {
    rail: "bg-emerald-500",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20",
    emoji: "💬",
  },
  review: {
    rail: "bg-orange-500",
    chip: "bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-orange-500/20",
    emoji: "⭐",
  },
  question: {
    rail: "bg-blue-500",
    chip: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20",
    emoji: "❓",
  },
  announcement: {
    rail: "bg-red-500",
    chip: "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20",
    emoji: "📢",
  },
  guide: {
    rail: "bg-indigo-500",
    chip: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-indigo-500/20",
    emoji: "🗺️",
  },
};

const DEFAULT_THEME = {
  rail: "bg-slate-400",
  chip: "bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20",
  emoji: "📝",
};

const getTypeTheme = (postType) => {
  const key = String(postType || "").toLowerCase().trim();
  return POST_TYPE_THEMES[key] || DEFAULT_THEME;
};

const TAG_COLORS = [
  "text-red-500 dark:text-red-400",
  "text-violet-500 dark:text-violet-400",
  "text-emerald-500 dark:text-emerald-400",
  "text-amber-500 dark:text-amber-400",
  "text-cyan-500 dark:text-cyan-400",
  "text-pink-500 dark:text-pink-400",
];

const formatTimeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

const formatCount = (num) => {
  if (!num) return 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num;
};

// const PostCard = ({ post }) => {
//   const { isLiked, likeCount, handleToggleLike } = useLikes(
//     post.isLikedByMe,
//     post.likeCount
//   );

//   const [showMenu, setShowMenu] = useState(false);

//const theme = getTypeTheme(post.postType);

//   const authorName = post.author?.name || "Anonymous";
//   const authorInitial = authorName.charAt(0).toUpperCase();

//   const hasRoute = post.route?.source && post.route?.destination;
//   const hasImages = Array.isArray(post.images) && post.images.length > 0;
//   const hasTags = Array.isArray(post.tags) && post.tags.length > 0;

const PostCard = ({ post }) => {
  const { isLiked, likeCount, handleToggleLike } = useLikes(
    post._id,           // postId pass kar rahe hain
    null,               // commentId null
    post.likeCount || 0
  );

  const [showMenu, setShowMenu] = useState(false);
  const theme = getTypeTheme(post.postType);

  const authorName = post.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const hasRoute = post.route?.source && post.route?.destination;
  const hasImages = Array.isArray(post.images) && post.images.length > 0;
  const hasTags = Array.isArray(post.tags) && post.tags.length > 0;

  return (
    <article className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      {/* ═══════════ 1. HERO IMAGE — full width top ═══════════ */}
      {hasImages && (
        <Link
          to={`/community/post/${post._id}`}
          className="relative block overflow-hidden"
        >
          <PostImages images={post.images} />

          {/* Gradient overlay bottom for text readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Type chip — floating over image */}
          {post.postType && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-white/90 ring-1 ring-white/20 backdrop-blur-md">
              {theme.emoji} {post.postType}
            </span>
          )}

          {/* Image count badge */}
          {post.images.length > 1 && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-black text-white/90 backdrop-blur-md">
              📷 {post.images.length}
            </span>
          )}
        </Link>
      )}

      {/* Left ticket rail */}
      <div
        className={`absolute bottom-0 left-0 w-1 opacity-80 transition-all duration-300 group-hover:w-1.5 group-hover:opacity-100 ${theme.rail} ${hasImages ? "top-0" : "top-0"}`}
      />

      {/* ═══════════ 2. AUTHOR ROW ═══════════ */}
      <div className="flex items-center justify-between gap-2 px-4 pt-3 sm:px-5">
        <Link
          to={`/community/profile/${post.author?._id}`}
          className="group/author flex min-w-0 items-center gap-2.5"
        >
          {post.author?.profileImage ? (
            <img
              src={post.author.profileImage}
              alt={authorName}
              loading="lazy"
              className="h-8 w-8 shrink-0 rounded-xl object-cover ring-2 ring-slate-100 transition group-hover/author:ring-red-200 dark:ring-slate-800 dark:group-hover/author:ring-red-900/50"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-xs font-black text-white ring-2 ring-slate-100 dark:ring-slate-800">
              {authorInitial}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-[13px] font-black text-slate-900 transition-colors group-hover/author:text-red-600 dark:text-white dark:group-hover/author:text-red-400">
                {authorName}
              </h3>
              {post.author?.isVerified && (
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-blue-500/15 text-blue-500" />
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          {/* Type chip — only show here if NO image */}
          {!hasImages && post.postType && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ring-1 ${theme.chip}`}
            >
              {theme.emoji} {post.postType}
            </span>
          )}

          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-label="Post options"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="p-1.5">
                    <div onClick={() => setShowMenu(false)}>
                      <SavePostButton
                        postId={post._id}
                        initialSaved={post.isSaved}
                        variant="menu"
                      />
                    </div>
                    <div onClick={() => setShowMenu(false)}>
                      <ReportPost
                        targetType="Post"
                        targetId={post._id}
                        variant="menu"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ 3. TITLE + CONTENT ═══════════ */}
      <div className="px-4 pt-2 sm:px-5">
        <Link to={`/community/post/${post._id}`} className="group/title block">
          <h2 className="text-sm font-black leading-snug text-slate-900 transition-colors group-hover/title:text-red-600 dark:text-white dark:group-hover/title:text-red-400 sm:text-[15px]">
            {post.title}
          </h2>
        </Link>

        {post.content && (
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-[13px]">
            {post.content}
          </p>
        )}
      </div>

      {/* ═══════════ 4. ROUTE STRIP — boarding pass style ═══════════ */}
      {hasRoute && (
        <div className="mx-4 mt-2.5 sm:mx-5">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
            <div className="min-w-0 text-left">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                From
              </p>
              <p className="truncate text-xs font-black text-slate-800 dark:text-slate-200">
                {post.route.source}
              </p>
            </div>

            <div className="relative flex flex-1 items-center px-1">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
              <span className="flex-1 border-t-2 border-dotted border-slate-300 dark:border-slate-600" />
              <span className="mx-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-sm shadow-red-500/30 transition-transform duration-300 group-hover:scale-110">
                <Bus className="h-3 w-3 text-white" />
              </span>
              <span className="flex-1 border-t-2 border-dotted border-slate-300 dark:border-slate-600" />
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            </div>

            <div className="min-w-0 text-right">
              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                To
              </p>
              <p className="truncate text-xs font-black text-slate-800 dark:text-slate-200">
                {post.route.destination}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ 5. TAGS ═══════════ */}
      {hasTags && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-4 sm:px-5">
          {post.tags.slice(0, 4).map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={`cursor-pointer text-[11px] font-black transition-opacity hover:opacity-70 ${TAG_COLORS[index % TAG_COLORS.length]}`}
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 4 && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              +{post.tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ═══════════ 6. PERFORATED TEAR LINE ═══════════ */}
      <div className="relative mt-3 flex items-center">
        <span className="absolute -left-2 h-4 w-4 rounded-full border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
        <span className="mx-4 w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
        <span className="absolute -right-2 h-4 w-4 rounded-full border border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
      </div>

      {/* ═══════════ 7. TICKET STUB — Actions ═══════════ */}
      <div className="flex items-center justify-between px-3 py-1.5 sm:px-4">
        <div className="flex items-center">
          {/* Like */}
          <button
            type="button"
            onClick={() => handleToggleLike(post._id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black transition-all duration-200 active:scale-90 sm:px-3 ${
              isLiked
                ? "text-red-600 dark:text-red-400"
                : "text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            }`}
          >
            <Heart
              className={`h-4 w-4 transition-transform duration-300 ${
                isLiked ? "scale-110 fill-current" : ""
              }`}
            />
            {likeCount > 0 && <span>{formatCount(likeCount)}</span>}
          </button>

          {/* Comment */}
          <Link
            to={`/community/post/${post._id}`}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-black text-slate-500 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-400 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 sm:px-3"
          >
            <MessageCircle className="h-4 w-4" />
            {post.commentCount > 0 && (
              <span>{formatCount(post.commentCount)}</span>
            )}
          </Link>

          {/* Share */}
          <SharePost postId={post._id} title={post.title} />
        </div>

        <div className="flex items-center gap-1">
          <SavePostButton postId={post._id} initialSaved={post.isSaved} />

          <Link
            to={`/community/post/${post._id}`}
            aria-label="Read full post"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800 dark:hover:text-red-400"
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;