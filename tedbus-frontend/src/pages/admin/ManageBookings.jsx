import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  IndianRupee,
  Loader2,
  MapPin,
  RefreshCcw,
  Search,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const bookingStatusOptions = ["Pending", "Confirmed", "Cancelled", "Expired"];
const paymentStatusOptions = ["Pending", "Paid", "Failed"];

const statusClass = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Confirmed: "bg-green-50 text-green-700 border-green-100",
  Cancelled: "bg-red-50 text-red-700 border-red-100",
  Expired: "bg-slate-100 text-slate-600 border-slate-200",
};

const paymentClass = {
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Paid: "bg-green-50 text-green-700 border-green-100",
  Failed: "bg-red-50 text-red-700 border-red-100",
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getSeats = (booking) => {
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

const normalizeBooking = (booking = {}) => {
  const bus = booking.bus || {};
  const user = booking.user || {};

  const seats = getSeats(booking);

  return {
    ...booking,
    id: booking._id || booking.id,

    pnr: booking.pnr || "N/A",

    userName: user.name || "User",
    userEmail: user.email || "N/A",
    userPhone: user.phone || "N/A",

    busName: bus.busName || bus.name || bus.operatorName || "TedBus Partner",
    busNumber: bus.busNumber || "N/A",
    busType: bus.busType || bus.type || "Standard",

    source: bus.source || "Source",
    destination: bus.destination || "Destination",
    departureTime: bus.departureTime || bus.departure || "—",
    arrivalTime: bus.arrivalTime || bus.arrival || "—",
    duration: bus.duration || "—",

    journeyDate: booking.journeyDate || bus.journeyDate || "",

    seats,

    totalAmount: booking.totalAmount || booking.fareBreakup?.totalAmount || 0,

    bookingStatus: booking.bookingStatus || "Pending",
    paymentStatus: booking.paymentStatus || "Pending",
  };
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getBookings();

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

    if (bookingFilter !== "all") {
      result = result.filter(
        (booking) => booking.bookingStatus === bookingFilter
      );
    }

    if (paymentFilter !== "all") {
      result = result.filter(
        (booking) => booking.paymentStatus === paymentFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((booking) => {
        return (
          booking.pnr?.toLowerCase().includes(query) ||
          booking.userName?.toLowerCase().includes(query) ||
          booking.userEmail?.toLowerCase().includes(query) ||
          booking.busName?.toLowerCase().includes(query) ||
          booking.busNumber?.toLowerCase().includes(query) ||
          booking.source?.toLowerCase().includes(query) ||
          booking.destination?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [bookings, bookingFilter, paymentFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.bookingStatus === "Confirmed").length,
      pending: bookings.filter((b) => b.bookingStatus === "Pending").length,
      cancelled: bookings.filter((b) => b.bookingStatus === "Cancelled").length,
      paid: bookings.filter((b) => b.paymentStatus === "Paid").length,
      revenue: bookings
        .filter((b) => b.paymentStatus === "Paid")
        .reduce((total, item) => total + Number(item.totalAmount || 0), 0),
    };
  }, [bookings]);

  const handleUpdateBooking = async (bookingId, payload) => {
    try {
      setUpdatingId(bookingId);

      const response = await adminService.updateBooking(bookingId, payload);

      const updated =
        response?.booking ||
        response?.data?.booking ||
        null;

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? normalizeBooking(updated || { ...booking, ...payload })
            : booking
        )
      );

      toast.success(response?.message || "Booking updated successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to update booking");
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading bookings...
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
            Manage Bookings
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            View, filter and update all TedBus bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBookings}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Total" value={stats.total} />
        <StatCard title="Confirmed" value={stats.confirmed} color="green" />
        <StatCard title="Pending" value={stats.pending} color="amber" />
        <StatCard title="Cancelled" value={stats.cancelled} color="red" />
        <StatCard title="Paid" value={stats.paid} color="green" />
        <StatCard
          title="Revenue"
          value={`₹${formatCurrency(stats.revenue)}`}
          color="red"
        />
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search PNR, user, bus, route..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <select
            value={bookingFilter}
            onChange={(e) => setBookingFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            <option value="all">All Booking Status</option>
            {bookingStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            <option value="all">All Payment Status</option>
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
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
            Unable to load bookings
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!error && filteredBookings.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Ticket className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No bookings found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Try changing filters or search query.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredBookings.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Bus / Route</th>
                  <th className="px-6 py-4">Journey</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Booking Status</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {booking.pnr}
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        ID: {booking.id}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {booking.userName}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {booking.userEmail}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">
                        {booking.busName}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {booking.source} → {booking.destination}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {formatDate(booking.journeyDate)}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {booking.departureTime} - {booking.arrivalTime}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
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
                          <span className="font-bold text-slate-400">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-black text-red-600">
                        <IndianRupee className="h-4 w-4" />
                        {formatCurrency(booking.totalAmount)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={booking.bookingStatus}
                        disabled={updatingId === booking.id}
                        onChange={(e) =>
                          handleUpdateBooking(booking.id, {
                            bookingStatus: e.target.value,
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-black outline-none ${
                          statusClass[booking.bookingStatus] ||
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {bookingStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <select
                        value={booking.paymentStatus}
                        disabled={updatingId === booking.id}
                        onChange={(e) =>
                          handleUpdateBooking(booking.id, {
                            paymentStatus: e.target.value,
                          })
                        }
                        className={`rounded-xl border px-3 py-2 text-xs font-black outline-none ${
                          paymentClass[booking.paymentStatus] ||
                          "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {paymentStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {updatingId === booking.id && (
                          <Loader2 className="mt-3 h-4 w-4 animate-spin text-red-600" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
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
    <div className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm`}>
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 rounded-2xl px-3 py-2 text-2xl font-black ${
          colors[color]
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const BookingDetailsModal = ({ booking, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Booking Details
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              PNR: {booking.pnr}
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
          {/* User */}
          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <UserRound className="h-5 w-5 text-red-600" />
              User Details
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Name" value={booking.userName} />
              <Info label="Email" value={booking.userEmail} />
              <Info label="Phone" value={booking.userPhone} />
            </div>
          </section>

          {/* Journey */}
          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <BusFront className="h-5 w-5 text-red-600" />
              Journey Details
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Bus" value={booking.busName} />
              <Info label="Bus Number" value={booking.busNumber} />
              <Info label="Bus Type" value={booking.busType} />
              <Info label="Source" value={booking.source} />
              <Info label="Destination" value={booking.destination} />
              <Info label="Journey Date" value={formatDate(booking.journeyDate)} />
              <Info label="Departure" value={booking.departureTime} />
              <Info label="Arrival" value={booking.arrivalTime} />
              <Info label="Duration" value={booking.duration} />
            </div>
          </section>

          {/* Seats */}
          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <Ticket className="h-5 w-5 text-red-600" />
              Seats
            </h3>

            <div className="flex flex-wrap gap-2">
              {booking.seats.map((seat) => (
                <span
                  key={seat}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black text-white"
                >
                  {seat}
                </span>
              ))}
            </div>
          </section>

          {/* Amount */}
          <section className="rounded-3xl bg-red-50 p-5">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Payment Summary
            </h3>

            <div className="flex items-center justify-between">
              <span className="font-black text-slate-700">Total Amount</span>
              <span className="text-3xl font-black text-red-600">
                ₹{formatCurrency(booking.totalAmount)}
              </span>
            </div>
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

export default ManageBookings;