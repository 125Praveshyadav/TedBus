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
  Ticket,
  XCircle,
  Star 
} from "lucide-react";
import { toast } from "react-toastify";
import ReviewModal from "../../components/review/ReviewModel";

import { bookingService } from "../../services/bookingService";


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
      .map((passenger) => passenger.seatNumber || passenger.seatNo)
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

    busName:
      bus?.name ||
      bus?.busName ||
      bus?.operatorName ||
      "TedBus Partner",

    busType:
      bus?.type ||
      bus?.busType ||
      bus?.category ||
      "Standard Bus",

    source: bus?.source || "Source",
    destination: bus?.destination || "Destination",

    departure:
      bus?.departure ||
      bus?.departureTime ||
      bus?.startTime ||
      "—",

    arrival:
      bus?.arrival ||
      bus?.arrivalTime ||
      bus?.endTime ||
      "—",

    duration: bus?.duration || "—",

    journeyDate:
      booking?.journeyDate ||
      bus?.journeyDate ||
      "",

    seats,

    passengerName: passenger?.name || "Passenger",

    amount:
      booking?.totalAmount ||
      booking?.fareBreakup?.totalAmount ||
      0,

    bookingStatus: booking?.bookingStatus || "Pending",
    paymentStatus: booking?.paymentStatus || "Pending",
    boardingPoint: booking?.boardingPoint || "",
    droppingPoint: booking?.droppingPoint || "",
  };
};

const statusStyles = {
  Confirmed: "bg-green-50 text-green-700 border-green-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
  Expired: "bg-slate-100 text-slate-600 border-slate-200",
};

