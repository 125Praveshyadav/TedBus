import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  IndianRupee,
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Ticket,
  Timer,
  TrendingUp,
  XCircle,
  Edit3,
} from "lucide-react";
import { toast } from "react-toastify";

import { bookingService } from "../../services/bookingService";
import ReviewModal from "../../components/review/ReviewModal";
import reviewService from "../../services/reviewService";

const BOOKING_THEMES = [
  {
    id: "crimson",
    gradient: "from-red-700 via-red-600 to-orange-500",
    glow: "bg-red-400/25",
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    hoverBorder: "hover:border-red-200 dark:hover:border-red-900/60",
    hoverShadow: "hover:shadow-red-500/10",
    dotColor: "bg-red-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-red-600 to-orange-500 shadow-red-500/25 hover:shadow-red-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-red-500 dark:text-red-400",
  },
  {
    id: "violet",
    gradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    glow: "bg-violet-400/25",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    hoverBorder: "hover:border-violet-200 dark:hover:border-violet-900/60",
    hoverShadow: "hover:shadow-violet-500/10",
    dotColor: "bg-violet-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-violet-500/25 hover:shadow-violet-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-violet-500 dark:text-violet-400",
  },
  {
    id: "emerald",
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    glow: "bg-emerald-400/25",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    hoverShadow: "hover:shadow-emerald-500/10",
    dotColor: "bg-emerald-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-emerald-600 to-cyan-500 shadow-emerald-500/25 hover:shadow-emerald-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: "amber",
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    glow: "bg-amber-400/25",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-900/60",
    hoverShadow: "hover:shadow-amber-500/10",
    dotColor: "bg-amber-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-amber-600 to-yellow-500 shadow-amber-500/25 hover:shadow-amber-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-amber-500 dark:text-amber-400",
  },
  {
    id: "cyan",
    gradient: "from-cyan-700 via-sky-600 to-blue-500",
    glow: "bg-cyan-400/25",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    hoverBorder: "hover:border-cyan-200 dark:hover:border-cyan-900/60",
    hoverShadow: "hover:shadow-cyan-500/10",
    dotColor: "bg-cyan-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-cyan-600 to-blue-500 shadow-cyan-500/25 hover:shadow-cyan-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-cyan-500 dark:text-cyan-400",
  },
  {
    id: "pink",
    gradient: "from-pink-700 via-rose-600 to-red-500",
    glow: "bg-pink-400/25",
    accentText: "text-pink-600 dark:text-pink-400",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    hoverBorder: "hover:border-pink-200 dark:hover:border-pink-900/60",
    hoverShadow: "hover:shadow-pink-500/10",
    dotColor: "bg-pink-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-pink-600 to-red-500 shadow-pink-500/25 hover:shadow-pink-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-pink-500 dark:text-pink-400",
  },
  {
    id: "indigo",
    gradient: "from-indigo-700 via-blue-600 to-violet-500",
    glow: "bg-indigo-400/25",
    accentText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-50 dark:bg-indigo-950/40",
    softBorder: "border-indigo-100 dark:border-indigo-900/50",
    hoverBorder: "hover:border-indigo-200 dark:hover:border-indigo-900/60",
    hoverShadow: "hover:shadow-indigo-500/10",
    dotColor: "bg-indigo-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-indigo-600 to-violet-500 shadow-indigo-500/25 hover:shadow-indigo-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: "teal",
    gradient: "from-teal-700 via-emerald-600 to-green-500",
    glow: "bg-teal-400/25",
    accentText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
    hoverBorder: "hover:border-teal-200 dark:hover:border-teal-900/60",
    hoverShadow: "hover:shadow-teal-500/10",
    dotColor: "bg-teal-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-teal-600 to-green-500 shadow-teal-500/25 hover:shadow-teal-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-teal-500 dark:text-teal-400",
  },
  {
    id: "orange",
    gradient: "from-orange-700 via-amber-600 to-yellow-500",
    glow: "bg-orange-400/25",
    accentText: "text-orange-600 dark:text-orange-400",
    softBg: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
    hoverBorder: "hover:border-orange-200 dark:hover:border-orange-900/60",
    hoverShadow: "hover:shadow-orange-500/10",
    dotColor: "bg-orange-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-orange-600 to-yellow-500 shadow-orange-500/25 hover:shadow-orange-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-orange-500 dark:text-orange-400",
  },
  {
    id: "slate",
    gradient: "from-slate-800 via-slate-700 to-zinc-600",
    glow: "bg-slate-400/25",
    accentText: "text-slate-600 dark:text-slate-400",
    softBg: "bg-slate-100 dark:bg-slate-800/60",
    softBorder: "border-slate-200 dark:border-slate-700",
    hoverBorder: "hover:border-slate-300 dark:hover:border-slate-600",
    hoverShadow: "hover:shadow-slate-500/10",
    dotColor: "bg-slate-500",
    tagLabel: "TedBus Booking",
    ticketBtnBg:
      "bg-gradient-to-r from-slate-700 to-zinc-600 shadow-slate-500/25 hover:shadow-slate-500/40",
    downloadBtnBg:
      "bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600",
    amenityIcon: "text-slate-500 dark:text-slate-400",
  },
];

