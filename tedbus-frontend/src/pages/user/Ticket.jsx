import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
        passenger.seatNumber ||
        passenger.seatNo ||
        passenger.seat ||
        "N/A",
    }));
  }

  if (Array.isArray(booking?.passengers)) {
    return booking.passengers.map((passenger) => ({
      ...passenger,
      seatNumber:
        passenger.seatNumber ||
        passenger.seatNo ||
        passenger.seat ||
        "N/A",
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
        bus.arrival ||
        bus.arrivalTime ||
        bus.endTime ||
        booking.arrival ||
        "—",
      duration: bus.duration || booking.duration || "—",
    },

    journeyDate:
      booking.journeyDate ||
      bus.journeyDate ||
      booking.date ||
      "",

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

    orderId:
      booking.orderId ||
      booking.payment?.orderId ||
      "",
  };
};

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const stateBooking =
    location.state?.booking ||
    location.state?.bookingData ||
    null;

  const stateBookingId =
    location.state?.bookingId ||
    stateBooking?._id ||
    stateBooking?.id ||
    "";

  const queryBookingId =
    searchParams.get("bookingId") ||
    searchParams.get("id") ||
    "";

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
        response?.booking ||
        response?.data?.booking ||
        response?.data ||
        null;

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
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="h-[820px] animate-pulse rounded-[2rem] bg-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Ticket unavailable
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-600">
            {error || "Unable to load ticket details."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {bookingId && (
              <button
                type="button"
                onClick={fetchTicket}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry
              </button>
            )}

            <Link
              to="/my-bookings"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
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
    ticket.bookingStatus === "Confirmed" && ticket.paymentStatus === "Paid";

  return (
    <main className="min-h-screen bg-slate-50 py-10 print:bg-white">
      <div className="mx-auto max-w-4xl px-4">
        {/* Top Actions */}
        <div className="mb-6 flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
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
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        </div>

        {/* Ticket Card */}
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 print:border print:shadow-none">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6 text-white">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                  <TicketIcon className="h-4 w-4" />
                  TedBus E-Ticket
                </div>

                <h1 className="text-3xl font-black tracking-tight">
                  {ticket.busDetails.source} → {ticket.busDetails.destination}
                </h1>

                <p className="mt-2 text-sm font-semibold text-red-50">
                  PNR:{" "}
                  <span className="font-black text-white">{ticket.pnr}</span>
                </p>
              </div>

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white text-red-600 shadow-lg">
                <BusFront className="h-9 w-9" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div
            className={`border-b px-6 py-4 ${
              confirmed
                ? "border-green-100 bg-green-50"
                : "border-amber-100 bg-amber-50"
            }`}
          >
            <p
              className={`flex items-center gap-2 text-sm font-black ${
                confirmed ? "text-green-700" : "text-amber-700"
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              Booking Status: {ticket.bookingStatus} • Payment Status:{" "}
              {ticket.paymentStatus}
            </p>
          </div>

          {/* Journey */}
          <div className="border-b border-slate-100 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <MapPin className="h-5 w-5 text-red-600" />
              Journey Details
            </h2>

            <div className="grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  From
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {ticket.busDetails.source}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-500">
                  <Clock3 className="h-4 w-4 text-red-600" />
                  {ticket.busDetails.departure}
                </p>
              </div>

              <div className="flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-px w-24 bg-slate-300" />
                  <span className="my-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                    {ticket.busDetails.duration}
                  </span>
                  <div className="h-px w-24 bg-slate-300" />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 md:text-right">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  To
                </p>

                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  {ticket.busDetails.destination}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-500 md:justify-end">
                  <Clock3 className="h-4 w-4 text-red-600" />
                  {ticket.busDetails.arrival}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Journey Date
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800">
                  <CalendarDays className="h-4 w-4 text-red-600" />
                  {formatDate(ticket.journeyDate)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Boarding
                </p>

                <p className="mt-1 text-sm font-black text-slate-800">
                  {ticket.boardingPoint || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Dropping
                </p>

                <p className="mt-1 text-sm font-black text-slate-800">
                  {ticket.droppingPoint || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Bus Details */}
          <div className="border-b border-slate-100 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <BusFront className="h-5 w-5 text-red-600" />
              Bus Details
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Bus Name
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {ticket.busDetails.name}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Bus Type
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {ticket.busDetails.type}
                </p>
              </div>
            </div>
          </div>

          {/* Passengers */}
          <div className="border-b border-slate-100 p-6">
            <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
              <UserRound className="h-5 w-5 text-red-600" />
              Passenger Details
            </h2>

            <div className="space-y-3">
              {ticket.passengers.length > 0 ? (
                ticket.passengers.map((passenger, index) => (
                  <div
                    key={`${passenger.seatNumber}-${index}`}
                    className="grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-5"
                  >
                    <div className="md:col-span-2">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Name
                      </p>
                      <p className="mt-1 font-black text-slate-900">
                        {passenger.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Seat
                      </p>
                      <p className="mt-1 font-black text-red-600">
                        {passenger.seatNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Age
                      </p>
                      <p className="mt-1 font-black text-slate-900">
                        {passenger.age}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Gender
                      </p>
                      <p className="mt-1 font-black text-slate-900">
                        {passenger.gender}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                  Passenger details unavailable.
                </p>
              )}
            </div>
          </div>

          {/* Seat + Fare */}
          <div className="grid gap-0 border-b border-slate-100 md:grid-cols-2">
            <div className="border-b border-slate-100 p-6 md:border-b-0 md:border-r">
              <h2 className="mb-4 text-xl font-black text-slate-900">
                Seat Information
              </h2>

              <div className="flex flex-wrap gap-2">
                {ticket.seats.length > 0 ? (
                  ticket.seats.map((seat) => (
                    <span
                      key={seat}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"
                    >
                      {seat}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-semibold text-slate-500">
                    N/A
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <h2 className="mb-4 text-xl font-black text-slate-900">
                Payment Summary
              </h2>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-5">
                <span className="text-sm font-black text-slate-500">
                  Total Paid
                </span>

                <span className="flex items-center gap-1 text-3xl font-black text-red-600">
                  <IndianRupee className="h-7 w-7" />
                  {formatCurrency(ticket.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="border-b border-slate-100 p-6 text-center">
            <h2 className="font-black text-slate-900">
              Scan at Boarding Point
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              Show this ticket or PNR at boarding.
            </p>

            <div className="mx-auto mt-5 flex h-44 w-44 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <div className="text-center">
                <QrCode className="mx-auto h-20 w-20 text-slate-700" />
                <p className="mt-2 max-w-[150px] truncate text-xs font-bold text-slate-400">
                  {qrText}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-6">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Thank you for choosing TedBus. Have a safe journey!
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Ticket;