import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  IndianRupee,
  Loader2,
  RefreshCcw,
  Search,
  Ticket,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const paymentStatusOptions = ["all", "Paid", "Pending", "Failed"];

const paymentClass = {
  Paid: "bg-green-50 text-green-700 border-green-100",
  Pending: "bg-amber-50 text-amber-700 border-amber-100",
  Failed: "bg-red-50 text-red-700 border-red-100",
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatDateTime = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizePayment = (payment = {}) => {
  const booking = payment.booking || {};
  const user = payment.user || booking.user || {};
  const bus = booking.bus || {};

  const amount =
    payment.amount ||
    payment.totalAmount ||
    booking.totalAmount ||
    booking.fareBreakup?.totalAmount ||
    0;

  const status =
    payment.paymentStatus ||
    payment.status ||
    booking.paymentStatus ||
    "Pending";

  return {
    ...payment,

    id: payment._id || payment.id || booking._id || booking.id,

    bookingId: booking._id || booking.id || payment.bookingId || "N/A",
    pnr: booking.pnr || payment.pnr || "N/A",

    userName: user.name || "User",
    userEmail: user.email || "N/A",
    userPhone: user.phone || "N/A",

    busName:
      bus.busName ||
      bus.name ||
      bus.operatorName ||
      "TedBus Partner",

    source: bus.source || "Source",
    destination: bus.destination || "Destination",

    amount,

    paymentStatus: status,

    paymentId:
      payment.paymentId ||
      payment.razorpayPaymentId ||
      booking.paymentId ||
      booking.razorpayPaymentId ||
      "N/A",

    orderId:
      payment.orderId ||
      booking.orderId ||
      "N/A",

    paymentSignature:
      payment.paymentSignature ||
      booking.paymentSignature ||
      "",

    paymentTime:
      payment.paymentTime ||
      booking.paymentTime ||
      payment.updatedAt ||
      booking.updatedAt ||
      payment.createdAt ||
      booking.createdAt ||
      "",
  };
};

const ManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getPayments();

      const apiPayments =
        response?.payments ||
        response?.data?.payments ||
        [];

      const normalized = Array.isArray(apiPayments)
        ? apiPayments.map(normalizePayment)
        : [];

      setPayments(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load payments");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (statusFilter !== "all") {
      result = result.filter(
        (payment) => payment.paymentStatus === statusFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((payment) => {
        return (
          payment.pnr?.toLowerCase().includes(query) ||
          payment.bookingId?.toLowerCase().includes(query) ||
          payment.paymentId?.toLowerCase().includes(query) ||
          payment.orderId?.toLowerCase().includes(query) ||
          payment.userName?.toLowerCase().includes(query) ||
          payment.userEmail?.toLowerCase().includes(query) ||
          payment.busName?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [payments, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const paidPayments = payments.filter((p) => p.paymentStatus === "Paid");
    const pendingPayments = payments.filter((p) => p.paymentStatus === "Pending");
    const failedPayments = payments.filter((p) => p.paymentStatus === "Failed");

    return {
      total: payments.length,
      paid: paidPayments.length,
      pending: pendingPayments.length,
      failed: failedPayments.length,
      revenue: paidPayments.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      ),
    };
  }, [payments]);

  const exportCsv = () => {
    if (filteredPayments.length === 0) {
      toast.info("No payments to export");
      return;
    }

    const headers = [
      "PNR",
      "Booking ID",
      "User",
      "Email",
      "Payment ID",
      "Order ID",
      "Amount",
      "Status",
      "Payment Time",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.pnr,
      payment.bookingId,
      payment.userName,
      payment.userEmail,
      payment.paymentId,
      payment.orderId,
      payment.amount,
      payment.paymentStatus,
      formatDateTime(payment.paymentTime),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tedbus-payments.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    toast.success("Payments exported successfully");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading payments...
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
            Manage Payments
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Track Razorpay orders, payment status and revenue.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={fetchPayments}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Payments" value={stats.total} />
        <StatCard title="Paid" value={stats.paid} color="green" />
        <StatCard title="Pending" value={stats.pending} color="amber" />
        <StatCard title="Failed" value={stats.failed} color="red" />
        <StatCard
          title="Revenue"
          value={`₹${formatCurrency(stats.revenue)}`}
          color="red"
        />
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
              placeholder="Search PNR, payment ID, order ID, user..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : status}
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
            Unable to load payments
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!error && filteredPayments.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <CreditCard className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No payments found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Payments will appear here after successful orders.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredPayments.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Booking</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => {
                  const paymentStatusClass =
                    paymentClass[payment.paymentStatus] ||
                    "bg-slate-100 text-slate-600 border-slate-200";

                  return (
                    <tr
                      key={payment.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-black text-slate-900">
                          {payment.paymentId}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          Order: {payment.orderId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-black text-slate-900">
                          {payment.userName}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {payment.userEmail}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-black text-slate-900">
                          PNR: {payment.pnr}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {payment.bookingId}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">
                          {payment.source} → {payment.destination}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {payment.busName}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1 font-black text-red-600">
                          <IndianRupee className="h-4 w-4" />
                          {formatCurrency(payment.amount)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-black ${paymentStatusClass}`}
                        >
                          {payment.paymentStatus === "Paid" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : payment.paymentStatus === "Failed" ? (
                            <XCircle className="h-3.5 w-3.5" />
                          ) : (
                            <CreditCard className="h-3.5 w-3.5" />
                          )}
                          {payment.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1 font-bold text-slate-700">
                          <CalendarDays className="h-4 w-4 text-red-600" />
                          {formatDateTime(payment.paymentTime)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
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

const PaymentDetailsModal = ({ payment, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Payment Details
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Payment ID: {payment.paymentId}
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
              <CreditCard className="h-5 w-5 text-red-600" />
              Transaction
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Payment ID" value={payment.paymentId} />
              <Info label="Order ID" value={payment.orderId} />
              <Info label="Status" value={payment.paymentStatus} />
              <Info label="Time" value={formatDateTime(payment.paymentTime)} />
            </div>
          </section>

          <section className="rounded-3xl bg-slate-50 p-5">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-900">
              <UserRound className="h-5 w-5 text-red-600" />
              User
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Name" value={payment.userName} />
              <Info label="Email" value={payment.userEmail} />
              <Info label="Phone" value={payment.userPhone} />
            </div>
          </section>

          <section className="rounded-3xl bg-red-50 p-5">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              Amount
            </h3>

            <div className="flex items-center justify-between">
              <span className="font-black text-slate-700">Paid Amount</span>
              <span className="text-3xl font-black text-red-600">
                ₹{formatCurrency(payment.amount)}
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
    <p className="mt-1 break-all font-black text-slate-900">
      {value || "N/A"}
    </p>
  </div>
);

export default ManagePayments;