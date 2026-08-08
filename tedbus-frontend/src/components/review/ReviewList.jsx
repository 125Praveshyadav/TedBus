import { useEffect, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import reviewService from "../../services/reviewService";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";

const SORT_OPTIONS = [
  { key: "recent", label: "Recent" },
  { key: "highest", label: "Highest" },
  { key: "lowest", label: "Lowest" },
  { key: "helpful", label: "Most Helpful" },
];

const SORT_THEMES = {
  recent:
    "from-violet-600 to-indigo-600 shadow-violet-500/25",
  highest:
    "from-amber-500 to-orange-500 shadow-amber-500/25",
  lowest:
    "from-teal-600 to-cyan-500 shadow-teal-500/25",
  helpful:
    "from-emerald-600 to-green-500 shadow-emerald-500/25",
};

const normalizeReviewResponse = (response) => {
  const payload = response?.data || response || {};

  return {
    reviews:
      payload?.reviews ||
      payload?.data?.reviews ||
      [],
    averageRating:
      payload?.averageRating ??
      payload?.data?.averageRating ??
      0,
    totalReviews:
      payload?.totalReviews ??
      payload?.data?.totalReviews ??
      0,
    ratingDistribution:
      payload?.ratingDistribution ||
      payload?.data?.ratingDistribution ||
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    pagination:
      payload?.pagination ||
      payload?.data?.pagination || {
        page: 1,
        pages: 1,
        total: 0,
      },
  };
};

const ReviewList = ({ busId, bookingId = null }) => {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    avg: 0,
    total: 0,
    dist: {},
  });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [editingReview, setEditingReview] =
    useState(null);
  const [checkData, setCheckData] = useState(null);

  useEffect(() => {
    if (busId) {
      fetchReviews(1);
    } else {
      setReviews([]);
      setStats({
        avg: 0,
        total: 0,
        dist: {},
      });
      setLoading(false);
    }
  }, [busId, sort]);

  useEffect(() => {
    if (bookingId && user) {
      checkReviewEligibility();
    } else {
      setCheckData(null);
    }
  }, [bookingId, user]);

  const fetchReviews = async (pageNum = 1) => {
    if (!busId) return;

    setLoading(true);

    try {
      const response = await reviewService.getBusReviews(
        busId,
        {
          page: pageNum,
          limit: 5,
          sort,
        },
      );

      const data = normalizeReviewResponse(response);

      console.log("FETCHING REVIEWS FOR BUS:", busId);
      console.log("REVIEW RAW RESPONSE:", response);
      console.log("REVIEW NORMALIZED DATA:", data);

      if (pageNum === 1) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [
          ...prev,
          ...data.reviews,
        ]);
      }

      setStats({
        avg: data.averageRating,
        total: data.totalReviews,
        dist: data.ratingDistribution,
      });

      setHasMore(
        data.pagination?.page < data.pagination?.pages,
      );

      setPage(pageNum);
    } catch (err) {
      console.log("FETCH REVIEWS ERROR:", err);
      setReviews([]);
      setStats({
        avg: 0,
        total: 0,
        dist: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const response =
        await reviewService.checkCanReview(bookingId);

      const data = response?.data || response || {};
      setCheckData(data);
    } catch (err) {
      console.log("CHECK REVIEW ERROR:", err);
      setCheckData(null);
    }
  };

  const handleReviewSuccess = () => {
    setEditingReview(null);
    fetchReviews(1);

    if (bookingId) {
      checkReviewEligibility();
    }
  };

  const getRatingLabel = (avg) => {
    if (avg >= 4.5) return "Excellent";
    if (avg >= 4) return "Very Good";
    if (avg >= 3) return "Good";
    if (avg >= 2) return "Fair";
    return "Poor";
  };

  const getBarColor = (star) => {
    if (star >= 4) {
      return "bg-gradient-to-r from-emerald-500 to-teal-400";
    }

    if (star === 3) {
      return "bg-gradient-to-r from-amber-400 to-yellow-400";
    }

    return "bg-gradient-to-r from-rose-500 to-red-400";
  };

  return (
    <div>
      {/* Section header */}
      <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
            <MessageSquare className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
              Reviews & Ratings
            </h2>

            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {loading
                ? "Loading..."
                : stats.total > 0
                  ? `${stats.total} traveller review${stats.total !== 1 ? "s" : ""}`
                  : "No reviews yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Rating stats */}
        {stats.total > 0 && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20 sm:p-5">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-200 bg-white px-5 py-4 text-center shadow-md shadow-amber-500/10 dark:border-amber-900/40 dark:bg-slate-900">
                <p className="text-5xl font-black leading-none text-slate-900 dark:text-white">
                  {Number(stats.avg).toFixed(1)}
                </p>

                <div className="mt-2 flex justify-center">
                  <StarRating
                    rating={Math.round(stats.avg)}
                    size="sm"
                    readonly
                  />
                </div>

                <p
                  className={`mt-1.5 text-[11px] font-black uppercase tracking-wider ${
                    stats.avg >= 4
                      ? "text-emerald-600 dark:text-emerald-400"
                      : stats.avg >= 3
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {getRatingLabel(stats.avg)}
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  {stats.total} reviews
                </p>
              </div>

              <div className="w-full flex-1 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.dist[star] || 0;
                  const pct =
                    stats.total > 0
                      ? (count / stats.total) * 100
                      : 0;

                  return (
                    <div
                      key={star}
                      className="flex items-center gap-2.5"
                    >
                      <div className="flex w-8 shrink-0 items-center gap-1">
                        <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                          {star}
                        </span>

                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      </div>

                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white shadow-inner dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${getBarColor(star)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <span className="w-5 shrink-0 text-right text-[11px] font-black text-slate-500 dark:text-slate-400">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Review form */}
        {bookingId && user && checkData && (
          <div className="mb-5">
            {checkData.canReview && !editingReview && (
              <ReviewForm
                bookingId={bookingId}
                busId={busId}
                onSuccess={handleReviewSuccess}
              />
            )}

            {checkData.alreadyReviewed &&
              checkData.canEdit &&
              !editingReview && (
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-900/50 dark:bg-violet-950/30">
                  <p className="text-sm font-bold text-violet-700 dark:text-violet-400">
                    You reviewed this journey. Edit within
                    24 hours.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingReview(checkData.review)
                    }
                    className="ml-3 shrink-0 rounded-lg border border-violet-200 bg-white px-3 py-1 text-xs font-black text-violet-700 transition hover:bg-violet-600 hover:text-white dark:border-violet-900/50 dark:bg-slate-900 dark:text-violet-400 dark:hover:bg-violet-600 dark:hover:text-white"
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
                  type="button"
                  onClick={() =>
                    setEditingReview(null)
                  }
                  className="mt-2 text-xs font-bold text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"
                >
                  Cancel editing
                </button>
              </div>
            )}
          </div>
        )}

        {/* Sort tabs */}
        {stats.total > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Sort by
            </span>

            {SORT_OPTIONS.map((option) => {
              const active = sort === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSort(option.key);
                    setPage(1);
                  }}
                  className={`rounded-xl px-3 py-1.5 text-[11px] font-black transition-all active:scale-95 ${
                    active
                      ? `bg-gradient-to-r ${SORT_THEMES[option.key]} text-white shadow-md`
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-300"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>

            <p className="mt-3 text-xs font-bold text-slate-400 dark:text-slate-500">
              Loading reviews...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-10 text-center dark:border-slate-700 dark:bg-slate-950/60">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-900/10" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
                <MessageSquare className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-800 dark:text-slate-200">
                No reviews yet
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                Be the first to review this bus journey!
              </p>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                <Sparkles className="h-3.5 w-3.5" />
                Earn points for writing a review
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
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
                type="button"
                onClick={() => fetchReviews(page + 1)}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-black text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-900 dark:hover:bg-amber-950/30 dark:hover:text-amber-400"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                )}
                Load More Reviews
              </button>
            )}
          </div>
        )}

        {stats.total > 0 && !loading && (
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
            All reviews are from verified TedBus bookings
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;