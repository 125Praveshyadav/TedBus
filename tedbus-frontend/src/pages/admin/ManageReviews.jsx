import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BusFront,
  CalendarDays,
  Eye,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const ratingFilters = ["all", "5", "4", "3", "2", "1"];

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeReview = (review = {}) => {
  const user = review.user || {};
  const bus = review.bus || {};

  return {
    ...review,
    id: review._id || review.id,

    userName: user.name || review.userName || "User",
    userEmail: user.email || review.userEmail || "N/A",

    busName:
      bus.busName ||
      bus.name ||
      bus.operatorName ||
      review.busName ||
      "TedBus Partner",

    busNumber: bus.busNumber || "N/A",

    source: bus.source || "",
    destination: bus.destination || "",

    rating: Number(review.rating || review.stars || 0),

    comment:
      review.comment ||
      review.review ||
      review.message ||
      "No comment provided",

    createdAt: review.createdAt || "",
  };
};

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getReviews();

      const apiReviews =
        response?.reviews ||
        response?.data?.reviews ||
        [];

      const normalized = Array.isArray(apiReviews)
        ? apiReviews.map(normalizeReview)
        : [];

      setReviews(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    if (ratingFilter !== "all") {
      result = result.filter(
        (review) => Number(review.rating) === Number(ratingFilter)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((review) => {
        return (
          review.userName?.toLowerCase().includes(query) ||
          review.userEmail?.toLowerCase().includes(query) ||
          review.busName?.toLowerCase().includes(query) ||
          review.busNumber?.toLowerCase().includes(query) ||
          review.comment?.toLowerCase().includes(query) ||
          review.source?.toLowerCase().includes(query) ||
          review.destination?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [reviews, ratingFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = reviews.length;

    const average =
      total > 0
        ? reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
          total
        : 0;

    return {
      total,
      average: average.toFixed(1),
      fiveStar: reviews.filter((r) => Number(r.rating) === 5).length,
      lowRating: reviews.filter((r) => Number(r.rating) <= 2).length,
    };
  }, [reviews]);

  const handleDeleteReview = async (review) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this review by ${review.userName}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(review.id);

      const response = await adminService.deleteReview(review.id);

      setReviews((prev) => prev.filter((item) => item.id !== review.id));

      toast.success(response?.message || "Review deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to delete review");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Manage Reviews
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Monitor customer feedback and remove inappropriate reviews.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Reviews" value={stats.total} />
        <StatCard title="Average Rating" value={`${stats.average} ★`} color="amber" />
        <StatCard title="5 Star Reviews" value={stats.fiveStar} color="green" />
        <StatCard title="Low Ratings" value={stats.lowRating} color="red" />
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user, bus, comment..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            <option value="all">All Ratings</option>
            {ratingFilters
              .filter((item) => item !== "all")
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
          <h2 className="mt-3 text-xl font-black text-slate-900">
            Unable to load reviews
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!error && filteredReviews.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No reviews found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Reviews will appear here once users submit feedback.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredReviews.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Bus</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Review</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-sm font-black text-red-600">
                          {review.userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div>
                          <p className="font-black text-slate-900">
                            {review.userName}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {review.userEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {review.busName}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {review.busNumber}
                      </p>
                      {review.source && review.destination && (
                        <p className="text-xs font-semibold text-slate-400">
                          {review.source} → {review.destination}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <RatingStars rating={review.rating} />
                    </td>

                    <td className="px-6 py-4">
                      <p className="line-clamp-2 max-w-md font-semibold text-slate-600">
                        {review.comment}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-bold text-slate-700">
                        <CalendarDays className="h-4 w-4 text-red-600" />
                        {formatDate(review.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedReview(review)}
                          className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                          title="View Review"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteReview(review)}
                          disabled={deletingId === review.id}
                          className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Delete Review"
                        >
                          {deletingId === review.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedReview && (
        <ReviewDetailsModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
};

const RatingStars = ({ rating }) => {
  const value = Number(rating || 0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          className={`h-4 w-4 ${
            item <= value
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-black text-slate-600">
        {value}
      </span>
    </div>
  );
};

const StatCard = ({ title, value, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-50 text-slate-900",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 rounded-2xl px-3 py-2 text-2xl font-black ${colors[color]}`}
      >
        {value}
      </p>
    </div>
  );
};

const ReviewDetailsModal = ({ review, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Review Details
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Review ID: {review.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <UserRound className="h-5 w-5 text-red-600" />
              User
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Name" value={review.userName} />
              <Info label="Email" value={review.userEmail} />
            </div>
          </section>

          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <BusFront className="h-5 w-5 text-red-600" />
              Bus
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Bus Name" value={review.busName} />
              <Info label="Bus Number" value={review.busNumber} />
              <Info
                label="Route"
                value={
                  review.source && review.destination
                    ? `${review.source} → ${review.destination}`
                    : "N/A"
                }
              />
              <Info label="Date" value={formatDate(review.createdAt)} />
            </div>
          </section>

          <section className="rounded-3xl bg-amber-50 p-5">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Rating
            </h3>
            <RatingStars rating={review.rating} />
          </section>

          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <MessageSquare className="h-5 w-5 text-red-600" />
              Comment
            </h3>

            <p className="text-sm font-semibold leading-7 text-slate-700">
              {review.comment}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <p className="mt-1 font-black text-slate-900">{value || "N/A"}</p>
  </div>
);

export default ManageReviews;