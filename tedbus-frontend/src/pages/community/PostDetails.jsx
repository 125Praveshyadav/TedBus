import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Heart,
  MessageCircle,
  ShieldCheck,
  Bus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import usePosts from "../../hooks/usePosts";
import useLikes from "../../hooks/useLikes";
import PostImages from "../../components/community/PostImages";
import CommentSection from "../../components/community/CommentSection";
import SavePostButton from "../../components/community/SavePostButton";
import SharePost from "../../components/community/SharePost";
import ReportPost from "../../components/community/ReportPost";
import { useAuth } from "../../components/context/AuthContext";

const formatCount = (num) => {
  if (!num) return 0;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num;
};

const formatTimeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};

const PostDetails = () => {
  const { id } = useParams();
  const { singlePost, loading, fetchPostById } = usePosts();
  const { user } = useAuth();
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    fetchPostById(id);
  }, [id, fetchPostById]);

  // 🔑 FIX: Naya signature — useLikes(postId, commentId, initialCount)
  const { isLiked, likeCount, handleToggleLike } = useLikes(
    id,                          // postId (URL se)
    null,                        // commentId null
    singlePost?.likeCount || 0   // initialCount
  );

  if (loading || !singlePost) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-red-600" />
      </div>
    );
  }

  const authorName = singlePost.author?.name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const hasRoute = singlePost.route?.source && singlePost.route?.destination;
  const isOwner = user && user._id === singlePost.author?._id;
  const isLongContent = (singlePost.content || "").length > 260;

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-5 dark:bg-slate-950 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back */}
        <Link
          to="/community"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-black text-slate-500 transition-colors hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
        >
          <ArrowLeft size={16} />
          Back to Community
        </Link>

        {/* ═══ Ticket Card ═══ */}
        <article className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* Left accent rail */}
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-600 to-orange-500" />

          {/* Image */}
          {singlePost.images?.length > 0 && (
            <div className="relative overflow-hidden">
              <PostImages images={singlePost.images} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}

          <div className="px-4 pb-4 pt-3.5 sm:px-5 sm:pt-4">
            {/* Author row */}
            <div className="mb-3 flex items-center justify-between gap-2">
              <Link
                to={`/community/profile/${singlePost.author?._id}`}
                className="group/author flex min-w-0 items-center gap-2.5"
              >
                {singlePost.author?.profileImage ? (
                  <img
                    src={singlePost.author.profileImage}
                    alt={authorName}
                    className="h-9 w-9 shrink-0 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-xs font-black text-white ring-2 ring-slate-100 dark:ring-slate-800">
                    {authorInitial}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="truncate text-[13px] font-black text-slate-900 group-hover/author:text-red-600 dark:text-white dark:group-hover/author:text-red-400">
                      {authorName}
                    </h3>
                    {singlePost.author?.isVerified && (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 fill-blue-500/15 text-blue-500" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {formatTimeAgo(singlePost.createdAt)}
                  </p>
                </div>
              </Link>

              {isOwner && (
                <Link
                  to={`/community/edit-post/${singlePost._id}`}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-black text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <Edit3 size={13} />
                  Edit
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-2 text-lg font-black leading-snug text-slate-900 dark:text-white sm:text-xl">
              {singlePost.title}
            </h1>

            {/* Route strip */}
            {hasRoute && (
              <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/50">
                <div className="min-w-0 text-left">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    From
                  </p>
                  <p className="truncate text-xs font-black text-slate-800 dark:text-slate-200">
                    {singlePost.route.source}
                  </p>
                </div>
                <div className="relative flex flex-1 items-center px-1">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  <span className="flex-1 border-t-2 border-dotted border-slate-300 dark:border-slate-600" />
                  <span className="mx-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 shadow-sm shadow-red-500/30">
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
                    {singlePost.route.destination}
                  </p>
                </div>
              </div>
            )}

            {/* Content */}
            <p
              className={`whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300 ${
                isLongContent && !showFullContent ? "line-clamp-4" : ""
              }`}
            >
              {singlePost.content}
            </p>
            {isLongContent && (
              <button
                type="button"
                onClick={() => setShowFullContent((v) => !v)}
                className="mt-1 text-xs font-black text-red-600 hover:underline dark:text-red-400"
              >
                {showFullContent ? "Show less" : "Read more"}
              </button>
            )}

            {/* Tags */}
            {singlePost.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {singlePost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Perforated tear line */}
            <div className="relative my-4 flex items-center">
              <span className="absolute -left-6 h-4 w-4 rounded-full bg-slate-50 dark:bg-slate-950" />
              <span className="w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
              <span className="absolute -right-6 h-4 w-4 rounded-full bg-slate-50 dark:bg-slate-950" />
            </div>

            {/* ═══ Unified action row ═══ */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggleLike()}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition-all active:scale-90 ${
                    isLiked
                      ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                      : "text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  }`}
                >
                  <Heart
                    size={16}
                    className={isLiked ? "scale-110 fill-current" : ""}
                  />
                  {likeCount > 0 && <span>{formatCount(likeCount)}</span>}
                </button>

                <div className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black text-slate-500 dark:text-slate-400">
                  <MessageCircle size={16} />
                  {singlePost.commentCount > 0 && (
                    <span>{formatCount(singlePost.commentCount)}</span>
                  )}
                </div>

                <SharePost postId={singlePost._id} title={singlePost.title} />
              </div>

              <div className="flex items-center gap-1">
                <SavePostButton
                  postId={singlePost._id}
                  initialSaved={singlePost.isSaved}
                />
                <ReportPost targetType="Post" targetId={singlePost._id} />
              </div>
            </div>
          </div>
        </article>

        {/* Comments */}
        <div className="mt-4">
          <CommentSection postId={id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;