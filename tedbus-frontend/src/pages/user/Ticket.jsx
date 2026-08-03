import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  IndianRupee,
  Loader2,
  MapPin,
  Printer,
  QrCode,
  RefreshCcw,
  ShieldCheck,
  Ticket as TicketIcon,
  UserRound,
} from "lucide-react";
import { toast } from "react-toastify";

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

const normalizePassengerDetails = (booking) => {
  if (Array.isArray(booking?.passengerDetails)) {
    return booking.passengerDetails.map((passenger) => ({
      ...passenger,
      seatNumber:
        passenger.seatNumber || passenger.seatNo || passenger.seat || "N/A",
    }));
  }

  if (Array.isArray(booking?.passengers)) {
    return booking.passengers.map((passenger) => ({
      ...passenger,
      seatNumber:
        passenger.seatNumber || passenger.seatNo || passenger.seat || "N/A",
    }));
  }

  return [];
};

const getSeats = (booking) => {
  if (Array.isArray(booking?.seatNumbers) && booking.seatNumbers.length > 0) {
    return booking.seatNumbers;
  }

  return normalizePassengerDetails(booking)
    .map((passenger) => passenger.seatNumber)
    .filter(Boolean);
};

const normalizeBooking = (booking) => {
  if (!booking) return null;

  const bus = booking.bus || booking.busDetails || {};
  const passengers = normalizePassengerDetails(booking);
  const seats = getSeats(booking);

  return {
    ...booking,
    id: booking._id || booking.id,
    pnr: booking.pnr || "N/A",

    busDetails: {
      ...bus,
      name: bus.name || bus.busName || bus.operatorName || "TedBus Partner",
      type: bus.type || bus.busType || bus.category || "Standard Bus",
      source: bus.source || booking.source || "Source",
      destination: bus.destination || booking.destination || "Destination",
      departure:
        bus.departure ||
        bus.departureTime ||
        bus.startTime ||
        booking.departure ||
        "—",
      arrival:
        bus.arrival || bus.arrivalTime || bus.endTime || booking.arrival || "—",
      duration: bus.duration || booking.duration || "—",
    },

    journeyDate: booking.journeyDate || bus.journeyDate || booking.date || "",
    boardingPoint: booking.boardingPoint || "",
    droppingPoint: booking.droppingPoint || "",
    seats,
    passengers,

    totalAmount:
      booking.totalAmount ||
      booking.amount ||
      booking.fareBreakup?.totalAmount ||
      0,

    bookingStatus: booking.bookingStatus || "Pending",
    paymentStatus: booking.paymentStatus || "Pending",

    paymentId:
      booking.paymentId ||
      booking.razorpayPaymentId ||
      booking.payment?.paymentId ||
      "",

    orderId: booking.orderId || booking.payment?.orderId || "",
  };
};

const surfaceClass =
  "rounded-[24px] border border-slate-200/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.045]";

const softCardClass =
  "rounded-[20px] border border-slate-200/70 bg-slate-50/95 dark:border-white/10 dark:bg-[#0b1220]/80";

const labelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400";

const valueClass = "mt-1.5 text-sm font-semibold text-slate-900 dark:text-white";

const sectionTitleClass =
  "text-[15px] sm:text-base font-black text-slate-900 dark:text-white";

