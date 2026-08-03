import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostImages from "./PostImages";
import useLikes from "../../hooks/useLikes";
import SavePostButton from "./SavePostButton";
import SharePost from "./SharePost";
import ReportPost from "./ReportPost";

/*
 * Post type → unique premium color themes
 * Consistent with EditPost POST_TYPES colors
 */
const POST_TYPE_THEMES = {
  story: {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/50",
    dot: "bg-violet-500",
    emoji: "✈️",
  },
  tip: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
    dot: "bg-amber-500",
    emoji: "💡",
  },
  photo: {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-700 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900/50",
    dot: "bg-cyan-500",
    emoji: "📷",
  },
  discussion: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
    dot: "bg-emerald-500",
    emoji: "💬",
  },
  review: {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
    dot: "bg-amber-500",
    emoji: "⭐",
  },
  question: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-900/50",
    dot: "bg-blue-500",
    emoji: "❓",
  },
  announcement: {
    bg: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-100 dark:border-red-900/50",
    dot: "bg-red-500",
    emoji: "📢",
  },
  guide: {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/50",
    dot: "bg-indigo-500",
    emoji: "🗺️",
  },
};

const DEFAULT_THEME = {
  bg: "bg-slate-100 dark:bg-slate-800/60",
  text: "text-slate-600 dark:text-slate-400",
  border: "border-slate-200 dark:border-slate-700",
  dot: "bg-slate-500",
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
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return "";
  }
};

const PostCard = ({ post }) => {
  const { isLiked, likeCount, handleToggleLike } =
    useLikes(post.isLikedByMe, post.likeCount);

  const [showMenu, setShowMenu] = useState(false);

  const typeTheme = getTypeTheme(post.postType);

  const authorName = post.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();

  const hasRoute =
    post.route?.source && post.route?.destination;

  const hasImages =
    Array.isArray(post.images) && post.images.length > 0;

  const hasTags =
    Array.isArray(post.tags) && post.tags.length > 0;

  return (
    <article className="group relative w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-black/20">
      {/* Themed top accent bar matching EditPost section headers */}
      <div
        className={`h-1 w-full transition-opacity duration-500 ${typeTheme.bg.replace("bg-", "bg-gradient-to-r from-").split(" ")[0]}`}
        style={{}}
      >
        <div
          className={`h-full w-full opacity-60 ${typeTheme.bg}`}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link
          to={`/community/profile/${post.author?._id}`}
          className="group/author flex min-w-0 items-center gap-3"
        >
          {/* Avatar */}
          <div className="shrink-0">
            <div className="rounded-full bg-gradient-to-tr from-red-500 via-orange-500 to-amber-400 p-[2px]">
              <div className="rounded-full bg-white p-[2px] dark:bg-slate-900">
                {post.author?.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    alt={authorName}
                    className="h-9 w-9 rounded-full object-cover transition-transform duration-500 group-hover/author:scale-105"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-sm font-black text-white">
                    {authorInitial}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-black text-slate-900 transition-colors group-hover/author:text-red-600 dark:text-white dark:group-hover/author:text-red-400">
                {authorName}
              </h3>

              {post.author?.isVerified && (
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-blue-500" />
              )}
            </div>

            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          {/* Post type badge — consistent with EditPost pill style */}
          {post.postType && (
            <span
              className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${typeTheme.bg} ${typeTheme.text} ${typeTheme.border}`}
            >
              <span>{typeTheme.emoji}</span>
              {post.postType}
            </span>
          )}

          {/* Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowMenu((prev) => !prev)
              }
              className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />

                <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                  <div className="p-1.5">
                    <div
                      onClick={() => setShowMenu(false)}
                    >
                      <SavePostButton
                        postId={post._id}
                        initialSaved={post.isSaved}
                        variant="menu"
                      />
                    </div>

                    <div
                      onClick={() => setShowMenu(false)}
                    >
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

      {/* Content */}
      <div className="px-4 sm:px-5">
        <Link
          to={`/community/post/${post._id}`}
          className="group/title block"
        >
          <h2 className="text-sm font-black leading-snug text-slate-900 transition-colors group-hover/title:text-red-600 dark:text-white dark:group-hover/title:text-red-400 sm:text-base">
            {post.title}
          </h2>
        </Link>

        {/* Route badge — consistent with EditPost route section */}
        {hasRoute && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-2.5 py-1 dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />

            <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">
              {post.route.source} →{" "}
              {post.route.destination}
            </span>
          </div>
        )}
      </div>

      {/* Images */}
      {hasImages && (
        <div className="mt-3 px-4 sm:px-5">
          <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
            <PostImages images={post.images} />
          </div>
        </div>
      )}

      {/* Text content */}
      <div className="px-4 pt-3 sm:px-5">
        {post.content && (
          <p className="line-clamp-3 text-xs font-medium leading-5 text-slate-600 dark:text-slate-400 sm:text-sm sm:leading-6">
            {post.content}
          </p>
        )}

        {/* Tags — consistent with EditPost tag preview */}
        {hasTags && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className={`cursor-pointer text-[11px] font-black transition-opacity hover:opacity-70 ${TAG_COLORS[index % TAG_COLORS.length]}`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Like/comment count bar */}
      {(likeCount > 0 || post.commentCount > 0) && (
        <div className="mx-4 mt-3 flex items-center justify-between border-b border-slate-100 pb-2 text-[10px] font-bold text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:mx-5">
          {likeCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500">
                <Heart className="h-2.5 w-2.5 fill-white text-white" />
              </span>
              {likeCount}{" "}
              {likeCount === 1 ? "like" : "likes"}
            </span>
          )}

          {post.commentCount > 0 && (
            <span>
              {post.commentCount}{" "}
              {post.commentCount === 1
                ? "comment"
                : "comments"}
            </span>
          )}
        </div>
      )}

      {/* Action bar — consistent with EditPost bottom action bar */}
      <div className="flex items-center px-2 py-1.5 sm:px-3">
        {/* Like */}
        <button
          type="button"
          onClick={() => handleToggleLike(post._id)}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black transition-all duration-200 active:scale-90 ${
            isLiked
              ? "text-red-600 dark:text-red-400"
              : "text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          }`}
        >
          <Heart
            className={`h-[16px] w-[16px] transition-transform duration-300 ${
              isLiked ? "scale-110 fill-current" : ""
            }`}
          />
          <span className="hidden min-[380px]:inline">
            {isLiked ? "Liked" : "Like"}
          </span>
        </button>

        {/* Comment */}
        <Link
          to={`/community/post/${post._id}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-black text-slate-500 transition-all hover:bg-violet-50 hover:text-violet-600 dark:text-slate-400 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
        >
          <MessageCircle className="h-[16px] w-[16px]" />
          <span className="hidden min-[380px]:inline">
            Comment
          </span>
        </Link>

        {/* Share */}
        <div className="flex flex-1 items-center justify-center">
          <SharePost
            postId={post._id}
            title={post.title}
          />
        </div>

        {/* Save */}
        <div className="flex items-center justify-center">
          <SavePostButton
            postId={post._id}
            initialSaved={post.isSaved}
          />
        </div>
      </div>
    </article>
  );
};

export default PostCard;