const paymentStyles = {
  Paid: "bg-green-50 text-green-700 border-green-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Failed: "bg-red-50 text-red-700 border-red-100",
};

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewBooking, setReviewBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await bookingService.getMyBookings();

      const apiBookings =
        response?.bookings ||
        response?.data?.bookings ||
        [];

      const normalized = Array.isArray(apiBookings)
        ? apiBookings.map(normalizeBooking)
        : [];

      setBookings(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (activeFilter !== "all") {
      result = result.filter(
        (booking) =>
          booking.bookingStatus?.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((booking) => {
        return (
          booking.pnr?.toLowerCase().includes(query) ||
          booking.busName?.toLowerCase().includes(query) ||
          booking.source?.toLowerCase().includes(query) ||
          booking.destination?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [bookings, activeFilter, searchQuery]);

  const bookingCounts = useMemo(() => {
    return {
      all: bookings.length,
      confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
      pending: bookings.filter((b) => b.bookingStatus === "Pending").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,
    };
  }, [bookings]);

  const handleViewTicket = (booking) => {
    navigate("/ticket", {
      state: {
        bookingId: booking.id,
        booking,
      },
    });
  };

  const handleDownload = async (booking) => {
    try {
      setActionLoading(`download-${booking.id}`);

      const blob = await bookingService.downloadTicket(booking.id);

      const fileBlob = blob instanceof Blob ? blob : new Blob([blob], {
        type: "application/pdf",
      });

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

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel booking ${booking.pnr}?`
    );

    if (!confirmCancel) return;

    const cancellationReason =
      window.prompt("Cancellation reason optional:", "User Cancelled") ||
      "User Cancelled";

    try {
      setActionLoading(`cancel-${booking.id}`);

      const response = await bookingService.cancelBooking(
        booking.id,
        cancellationReason
      );

      const updatedBooking =
        response?.booking ||
        response?.data?.booking ||
        null;

      setBookings((prev) =>
        prev.map((item) =>
          item.id === booking.id
            ? normalizeBooking(updatedBooking || { ...item, bookingStatus: "Cancelled" })
            : item
        )
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
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-36 animate-pulse rounded-[2rem] bg-slate-200" />

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-[2rem] bg-white"
              >
                <div className="h-full rounded-[2rem] bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
            <Ticket className="h-4 w-4" />
            TedBus Account
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                My Bookings
              </h1>

              <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-red-50">
                View your upcoming journeys, download tickets and manage
                cancellations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/search-bus")}
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-red-600 shadow-lg transition hover:bg-red-50"
            >
              Book New Trip
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Error */}
          {error && (
            <div className="mb-6 rounded-[2rem] border border-red-100 bg-red-50 p-6 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

              <h2 className="mt-3 text-xl font-black text-slate-900">
                Unable to load bookings
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-600">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchBookings}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry
              </button>
            </div>
          )}

          {/* Controls */}
          {!error && (
            <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      key: "all",
                      label: "All",
                      count: bookingCounts.all,
                    },
                    {
                      key: "confirmed",
                      label: "Confirmed",
                      count: bookingCounts.confirmed,
                    },
                    {
                      key: "pending",
                      label: "Pending",
                      count: bookingCounts.pending,
                    },
                    {
                      key: "cancelled",
                      label: "Cancelled",
                      count: bookingCounts.cancelled,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => setActiveFilter(filter.key)}
                      className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                        activeFilter === filter.key
                          ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                          : "bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative w-full lg:max-w-sm">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search PNR, bus, city..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Empty */}
          {!error && filteredBookings.length === 0 && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                <BusFront className="h-10 w-10" />
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">
                No bookings found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-500">
                {bookings.length === 0
                  ? "You have not booked any bus tickets yet."
                  : "No bookings match your current filter/search."}
              </p>

              <button
                type="button"
                onClick={() => navigate("/search-bus")}
                className="mt-6 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
              >
                Search Buses
              </button>
            </div>
          )}

          {/* Booking Cards */}
          {!error && filteredBookings.length > 0 && (
            <div className="space-y-5">
              {filteredBookings.map((booking) => {
                const bookingStatusClass =
                  statusStyles[booking.bookingStatus] ||
                  "bg-slate-100 text-slate-600 border-slate-200";

                const paymentStatusClass =
                  paymentStyles[booking.paymentStatus] ||
                  "bg-slate-100 text-slate-600 border-slate-200";

                const isCancelled = booking.bookingStatus === "Cancelled";

                return (
                  <article
                    key={booking.id}
                    className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        {/* Left */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                                <BusFront className="h-3.5 w-3.5" />
                                TedBus Booking
                              </div>

                              <h2 className="text-xl font-black text-slate-900">
                                {booking.busName}
                              </h2>

                              <p className="mt-1 text-sm font-semibold text-slate-500">
                                {booking.busType}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-black ${bookingStatusClass}`}
                              >
                                {booking.bookingStatus}
                              </span>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-black ${paymentStatusClass}`}
                              >
                                Payment: {booking.paymentStatus}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-4">
                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                PNR
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {booking.pnr}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Passenger
                              </p>
                              <p className="mt-1 font-black text-slate-900">
                                {booking.passengerName}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Journey Date
                              </p>
                              <p className="mt-1 flex items-center gap-1 font-black text-slate-900">
                                <CalendarDays className="h-4 w-4 text-red-600" />
                                {formatDate(booking.journeyDate)}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                Seats
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {booking.seats.length > 0 ? (
                                  booking.seats.map((seat) => (
                                    <span
                                      key={seat}
                                      className="rounded-lg bg-red-50 px-2 py-1 text-xs font-black text-red-600"
                                    >
                                      {seat}
                                    </span>
                                  ))
                                ) : (
                                  <span className="font-bold text-slate-500">
                                    N/A
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                              <div>
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                  From
                                </p>
                                <p className="mt-1 flex items-center gap-1 font-black text-slate-900">
                                  <MapPin className="h-4 w-4 text-red-600" />
                                  {booking.source}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {booking.departure}
                                </p>
                              </div>

                              <div className="hidden h-px w-20 border-t border-dashed border-slate-300 md:block" />

                              <div className="md:text-right">
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                                  To
                                </p>
                                <p className="mt-1 flex items-center gap-1 font-black text-slate-900 md:justify-end">
                                  <MapPin className="h-4 w-4 text-red-600" />
                                  {booking.destination}
                                </p>
                                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 md:justify-end">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {booking.arrival}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="w-full lg:w-72">
                          <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Amount
                            </p>

                            <h3 className="mt-1 flex items-center gap-1 text-3xl font-black text-red-600">
                              <IndianRupee className="h-7 w-7" />
                              {formatCurrency(booking.amount)}
                            </h3>

                            <div className="mt-5 space-y-3">
                              <button
                                type="button"
                                onClick={() => handleViewTicket(booking)}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
                              >
                                <Ticket className="h-4 w-4" />
                                View Ticket
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownload(booking)}
                                disabled={actionLoading === `download-${booking.id}`}
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                {actionLoading === `download-${booking.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Download
                              </button>

                              {booking.paymentStatus === "Paid" && booking.bookingStatus === "Confirmed" && (
    <button
      type="button"
      onClick={() => setReviewBooking(booking)}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-700 transition hover:bg-amber-100"
    >
      <Star className="h-4 w-4" />
      Rate Journey
    </button>
  )}

                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => handleCancel(booking)}
                                  disabled={actionLoading === `cancel-${booking.id}`}
                                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {actionLoading === `cancel-${booking.id}` ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <XCircle className="h-4 w-4" />
                                  )}
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {booking.paymentStatus === "Paid" &&
                      booking.bookingStatus === "Confirmed" && (
                        <div className="border-t border-green-100 bg-green-50 px-5 py-3 sm:px-6">
                          <p className="flex items-center gap-2 text-xs font-bold text-green-700">
                            <CheckCircle2 className="h-4 w-4" />
                            Ticket confirmed. Please carry a valid ID proof.
                          </p>
                        </div>
                      )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {reviewBooking && (
      <ReviewModal
        booking={reviewBooking}
        onClose={() => setReviewBooking(null)}
        onReviewSubmitted={() => {
          setReviewBooking(null);
          fetchBookings(); // Refresh bookings after review
        }}
      />
    )}
    </main>
  );
};

export default MyBookings;