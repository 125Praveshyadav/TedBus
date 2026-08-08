import { useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Edit3,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import StarRating from "./StarRating";
import reviewService from "../../services/reviewService";

const MIN_CHARS = 20;
const MAX_CHARS = 1000;

const RATING_LABELS = [
  "",
  "Poor",
  "Fair",
  "Good",
  "Very Good",
  "Excellent",
];

const RATING_THEMES = {
  0: {
    gradient: "from-slate-400 to-slate-500",
    shadow: "shadow-slate-500/20",
    text: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/60",
    border: "border-slate-200 dark:border-slate-700",
  },
  1: {
    gradient: "from-rose-600 to-pink-500",
    shadow: "shadow-rose-500/20",
    text: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-100 dark:border-rose-900/50",
  },
  2: {
    gradient: "from-orange-600 to-amber-500",
    shadow: "shadow-orange-500/20",
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-100 dark:border-orange-900/50",
  },
  3: {
    gradient: "from-amber-500 to-yellow-500",
    shadow: "shadow-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-100 dark:border-amber-900/50",
  },
  4: {
    gradient: "from-cyan-600 to-blue-500",
    shadow: "shadow-cyan-500/20",
    text: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-100 dark:border-cyan-900/50",
  },
  5: {
    gradient: "from-emerald-600 to-teal-500",
    shadow: "shadow-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900/50",
  },
};

const getRatingTheme = (rating) => {
  return RATING_THEMES[rating] || RATING_THEMES[0];
};

const ReviewForm = ({
  bookingId,
  busId,
  existingReview = null,
  onSuccess,
  onCancel,
}) => {
  const isEdit = Boolean(existingReview);

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const theme = getRatingTheme(rating);
  const trimmedComment = comment.trim();
  const charsUsed = comment.length;
  const charsNeeded = Math.max(MIN_CHARS - trimmedComment.length, 0);
  const isValid = rating > 0 && trimmedComment.length >= MIN_CHARS;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating) {
      return toast.error("Please select a rating");
    }

    if (trimmedComment.length < MIN_CHARS) {
      return toast.error(
        `Review must be at least ${MIN_CHARS} characters`,
      );
    }

    setLoading(true);

    try {
      let result;

      if (isEdit) {
        result = await reviewService.editReview(existingReview._id, {
          rating: Number(rating),
          comment: trimmedComment,
        });
      } else {
        result = await reviewService.createReview({
          bookingId,
          busId,
          rating: Number(rating),
          comment: trimmedComment,
        });
      }

      toast.success(isEdit ? "Review updated!" : "Review submitted!");
      onSuccess?.(result?.review || result);
    } catch (err) {
      const errorMessage =
        err?.data?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit review";

      console.log("FULL REVIEW ERROR:", err);
      console.log("ERROR MESSAGE:", errorMessage);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-md ${theme.shadow}`}
        >
          {isEdit ? (
            <Edit3 className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4 fill-white" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
            {isEdit ? "Update Your Review" : "Write a Review"}
          </h3>
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Share your genuine travel experience
          </p>
        </div>
      </div>

      {/* Rating card */}
      <div
        className={`rounded-2xl border p-4 transition-all duration-300 ${theme.border} ${theme.bg}`}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <Star className="h-3.5 w-3.5 text-amber-500" />
            {isEdit ? "Update rating" : "Your rating"}
          </p>

          {rating > 0 && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${theme.gradient} px-2.5 py-1 text-[10px] font-black text-white shadow-sm ${theme.shadow}`}
            >
              <Sparkles className="h-3 w-3" />
              {RATING_LABELS[rating]}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <StarRating
            rating={rating}
            onRate={setRating}
            size="lg"
          />

          {rating > 0 && (
            <div
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-sm font-black text-white shadow-md ${theme.shadow}`}
            >
              {rating}
            </div>
          )}
        </div>

        {rating === 0 && (
          <p className="mt-3 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            Tap a star to rate your journey
          </p>
        )}
      </div>

      {/* Review text */}
      <div>
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {isEdit ? (
              <Edit3 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            ) : (
              <Send className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            )}
            {isEdit ? "Update review" : "Your review"}
          </span>

          <span
            className={`text-[10px] font-bold ${
              charsNeeded > 0
                ? "text-rose-500 dark:text-rose-400"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {charsNeeded > 0
              ? `${charsNeeded} more needed`
              : `${charsUsed}/${MAX_CHARS}`}
          </span>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={MAX_CHARS}
          placeholder="Describe comfort, timing, cleanliness, staff behavior..."
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        {/* Progress */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              trimmedComment.length >= MIN_CHARS
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : trimmedComment.length > 0
                  ? "bg-gradient-to-r from-amber-500 to-orange-400"
                  : "bg-slate-300 dark:bg-slate-700"
            }`}
            style={{
              width: `${Math.min((charsUsed / MIN_CHARS) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Edit note */}
      {isEdit && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>

          <div>
            <p className="text-[11px] font-black text-amber-800 dark:text-amber-300">
              Edit window
            </p>
            <p className="mt-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Reviews can only be edited within 24 hours of submission.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        {isEdit && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !isValid}
          className={`group flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white transition-all duration-200 ${
            loading || !isValid
              ? "cursor-not-allowed bg-slate-300 dark:bg-slate-700"
              : `bg-gradient-to-r ${theme.gradient} shadow-lg ${theme.shadow} hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]`
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Submitting..."}
            </>
          ) : (
            <>
              {isEdit ? (
                <Edit3 className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isEdit ? "Update Review" : "Submit Review"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {/* Footer note */}
      <div className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
        <ShieldCheck className="h-3 w-3 text-emerald-500" />
        Your review helps fellow travellers make better decisions
      </div>
    </form>
  );
};

export default ReviewForm;