const monoClass = "font-mono tracking-wide";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateBooking =
    location.state?.booking || location.state?.bookingData || null;

  const stateBookingId =
    location.state?.bookingId || stateBooking?._id || stateBooking?.id || "";

  const queryBookingId =
    searchParams.get("bookingId") || searchParams.get("id") || "";

  const bookingId = stateBookingId || queryBookingId;

  const [ticket, setTicket] = useState(() => normalizeBooking(stateBooking));
  const [loading, setLoading] = useState(!stateBooking && Boolean(bookingId));
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const qrText = useMemo(() => {
    if (!ticket) return "";

    return JSON.stringify({
      pnr: ticket.pnr,
      bookingId: ticket.id,
      seats: ticket.seats,
      route: `${ticket.busDetails.source}-${ticket.busDetails.destination}`,
      date: ticket.journeyDate,
    });
  }, [ticket]);

  const fetchTicket = async () => {
    if (!bookingId) {
      setError("Booking ID missing. Please open ticket from My Bookings.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await bookingService.getSingleBooking(bookingId);

      const booking =
        response?.booking || response?.data?.booking || response?.data || null;

      const normalized = normalizeBooking(booking);

      if (!normalized) {
        throw new Error("Ticket not found");
      }

      setTicket(normalized);
    } catch (err) {
      setTicket(null);
      setError(err?.message || "Unable to load ticket");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ticket && bookingId) {
      fetchTicket();
    }

    if (!ticket && !bookingId) {
      setError("Booking ID missing. Please open ticket from My Bookings.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (!ticket?.id) {
      toast.error("Booking ID missing");
      return;
    }

    try {
      setDownloading(true);

      const blob = await bookingService.downloadTicket(ticket.id);

      const fileBlob =
        blob instanceof Blob
          ? blob
          : new Blob([blob], {
              type: "application/pdf",
            });

      const url = window.URL.createObjectURL(fileBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `TedBus-Ticket-${ticket.pnr || ticket.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Ticket downloaded successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to download ticket");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 py-8 print:bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1020]/80 p-4 shadow-2xl">
            <div className="h-[760px] animate-pulse rounded-[24px] bg-gradient-to-br from-[#12192d] via-[#141d35] to-[#25153d]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-[#050816] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[30px] border border-red-500/20 bg-red-500/10 p-8 text-center backdrop-blur-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />

          <h1 className="mt-4 text-2xl font-black text-white">
            Ticket unavailable
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-300">
            {error || "Unable to load ticket details."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {bookingId && (
              <button
                type="button"
                onClick={fetchTicket}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-3 text-sm font-black text-white transition hover:opacity-90"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry
              </button>
            )}

            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              My Bookings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const confirmed =
    ticket.bookingStatus?.toLowerCase() === "confirmed" &&
    ticket.paymentStatus?.toLowerCase() === "paid";

  const statusWrapClass = confirmed
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
    : "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200";

  const quickStats = [
    {
      label: "Journey Date",
      value: formatDate(ticket.journeyDate),
      icon: CalendarDays,
    },
    {
      label: "Departure",
      value: ticket.busDetails.departure || "—",
      icon: Clock3,
    },
    {
      label: "Bus Type",
      value: ticket.busDetails.type || "N/A",
      icon: BusFront,
    },
    {
      label: "Total Paid",
      value: `₹${formatCurrency(ticket.totalAmount)}`,
      icon: IndianRupee,
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] py-8 print:bg-white">
      <div className="pointer-events-none absolute inset-0 print:hidden">
        <div className="absolute left-[-80px] top-[-60px] h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute right-[-60px] top-32 h-80 w-80 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Top Actions */}
        <div className="mb-5 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-fuchsia-500/20 transition hover:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/10"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Ticket */}
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-white/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl dark:bg-[#0b1020]/88 print:border-slate-200 print:bg-white print:shadow-none">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#090f1f] via-[#121a33] to-[#291542] px-5 py-5 text-white sm:px-6">
            <div className="absolute right-[-50px] top-[-40px] h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute left-1/3 top-12 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="absolute bottom-[-40px] right-1/4 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white/90 backdrop-blur">
                    <TicketIcon className="h-4 w-4 text-cyan-300" />
                    TedBus E-Ticket
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusWrapClass}`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {ticket.bookingStatus} • {ticket.paymentStatus}
                  </span>
                </div>

                <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {ticket.busDetails.source}
                  <span className="mx-2 text-cyan-300">→</span>
                  {ticket.busDetails.destination}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-300 sm:text-sm">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    PNR:{" "}
                    <span className={`${monoClass} font-black text-white`}>
                      {ticket.pnr}
                    </span>
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    Booking ID:{" "}
                    <span className={`${monoClass} font-black text-white`}>
                      {ticket.id || "N/A"}
                    </span>
                  </span>

                  {ticket.paymentId && (
                    <span className="max-w-full truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                      Payment:{" "}
                      <span className={`${monoClass} font-black text-white`}>
                        {ticket.paymentId}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/10 shadow-lg shadow-cyan-500/10 backdrop-blur">
                <BusFront className="h-8 w-8 text-fuchsia-300" />
              </div>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
                      <Icon className="h-4 w-4 text-cyan-300" />
                      {item.label}
                    </div>
                    <p className="mt-2 text-sm font-black text-white">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 lg:p-6">
            {/* Journey */}
            <div className={`${surfaceClass} p-4 sm:p-5`}>
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-violet-500 dark:text-cyan-300" />
                <h2 className={sectionTitleClass}>Journey Overview</h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <div className={softCardClass + " p-4"}>
                  <p className={labelClass}>From</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {ticket.busDetails.source}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <Clock3 className="h-4 w-4 text-cyan-500 dark:text-cyan-300" />
                    {ticket.busDetails.departure}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex min-w-[160px] items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-slate-300 dark:via-slate-700 dark:to-slate-700" />
                    <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-700 dark:text-cyan-300">
                      {ticket.busDetails.duration}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-300 via-slate-300 to-transparent dark:from-slate-700 dark:via-slate-700" />
                  </div>
                </div>

                <div className={softCardClass + " p-4 lg:text-right"}>
                  <p className={labelClass}>To</p>
                  <h3 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {ticket.busDetails.destination}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:justify-end">
                    <Clock3 className="h-4 w-4 text-cyan-500 dark:text-cyan-300" />
                    {ticket.busDetails.arrival}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className={softCardClass + " p-4"}>
                  <p className={labelClass}>Boarding Point</p>
                  <p className={valueClass}>{ticket.boardingPoint || "N/A"}</p>
                </div>

                <div className={softCardClass + " p-4"}>
                  <p className={labelClass}>Dropping Point</p>
                  <p className={valueClass}>{ticket.droppingPoint || "N/A"}</p>
                </div>

                <div className={softCardClass + " p-4"}>
                  <p className={labelClass}>Operator</p>
                  <p className={valueClass}>{ticket.busDetails.name || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
              {/* Passenger Details */}
              <div className={`${surfaceClass} p-4 sm:p-5`}>
                <div className="mb-4 flex items-center gap-2">
                  <UserRound className="h-5 w-5 text-violet-500 dark:text-fuchsia-300" />
                  <h2 className={sectionTitleClass}>Passenger Details</h2>
                </div>

                <div className="space-y-3">
                  {ticket.passengers.length > 0 ? (
                    ticket.passengers.map((passenger, index) => (
                      <div
                        key={`${passenger.seatNumber}-${index}`}
                        className={softCardClass + " grid gap-3 p-4 sm:grid-cols-12"}
                      >
                        <div className="sm:col-span-5">
                          <p className={labelClass}>Name</p>
                          <p className={valueClass}>{passenger.name || "N/A"}</p>
                        </div>

                        <div className="sm:col-span-3">
                          <p className={labelClass}>Seat</p>
                          <p className="mt-1 inline-flex rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-3 py-1.5 text-xs font-black text-white shadow-sm">
                            {passenger.seatNumber || "N/A"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className={labelClass}>Age</p>
                          <p className={valueClass}>{passenger.age || "N/A"}</p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className={labelClass}>Gender</p>
                          <p className={valueClass}>
                            {passenger.gender || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p
                      className={
                        softCardClass +
                        " p-4 text-sm font-medium text-slate-500 dark:text-slate-400"
                      }
                    >
                      Passenger details unavailable.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="space-y-4">
                <div className={`${surfaceClass} p-4 sm:p-5`}>
                  <div className="mb-4 flex items-center gap-2">
                    <TicketIcon className="h-5 w-5 text-violet-500 dark:text-cyan-300" />
                    <h2 className={sectionTitleClass}>Seat Information</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {ticket.seats.length > 0 ? (
                      ticket.seats.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 px-3 py-2 text-xs font-black text-white shadow-sm"
                        >
                          {seat}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        N/A
                      </span>
                    )}
                  </div>
                </div>

                <div className={`${surfaceClass} p-4 sm:p-5`}>
                  <div className="mb-4 flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-violet-500 dark:text-emerald-300" />
                    <h2 className={sectionTitleClass}>Payment Summary</h2>
                  </div>

                  <div className="rounded-[20px] border border-cyan-500/15 bg-gradient-to-br from-cyan-500/10 via-white to-fuchsia-500/10 p-4 dark:from-cyan-500/10 dark:via-white/[0.02] dark:to-fuchsia-500/10">
                    <p className={labelClass}>Total Paid</p>

                    <div className="mt-2 flex items-center gap-1">
                      <IndianRupee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatCurrency(ticket.totalAmount)}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className={softCardClass + " p-3"}>
                        <p className={labelClass}>Booking Status</p>
                        <p className={valueClass}>{ticket.bookingStatus}</p>
                      </div>

                      <div className={softCardClass + " p-3"}>
                        <p className={labelClass}>Payment Status</p>
                        <p className={valueClass}>{ticket.paymentStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${surfaceClass} p-4 sm:p-5`}>
                  <div className="mb-4 flex items-center gap-2">
                    <QrCode className="h-5 w-5 text-violet-500 dark:text-fuchsia-300" />
                    <h2 className={sectionTitleClass}>Scan at Boarding</h2>
                  </div>

                  <div className="flex flex-col items-center rounded-[20px] border border-dashed border-violet-200 bg-slate-50 p-4 text-center dark:border-white/10 dark:bg-[#0b1220]/70">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
                      <QrCode className="h-14 w-14 text-slate-800 dark:text-slate-200" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Show this ticket or PNR at boarding.
                    </p>

                    <p className="mt-2 max-w-full truncate text-[11px] font-medium text-slate-400">
                      {qrText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 rounded-[20px] border border-emerald-500/15 bg-emerald-500/10 px-4 py-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Thank you for choosing TedBus. Have a safe and comfortable journey.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Ticket;