const getTheme = (index) => {
  return BOOKING_THEMES[(Number(index) || 0) % BOOKING_THEMES.length];
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getBookingSeats = (booking) => {
  if (Array.isArray(booking?.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers;
  }

  if (Array.isArray(booking?.passengerDetails)) {
    return booking.passengerDetails
      .map((p) => p.seatNumber || p.seatNo)
      .filter(Boolean);
  }

  return [];
};

const getPrimaryPassenger = (booking) => {
  if (Array.isArray(booking?.passengerDetails) && booking.passengerDetails[0]) {
    return booking.passengerDetails[0];
  }

  return null;
};

const normalizeBooking = (booking) => {
  const bus = booking?.bus || {};
  const seats = getBookingSeats(booking);
  const passenger = getPrimaryPassenger(booking);

  return {
    ...booking,
    id: booking?._id || booking?.id,
    pnr: booking?.pnr || "N/A",
    busName: bus?.name || bus?.busName || bus?.operatorName || "TedBus Partner",
    busType: bus?.type || bus?.busType || bus?.category || "Standard Bus",
    source: bus?.source || "Source",
    destination: bus?.destination || "Destination",
    departure: bus?.departure || bus?.departureTime || bus?.startTime || "—",
    arrival: bus?.arrival || bus?.arrivalTime || bus?.endTime || "—",
    duration: bus?.duration || "—",
    journeyDate: booking?.journeyDate || bus?.journeyDate || "",
    seats,
    passengerName: passenger?.name || "Passenger",
    amount: booking?.totalAmount || booking?.fareBreakup?.totalAmount || 0,
    bookingStatus: booking?.bookingStatus || "Pending",
    paymentStatus: booking?.paymentStatus || "Pending",
    boardingPoint: booking?.boardingPoint || "",
    droppingPoint: booking?.droppingPoint || "",
  };
};

const statusConfig = {
  Confirmed: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
  },
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
    icon: Timer,
    iconColor: "text-amber-500",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
    icon: XCircle,
    iconColor: "text-red-500",
  },
};

const paymentConfig = {
  Paid: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  Failed: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-900/50",
  },
};

const filterTabs = [
  { key: "all", label: "All", icon: Tag },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "pending", label: "Pending", icon: Timer },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
];

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewEligibilityMap, setReviewEligibilityMap] = useState({});

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await bookingService.getMyBookings();

      const apiBookings = response?.bookings || response?.data?.bookings || [];

      const normalized = Array.isArray(apiBookings)
        ? apiBookings.map(normalizeBooking)
        : [];

      setBookings(normalized);
      await fetchReviewEligibilities(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load bookings");
      setBookings([]);
       setReviewEligibilityMap({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchReviewEligibilities = async (bookingList = []) => {
    const eligibleBookings = bookingList.filter((booking) => {
      const isPastJourney = booking.journeyDate
        ? new Date(booking.journeyDate) < new Date()
        : false;

      const isConfirmed = booking.bookingStatus === "Confirmed";

      return isPastJourney && isConfirmed;
    });

    if (eligibleBookings.length === 0) {
      setReviewEligibilityMap({});
      return;
    }

    // First set loading state for relevant bookings
    setReviewEligibilityMap((prev) => {
      const next = { ...prev };

      eligibleBookings.forEach((booking) => {
        next[booking.id] = {
          loading: true,
        };
      });

      return next;
    });

    const results = await Promise.all(
      eligibleBookings.map(async (booking) => {
        try {
          const data = await reviewService.checkCanReview(booking.id);

          return {
            bookingId: booking.id,
            data: {
              ...data,
              loading: false,
            },
          };
        } catch (err) {
          return {
            bookingId: booking.id,
            data: {
              loading: false,
              canReview: false,
              alreadyReviewed: false,
              canEdit: false,
              message:
                err?.data?.message ||
                err?.response?.data?.message ||
                err?.message ||
                "Unable to check review status",
            },
          };
        }
      }),
    );

    const mapped = {};
    results.forEach((item) => {
      mapped[item.bookingId] = item.data;
    });

    setReviewEligibilityMap(mapped);
  };

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeFilter !== "all") {
      result = result.filter(
        (b) => b.bookingStatus?.toLowerCase() === activeFilter.toLowerCase(),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter(
        (b) =>
          b.pnr?.toLowerCase().includes(query) ||
          b.busName?.toLowerCase().includes(query) ||
          b.source?.toLowerCase().includes(query) ||
          b.destination?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [bookings, activeFilter, searchQuery]);

  const bookingCounts = useMemo(
    () => ({
      all: bookings.length,
      confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
      pending: bookings.filter((b) => b.bookingStatus === "Pending").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,
    }),
    [bookings],
  );

  const handleViewTicket = (booking) => {
    navigate("/ticket", {
      state: { bookingId: booking.id, booking },
    });
  };

  const handleDownload = async (booking) => {
    try {
      setActionLoading(`download-${booking.id}`);

      const blob = await bookingService.downloadTicket(booking.id);

      const fileBlob =
        blob instanceof Blob
          ? blob
          : new Blob([blob], { type: "application/pdf" });

      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `TedBus-Ticket-${booking.pnr || booking.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Ticket downloaded successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to download ticket");
    } finally {
      setActionLoading("");
    }
  };

  const handleCancel = async (booking) => {
    if (booking.bookingStatus === "Cancelled") return;

    const confirmCancel = window.confirm(`Cancel booking ${booking.pnr}?`);

    if (!confirmCancel) return;

    const cancellationReason =
      window.prompt("Cancellation reason:", "User Cancelled") ||
      "User Cancelled";

    try {
      setActionLoading(`cancel-${booking.id}`);

      const response = await bookingService.cancelBooking(
        booking.id,
        cancellationReason,
      );

      const updatedBooking =
        response?.booking || response?.data?.booking || null;

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id
            ? normalizeBooking(
                updatedBooking || {
                  ...item,
                  bookingStatus: "Cancelled",
                },
              )
            : item,
        ),
      );

      toast.success(response?.message || "Booking cancelled successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to cancel booking");
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-32 animate-pulse overflow-hidden rounded-[2rem] bg-gradient-to-br from-red-200 via-orange-100 to-red-100 dark:from-red-950 dark:via-slate-900 dark:to-orange-950" />

          <div className="mb-6 h-16 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />

          <div className="space-y-5">
            {[0, 1, 2].map((index) => {
              const theme = getTheme(index);

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`h-2 animate-pulse bg-gradient-to-r ${theme.gradient}`}
                  />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-white/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%,transparent)] [background-size:44px_44px] opacity-25" />

        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] backdrop-blur-xl sm:text-[10px]">
                <Ticket className="h-3.5 w-3.5" />
                TedBus Account
              </div>

              <h1 className="text-2xl font-black tracking-[-0.04em] sm:text-3xl lg:text-4xl">
                My Bookings
              </h1>

              <p className="mt-2 max-w-xl text-xs font-medium leading-5 text-red-50/90 sm:text-sm sm:leading-6">
                View upcoming journeys, download tickets and manage your travel
                plans.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 backdrop-blur-xl">
                <TrendingUp className="h-4 w-4 text-white/80" />

                <div>
                  <p className="text-base font-black sm:text-lg">
                    {bookingCounts.all}
                  </p>

                  <p className="text-[7px] font-black uppercase tracking-wider text-white/60 sm:text-[8px]">
                    Total trips
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/search-bus")}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-red-600 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              >
                Book New Trip
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Error */}
          {error && (
            <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-red-100 bg-white p-7 text-center shadow-xl shadow-red-500/5 dark:border-red-900/50 dark:bg-slate-900 sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <AlertCircle className="h-8 w-8" />
                </div>

                <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
                  Unable to load bookings
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchBookings}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Filters */}
          {!error && (
            <div className="relative mb-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-5">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/20 blur-3xl dark:bg-red-900/10" />

              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {filterTabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const count = bookingCounts[tab.key] || 0;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveFilter(tab.key)}
                        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition sm:text-sm ${
                          activeFilter === tab.key
                            ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        }`}
                      >
                        <TabIcon className="h-3.5 w-3.5" />
                        {tab.label}

                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                            activeFilter === tab.key
                              ? "bg-white/20"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full lg:max-w-sm">
                  <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <Search className="h-4 w-4" />
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search PNR, bus, city..."
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!error && filteredBookings.length === 0 && (
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/10" />

              <div className="relative">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                  <BusFront className="h-9 w-9" />
                </div>

                <h2 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">
                  No bookings found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {bookings.length === 0
                    ? "You haven't booked any bus tickets yet. Start your first journey with TedBus!"
                    : "No bookings match your current filter or search."}
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/search-bus")}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  Search Buses
                </button>
              </div>
            </div>
          )}

          {/* Booking cards */}
          {!error && filteredBookings.length > 0 && (
            <div className="space-y-5">
              {filteredBookings.map((booking, index) => {
                const theme = getTheme(index);

                const isPastJourney = booking.journeyDate
                  ? new Date(booking.journeyDate) < new Date()
                  : false;

                const isConfirmed = booking.bookingStatus === "Confirmed";

                const isCancelled = booking.bookingStatus === "Cancelled";

                const statusCfg =
                  statusConfig[booking.bookingStatus] || statusConfig.Pending;

                const paymentCfg =
                  paymentConfig[booking.paymentStatus] || paymentConfig.Pending;

                const StatusIcon = statusCfg.icon;

                return (
                  <article
                    key={booking.id}
                    className={`group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${theme.hoverBorder} ${theme.hoverShadow}`}
                  >
                    {/* Top gradient */}
                    <div
                      className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient} opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:gap-6">
                        {/* Left */}
                        <div className="min-w-0 flex-1">
                          {/* Header */}
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${theme.gradient} px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-sm`}
                                >
                                  <Sparkles className="h-3 w-3" />
                                  {theme.tagLabel}
                                </span>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {booking.bookingStatus}
                                </span>

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${paymentCfg.bg} ${paymentCfg.text} ${paymentCfg.border}`}
                                >
                                  {booking.paymentStatus}
                                </span>
                              </div>

                              <h2 className="truncate text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                                {booking.busName}
                              </h2>

                              <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                                {booking.busType}
                              </p>
                            </div>
                          </div>

                          {/* Info grid */}
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <div
                              className={`rounded-xl border p-3 ${theme.softBorder} bg-white dark:bg-slate-900`}
                            >
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                PNR
                              </p>

                              <p
                                className={`mt-1 text-sm font-black ${theme.accentText}`}
                              >
                                {booking.pnr}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${theme.softBorder} bg-white dark:bg-slate-900`}
                            >
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                Passenger
                              </p>

                              <p className="mt-1 truncate text-sm font-black text-slate-900 dark:text-white">
                                {booking.passengerName}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${theme.softBorder} bg-white dark:bg-slate-900`}
                            >
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                Journey Date
                              </p>

                              <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                                <CalendarDays
                                  className={`h-3.5 w-3.5 ${theme.accentText}`}
                                />
                                {formatDate(booking.journeyDate)}
                              </p>
                            </div>

                            <div
                              className={`rounded-xl border p-3 ${theme.softBorder} bg-white dark:bg-slate-900`}
                            >
                              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                Seats
                              </p>

                              <div className="mt-1 flex flex-wrap gap-1">
                                {booking.seats.length > 0 ? (
                                  booking.seats.map((seat) => (
                                    <span
                                      key={seat}
                                      className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${theme.softBg} ${theme.softBorder} ${theme.accentText}`}
                                    >
                                      {seat}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs font-bold text-slate-400">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Route timeline */}
                          <div
                            className={`mt-4 rounded-2xl border p-4 ${theme.softBorder} ${theme.softBg}`}
                          >
                            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                  From
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                                  <MapPin
                                    className={`h-3.5 w-3.5 ${theme.accentText}`}
                                  />
                                  {booking.source}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                  <Clock3 className="h-3 w-3" />
                                  {booking.departure}
                                </p>
                              </div>

                              <div className="flex flex-col items-center">
                                <div className="relative">
                                  <div className="h-px w-10 border-t border-dashed border-slate-300 dark:border-slate-600 sm:w-16" />

                                  <div
                                    className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${theme.dotColor}`}
                                  />
                                </div>

                                <p
                                  className={`mt-1 text-[10px] font-black ${theme.accentText}`}
                                >
                                  {booking.duration}
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                  To
                                </p>

                                <p className="mt-1 flex items-center justify-end gap-1.5 text-sm font-black text-slate-900 dark:text-white">
                                  {booking.destination}
                                  <MapPin
                                    className={`h-3.5 w-3.5 ${theme.accentText}`}
                                  />
                                </p>

                                <p className="mt-1 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                  {booking.arrival}
                                  <Clock3 className="h-3 w-3" />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right — actions */}
                        <div className="w-full shrink-0 xl:w-64">
                          <div
                            className={`rounded-2xl border p-4 ${theme.softBorder} ${theme.softBg}`}
                          >
                            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                              Amount paid
                            </p>

                            <p
                              className={`mt-1 flex items-center gap-1 text-2xl font-black sm:text-3xl ${theme.accentText}`}
                            >
                              <IndianRupee className="h-6 w-6" />
                              {formatCurrency(booking.amount)}
                            </p>

                            <div className="mt-4 space-y-2.5">
                              <button
                                type="button"
                                onClick={() => handleViewTicket(booking)}
                                className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] ${theme.ticketBtnBg}`}
                              >
                                <Ticket className="h-4 w-4" />
                                View Ticket
                                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownload(booking)}
                                disabled={
                                  actionLoading === `download-${booking.id}`
                                }
                                className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-0 active:scale-[0.98] ${theme.downloadBtnBg}`}
                              >
                                {actionLoading === `download-${booking.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Download
                              </button>

                      {isPastJourney && isConfirmed && (() => {
  const reviewStatus = reviewEligibilityMap[booking.id];

  if (!reviewStatus || reviewStatus.loading) {
    return (
      <button
        type="button"
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-500"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking Review...
      </button>
    );
  }

  if (reviewStatus.canReview) {
    return (
      <button
        type="button"
        onClick={() =>
          setReviewBooking({
            ...booking,
            reviewStatus,
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition hover:bg-amber-100 active:scale-[0.98] dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/50"
      >
        <Star className="h-4 w-4 fill-current" />
        Rate Journey
      </button>
    );
  }

  if (reviewStatus.alreadyReviewed && reviewStatus.canEdit) {
    return (
      <button
        type="button"
        onClick={() =>
          setReviewBooking({
            ...booking,
            reviewStatus,
          })
        }
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-700 transition hover:bg-violet-100 active:scale-[0.98] dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400 dark:hover:bg-violet-950/50"
      >
        <Edit3 className="h-4 w-4" />
        Edit Review
      </button>
    );
  }

  if (reviewStatus.alreadyReviewed && !reviewStatus.canEdit) {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
        <CheckCircle2 className="h-4 w-4" />
        Reviewed
      </div>
    );
  }

  return null;
})()}

{isPastJourney && isConfirmed && reviewEligibilityMap[booking.id]?.alreadyReviewed && (
  <p className="mt-1 text-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
    {reviewEligibilityMap[booking.id]?.canEdit
      ? "You can edit your review within 24 hours"
      : "Review already submitted"}
  </p>
)}

                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => handleCancel(booking)}
                                  disabled={
                                    actionLoading === `cancel-${booking.id}`
                                  }
                                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98] dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                                >
                                  {actionLoading === `cancel-${booking.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ticket notch */}
                    <div className="relative z-10">
                      <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />

                      <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                      <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                    </div>

                    {/* Confirmed footer */}
                    {isConfirmed && booking.paymentStatus === "Paid" && (
                      <div className="flex items-center gap-2 px-5 py-3 sm:px-6">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />

                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          Ticket confirmed — please carry a valid ID proof.
                        </p>
                      </div>
                    )}

                    {/* Trust footer */}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 dark:border-slate-800 sm:px-6">
                      <span className="inline-flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        TedBus verified booking
                      </span>

                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${theme.dotColor}`}
                        />

                        <span className={theme.accentText}>
                          Booking #{String(index + 1).padStart(2, "0")}
                        </span>
                      </span>
                    </div>

                    {/* Hover glow */}
                    <div
                      className={`pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${theme.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]`}
                    />
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Review modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onReviewSubmitted={() => {
            setReviewBooking(null);
            fetchBookings();
          }}
        />
      )}
    </main>
  );
};

export default MyBookings;
