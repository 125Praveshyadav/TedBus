import { useState } from "react";
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  Star,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import reviewService from "../../services/reviewService";

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const bus = booking?.bus || booking?.busDetails || {};
  const busId = bus?._id || bus?.id || booking?.busId;

  const bookingId = booking?._id || booking?.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!bookingId || !busId) {
      setError("Booking or bus details missing");
      return;
    }

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a review comment");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    try {
      setSubmitting(true);

      const response = await reviewService.createReview({
        bookingId,
        busId,
        rating,
        comment: comment.trim(),
      });

      toast.success(response?.message || "Review submitted successfully");

      onReviewSubmitted?.(response?.review || response?.data?.review);
      onClose?.();
    } catch (err) {
      const message = err?.message || "Unable to submit review";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Rate Your Journey
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {bus?.busName || bus?.name || "TedBus Partner"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </p>
            </div>
          )}

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-black text-slate-700">
              How was your travel experience?
            </p>

            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseEnter={() => setHoveredRating(item)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(item)}
                  className="transition active:scale-95"
                >
                  <Star
                    className={`h-9 w-9 ${
                      item <= (hoveredRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="mt-2 text-sm font-bold text-slate-500">
              {rating} out of 5
            </p>
          </div>

          <div className="mt-5">
            <label className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
              <MessageSquare className="h-4 w-4 text-red-600" />
              Review Comment
            </label>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              maxLength={500}
              placeholder="Tell us about bus comfort, punctuality, staff behavior..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />

            <p className="mt-1 text-right text-xs font-semibold text-slate-400">
              {comment.length}/500
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Star className="h-5 w-5" />
            )}
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;