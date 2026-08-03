import { useState } from "react";
import { ThumbsUp, Flag, Shield, Edit3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import reviewService from "../../services/reviewService";

const TRUSTED_THRESHOLD = 5; // 5+ upvotes = trusted reviewer

const ReviewCard = ({ review, currentUserId, onEdit }) => {
  const [upvotes, setUpvotes] = useState(review.upvotes || 0);
  const [isUpvoted, setIsUpvoted] = useState(
    review.upvotedBy?.map((u) => u.toString()).includes(currentUserId)
  );
  const [reported, setReported] = useState(false);

  const isOwner = review.user?._id?.toString() === currentUserId;
  const isTrusted = upvotes >= TRUSTED_THRESHOLD;
  const hoursSince = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
  const canEdit = isOwner && hoursSince <= 24;

  const handleUpvote = async () => {
    if (!currentUserId) return toast.error("Please login to upvote");
    if (isOwner) return toast.info("You cannot upvote your own review");

    try {
      const data = await reviewService.upvoteReview(review._id);
      setUpvotes(data.upvotes);
      setIsUpvoted(data.isUpvoted);
    } catch {
      toast.error("Failed to upvote");
    }
  };

  const handleReport = async () => {
    if (!currentUserId) return toast.error("Please login to report");
    if (isOwner) return toast.info("You cannot report your own review");
    if (reported) return toast.info("Already reported");

    try {
      await reviewService.reportReview(review._id);
      setReported(true);
      toast.success("Review reported. Thank you!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src={
              review.user?.profileImage ||
              `https://ui-avatars.com/api/?name=${review.user?.name}&background=fee2e2&color=dc2626`
            }
            alt={review.user?.name}
            className="w-10 h-10 rounded-xl object-cover shrink-0"
          />

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                {review.user?.name || "Traveler"}
              </p>

              {isTrusted && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] font-black border border-green-200 dark:border-green-800">
                  <Shield size={10} /> Trusted Reviewer
                </span>
              )}

              {isOwner && (
                <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black border border-red-200 dark:border-red-900/30">
                  Your Review
                </span>
              )}

              {review.isEdited && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">
                  edited
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Stars */}
        <StarRating rating={review.rating} size="sm" readonly />
      </div>

      {/* Comment */}
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleUpvote}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 ${
            isUpvoted
              ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
          }`}
        >
          <ThumbsUp size={13} fill={isUpvoted ? "currentColor" : "none"} />
          Helpful {upvotes > 0 && `(${upvotes})`}
        </button>

        {canEdit && (
          <button
            onClick={() => onEdit && onEdit(review)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-all active:scale-95"
          >
            <Edit3 size={13} /> Edit
          </button>
        )}

        <button
          onClick={handleReport}
          disabled={reported || isOwner}
          className={`ml-auto flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl transition-all active:scale-95 disabled:opacity-40 ${
            reported
              ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
              : "bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-orange-600"
          }`}
        >
          <Flag size={13} />
          {reported ? "Reported" : "Report"}
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;