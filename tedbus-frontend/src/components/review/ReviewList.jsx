import { useEffect, useState } from "react";
import { Star, ChevronDown, Loader2, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import reviewService from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";

const ReviewList = ({ busId, bookingId = null }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avg: 0, total: 0, dist: {} });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [checkData, setCheckData] = useState(null);

  useEffect(() => {
    if (busId) fetchReviews(1);
  }, [busId, sort]);

  useEffect(() => {
    if (bookingId && user) checkReviewEligibility();
  }, [bookingId, user]);

  const fetchReviews = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await reviewService.getBusReviews(busId, {
        page: pageNum,
        limit: 5,
        sort,
      });

      if (pageNum === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      }

      setStats({
        avg: data.averageRating || 0,
        total: data.totalReviews || 0,
        dist: data.ratingDistribution || {},
      });
      setHasMore(data.pagination?.page < data.pagination?.pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const data = await reviewService.checkCanReview(bookingId);
      setCheckData(data);
    } catch (err) {
      console.error("Check review error:", err);
    }
  };

  const handleReviewSuccess = () => {
    setEditingReview(null);
    fetchReviews(1);
    if (bookingId) checkReviewEligibility();
  };

  const renderRatingBar = (count, total) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5 flex items-center gap-2">
        <MessageSquare size={22} className="text-red-600 dark:text-red-500" />
        Reviews & Ratings
      </h2>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-5">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Average Score */}
            <div className="text-center shrink-0">
              <p className="text-5xl font-black text-slate-900 dark:text-white leading-none">
                {Number(stats.avg).toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <StarRating rating={Math.round(stats.avg)} size="sm" readonly />
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
                {stats.total} reviews
              </p>
            </div>

            {/* Distribution Bars */}
            <div className="flex-1 w-full space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-3 shrink-0">
                    {star}
                  </span>
                  <Star size={11} className="text-amber-400 fill-amber-400 shrink-0" />
                  <div className="flex-1">
                    {renderRatingBar(stats.dist[star] || 0, stats.total)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 w-5 text-right shrink-0">
                    {stats.dist[star] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write / Edit Review */}
      {bookingId && user && checkData && (
        <div className="mb-5">
          {checkData.canReview && !editingReview && (
            <ReviewForm
              bookingId={bookingId}
              busId={busId}
              onSuccess={handleReviewSuccess}
            />
          )}

          {checkData.alreadyReviewed && checkData.canEdit && !editingReview && (
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-blue-700 dark:text-blue-400">
                You reviewed this journey. Edit within 24 hours.
              </p>
              <button
                onClick={() => setEditingReview(checkData.review)}
                className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline ml-3 shrink-0"
              >
                Edit Review
              </button>
            </div>
          )}

          {editingReview && (
            <div className="mb-3">
              <ReviewForm
                bookingId={bookingId}
                busId={busId}
                existingReview={editingReview}
                onSuccess={handleReviewSuccess}
              />
              <button
                onClick={() => setEditingReview(null)}
                className="mt-2 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
              >
                Cancel editing
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sort Buttons */}
      {stats.total > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { key: "recent", label: "Recent" },
            { key: "highest", label: "Highest" },
            { key: "lowest", label: "Lowest" },
            { key: "helpful", label: "Most Helpful" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => { setSort(s.key); setPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                sort === s.key
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-200 dark:hover:border-red-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Reviews */}
      {loading && reviews.length === 0 ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin text-red-600" size={28} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <MessageSquare size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            No reviews yet. Be the first to review!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={user?._id}
              onEdit={setEditingReview}
            />
          ))}

          {hasMore && (
            <button
              onClick={() => fetchReviews(page + 1)}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 transition hover:border-red-200 hover:text-red-600 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ChevronDown size={16} />
              )}
              Load More Reviews
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewList;