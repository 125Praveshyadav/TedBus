import { useState } from "react";
import {
  Edit3,
  Flag,
  Shield,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";

import StarRating from "./StarRating";
import reviewService from "../../services/reviewService";

const TRUSTED_THRESHOLD = 5;

const getRatingTheme = (rating) => {
  if (rating >= 4) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/50",
      strip: "from-emerald-500 to-teal-400",
    };
  }
  if (rating === 3) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/50",
      strip: "from-amber-500 to-orange-400",
    };
  }
  return {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-100 dark:border-rose-900/50",
    strip: "from-rose-500 to-red-400",
  };
};

const formatTimeAgo = (date) => {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch {
    return "some time ago";
  }
};

const ReviewCard = ({
  review,
  currentUserId,
  onEdit,
}) => {
  const [upvotes, setUpvotes] = useState(
    review.upvotes || 0,
  );

  const [isUpvoted, setIsUpvoted] = useState(
    review.upvotedBy
      ?.map((user) => user.toString())
      .includes(currentUserId),
  );

  const [reported, setReported] = useState(false);

  const isOwner =
    review.user?._id?.toString() === currentUserId;

  const isTrusted = upvotes >= TRUSTED_THRESHOLD;

  const hoursSince =
    (Date.now() - new Date(review.createdAt)) /
    (1000 * 60 * 60);

  const canEdit = isOwner && hoursSince <= 24;

  const ratingTheme = getRatingTheme(review.rating);
  const authorName = review.user?.name || "Traveller";
  const authorInitial = authorName
    .charAt(0)
    .toUpperCase();

  const handleUpvote = async () => {
    if (!currentUserId) {
      return toast.error("Please login to upvote");
    }

    if (isOwner) {
      return toast.info(
        "You cannot upvote your own review",
      );
    }

    try {
      const data = await reviewService.upvoteReview(
        review._id,
      );

      setUpvotes(data.upvotes);
      setIsUpvoted(data.isUpvoted);
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const handleReport = async () => {
    if (!currentUserId) {
      return toast.error("Please login to report");
    }

    if (isOwner) {
      return toast.info(
        "You cannot report your own review",
      );
    }

    if (reported) {
      return toast.info("Already reported");
    }

    try {
      await reviewService.reportReview(review._id);
      setReported(true);
      toast.success("Review reported. Thank you!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to report",
      );
    }
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/20">
      <div
        className={`h-0.5 w-full bg-gradient-to-r ${ratingTheme.strip} opacity-70 transition-opacity group-hover:opacity-100`}
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0">
              {review.user?.profileImage ? (
                <img
                  src={review.user.profileImage}
                  alt={authorName}
                  className="h-10 w-10 rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-black text-white shadow-md">
                  {authorInitial}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  {authorName}
                </p>

                {isTrusted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <Shield className="h-2.5 w-2.5" />
                    Trusted
                  </span>
                )}

                {isOwner && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[9px] font-black text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                    <Sparkles className="h-2.5 w-2.5" />
                    Your Review
                  </span>
                )}

                {review.isEdited && (
                  <span className="text-[9px] font-bold italic text-slate-400 dark:text-slate-500">
                    edited
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {formatTimeAgo(review.createdAt)}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <StarRating
              rating={review.rating}
              size="sm"
              readonly
            />

            <div
              className={`mt-1 rounded-lg border px-2 py-0.5 text-center text-[9px] font-black ${ratingTheme.bg} ${ratingTheme.border} ${
                review.rating >= 4
                  ? "text-emerald-700 dark:text-emerald-400"
                  : review.rating === 3
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {review.rating >= 4
                ? review.rating === 5
                  ? "Excellent"
                  : "Very Good"
                : review.rating === 3
                  ? "Good"
                  : review.rating === 2
                    ? "Fair"
                    : "Poor"}
            </div>
          </div>
        </div>

        {review.title && (
          <h4 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
            {review.title}
          </h4>
        )}

        <p className="mt-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">
          {review.comment}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3.5 dark:border-slate-800">
          <button
            type="button"
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-black transition-all active:scale-95 ${
              isUpvoted
                ? "border border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400"
                : "border border-slate-200 bg-slate-50 text-slate-500 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-teal-900 dark:hover:bg-teal-950/30 dark:hover:text-teal-400"
            }`}
          >
            <ThumbsUp
              className={`h-3.5 w-3.5 ${isUpvoted ? "fill-current" : ""}`}
            />
            Helpful
            {upvotes > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                  isUpvoted
                    ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {upvotes}
              </span>
            )}
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit?.(review)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black text-slate-500 transition-all hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </button>
          )}

          <button
            type="button"
            onClick={handleReport}
            disabled={reported || isOwner}
            className={`ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-black transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
              reported
                ? "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400"
                : "border border-slate-200 bg-slate-50 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            }`}
          >
            <Flag className="h-3.5 w-3.5" />
            {reported ? "Reported" : "Report"}
          </button>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${ratingTheme.strip} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-[0.07]`}
      />
    </article>
  );
};

export default ReviewCard;