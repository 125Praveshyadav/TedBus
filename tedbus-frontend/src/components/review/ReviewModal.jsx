import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Award,
  BusFront,
  CalendarDays,
  Loader2,
  MapPin,
  X,
} from "lucide-react";

import ReviewForm from "./ReviewForm";
import reviewService from "../../services/reviewService";

const formatDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ReviewModal = ({
  booking,
  onClose,
  onReviewSubmitted,
}) => {
  const overlayRef = useRef(null);

  const [checking, setChecking] = useState(true);
  const [reviewStatus, setReviewStatus] = useState(null);

  const bookingId =
    booking?.id ||
    booking?._id ||
    booking?.bookingId ||
    "";

  const busId =
    booking?.bus?._id ||
    booking?.bus?.id ||
    booking?.busId ||
    "";

  const busName =
    booking?.busName ||
    booking?.bus?.name ||
    booking?.bus?.busName ||
    "TedBus Partner";

  const source =
    booking?.source ||
    booking?.bus?.source ||
    "";

  const destination =
    booking?.destination ||
    booking?.bus?.destination ||
    "";

  const journeyDate =
    booking?.journeyDate ||
    booking?.bus?.journeyDate ||
    "";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () =>
      document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        setChecking(true);

        if (!bookingId) {
          setReviewStatus({
            canReview: false,
            message: "Booking ID missing",
          });
          return;
        }

        const data = await reviewService.checkCanReview(
          bookingId,
        );

        setReviewStatus(data);
      } catch (err) {
        setReviewStatus({
          canReview: false,
          alreadyReviewed: false,
          canEdit: false,
          message:
            err?.data?.message ||
            err?.response?.data?.message ||
            err?.message ||
            "Unable to verify review eligibility",
        });
      } finally {
        setChecking(false);
      }
    };

    checkEligibility();
  }, [bookingId]);

  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="w-full max-w-lg animate-in slide-in-from-bottom duration-300 sm:rounded-[2rem]">
        <div className="max-h-[90vh] overflow-hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem]">
          {/* Compact Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 px-4 py-4 text-white sm:px-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 left-0 h-24 w-24 rounded-full bg-orange-300/25 blur-2xl" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/15 backdrop-blur-xl">
                  <Award className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/80">
                    Rate Journey
                  </div>

                  <h2 className="truncate text-sm font-black sm:text-base">
                    Your Travel Experience
                  </h2>

                  <p className="mt-0.5 text-[10px] font-medium text-amber-100/80">
                    Share honest feedback
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Compact Booking Strip */}
            <div className="relative mt-3 grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-xl border border-white/10 bg-black/10 backdrop-blur-xl">
              <div className="flex items-center gap-2 p-2.5">
                <BusFront className="h-3.5 w-3.5 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-wider text-white/60">
                    Bus
                  </p>
                  <p className="truncate text-[9px] font-black">
                    {busName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-wider text-white/60">
                    Route
                  </p>
                  <p className="truncate text-[9px] font-black">
                    {source && destination
                      ? `${source} → ${destination}`
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-white/70" />
                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-wider text-white/60">
                    Date
                  </p>
                  <p className="truncate text-[9px] font-black">
                    {formatDate(journeyDate) || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="max-h-[calc(90vh-145px)] overflow-y-auto p-4 sm:p-5">
            {checking ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
                <p className="mt-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                  Checking review eligibility...
                </p>
              </div>
            ) : reviewStatus?.canReview ? (
              <ReviewForm
                bookingId={bookingId}
                busId={busId}
                onSuccess={(review) => {
                  onReviewSubmitted?.(review);
                  onClose();
                }}
              />
            ) : reviewStatus?.alreadyReviewed && reviewStatus?.canEdit ? (
              <div>
                <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900/50 dark:bg-violet-950/30">
                  <p className="text-sm font-black text-violet-700 dark:text-violet-400">
                    You already reviewed this journey.
                  </p>
                  <p className="mt-1 text-xs font-medium text-violet-600 dark:text-violet-400">
                    You can still edit it within 24 hours.
                  </p>
                </div>

                <ReviewForm
                  bookingId={bookingId}
                  busId={busId}
                  existingReview={reviewStatus.review}
                  onSuccess={(review) => {
                    onReviewSubmitted?.(review);
                    onClose();
                  }}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center dark:border-amber-900/50 dark:bg-amber-950/30">
                <AlertCircle className="mx-auto h-8 w-8 text-amber-600 dark:text-amber-400" />

                <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white">
                  Review unavailable
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {reviewStatus?.message ||
                    "You cannot review this journey right now."}
                </p>

                {reviewStatus?.alreadyReviewed &&
                  !reviewStatus?.canEdit && (
                    <div className="mt-4 rounded-xl bg-white/70 px-4 py-3 text-xs font-bold text-slate-500 dark:bg-slate-900/40 dark:text-slate-400">
                      This journey has already been reviewed and the edit window has expired.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;