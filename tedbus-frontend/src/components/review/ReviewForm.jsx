import { useState } from "react";
import { Loader2, Send, Edit3 } from "lucide-react";
import { toast } from "react-toastify";
import StarRating from "./StarRating";
import reviewService from "../../services/reviewService";

const ReviewForm = ({ bookingId, busId, existingReview = null, onSuccess }) => {
  const isEdit = !!existingReview;

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const MIN_CHARS = 20;
  const charsLeft = MIN_CHARS - comment.length;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) return toast.error("Please select a rating");
    if (comment.trim().length < MIN_CHARS) {
      return toast.error(`Review must be at least ${MIN_CHARS} characters`);
    }

    setLoading(true);
    try {
      let result;
      if (isEdit) {
        result = await reviewService.editReview(existingReview._id, {
          rating,
          comment,
        });
      } else {
        result = await reviewService.createReview({
          bookingId,
          rating,
          comment,
        });
      }

      toast.success(isEdit ? "Review updated!" : "Review submitted!");
      if (onSuccess) onSuccess(result.review);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
    >
      <h3 className="text-base font-black text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
        {isEdit ? <Edit3 size={18} /> : <Send size={18} />}
        {isEdit ? "Edit Your Review" : "Write a Review"}
      </h3>

      {/* Stars */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Your Rating
        </p>
        <StarRating rating={rating} onRate={setRating} size="lg" />
        {rating > 0 && (
          <p className="mt-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Your Review
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Share your experience about this journey... (min 20 characters)"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none transition focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400 resize-none"
        />
        <div className="flex justify-between mt-1">
          <p className={`text-xs font-medium ${charsLeft > 0 ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`}>
            {charsLeft > 0 ? `${charsLeft} more chars needed` : `${comment.length}/1000`}
          </p>
        </div>
      </div>

      {isEdit && (
        <p className="mb-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400">
          ⚠️ Reviews can only be edited within 24 hours of submission
        </p>
      )}

      <button
        type="submit"
        disabled={loading || rating === 0 || comment.trim().length < MIN_CHARS}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {loading ? "Submitting..." : isEdit ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;