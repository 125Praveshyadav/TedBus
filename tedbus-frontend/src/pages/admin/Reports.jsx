import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  BusFront,
  CalendarDays,
  Download,
  IndianRupee,
  Loader2,
  Percent,
  RefreshCcw,
  Route,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const rangeOptions = [
  {
    label: "Last 7 Days",
    value: "7d",
  },
  {
    label: "Last 30 Days",
    value: "30d",
  },
  {
    label: "Last 90 Days",
    value: "90d",
  },
  {
    label: "Last 12 Months",
    value: "12m",
  },
];

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

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

const getMaxValue = (items, key) => {
  if (!items?.length) return 1;

  return Math.max(...items.map((item) => Number(item[key] || 0)), 1);
};

const Reports = () => {
  const [range, setRange] = useState("30d");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getReports({
        range,
      });

      setReport(response);
    } catch (err) {
      setError(err?.message || "Unable to load reports");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const summary = report?.summary || {};
  const charts = report?.charts || {};
  const topRoutes = report?.topRoutes || [];
  const topBuses = report?.topBuses || [];
  const recentBookings = report?.recentBookings || [];

  const revenueTrend = charts.revenueTrend || [];
  const bookingTrend = charts.bookingTrend || [];
  const paymentStatusStats = charts.paymentStatusStats || [];
  const bookingStatusStats = charts.bookingStatusStats || [];

  const exportCsv = () => {
    if (!report) {
      toast.info("No report data to export");
      return;
    }

    const rows = [
      ["Metric", "Value"],
      ["Total Bookings", summary.totalBookings || 0],
      ["Paid Bookings", summary.paidBookings || 0],
      ["Pending Bookings", summary.pendingBookings || 0],
      ["Cancelled Bookings", summary.cancelledBookings || 0],
      ["Failed Payments", summary.failedPayments || 0],
      ["Total Revenue", summary.totalRevenue || 0],
      ["Average Booking Value", summary.averageBookingValue || 0],
      ["Conversion Rate", `${summary.conversionRate || 0}%`],
      ["Cancellation Rate", `${summary.cancellationRate || 0}%`],
    ];

    const csvContent = rows
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
    link.download = `tedbus-report-${range}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <BarChart3 className="h-8 w-8 text-red-600" />
            Reports & Analytics
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Track revenue, bookings, payments, routes and performance insights.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
          >
            {rangeOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
          <h2 className="mt-3 text-xl font-black text-slate-900">
            Unable to load reports
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {!error && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title="Total Revenue"
              value={`₹${formatCurrency(summary.totalRevenue)}`}
              icon={IndianRupee}
              color="red"
              subtitle="Paid booking revenue"
            />

            <ReportCard
              title="Total Bookings"
              value={summary.totalBookings || 0}
              icon={Ticket}
              color="blue"
              subtitle="Bookings in selected range"
            />

            <ReportCard
              title="Conversion Rate"
              value={`${summary.conversionRate || 0}%`}
              icon={Percent}
              color="green"
              subtitle="Paid vs total bookings"
            />

            <ReportCard
              title="Avg Booking Value"
              value={`₹${formatCurrency(summary.averageBookingValue)}`}
              icon={TrendingUp}
              color="amber"
              subtitle="Average paid booking"
            />
          </div>

          {/* Secondary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat
              title="Paid Bookings"
              value={summary.paidBookings || 0}
              color="green"
            />
            <MiniStat
              title="Pending Bookings"
              value={summary.pendingBookings || 0}
              color="amber"
            />
            <MiniStat
              title="Cancelled"
              value={summary.cancelledBookings || 0}
              color="red"
            />
            <MiniStat
              title="Failed Payments"
              value={summary.failedPayments || 0}
              color="red"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 xl:grid-cols-2">
            <BarChart
              title="Revenue Trend"
              subtitle="Revenue generated over selected range"
              data={revenueTrend}
              valueKey="revenue"
              labelKey="_id"
              color="red"
              currency
            />

            <BarChart
              title="Booking Trend"
              subtitle="Bookings created over selected range"
              data={bookingTrend}
              valueKey="bookings"
              labelKey="_id"
              color="slate"
            />
          </div>

          {/* Status Charts */}
          <div className="grid gap-6 xl:grid-cols-2">
            <StatusBreakdown
              title="Payment Status"
              items={paymentStatusStats}
              colorMap={{
                Paid: "bg-green-500",
                Pending: "bg-amber-500",
                Failed: "bg-red-500",
              }}
            />

            <StatusBreakdown
              title="Booking Status"
              items={bookingStatusStats}
              colorMap={{
                Confirmed: "bg-green-500",
                Pending: "bg-amber-500",
                Cancelled: "bg-red-500",
                Expired: "bg-slate-500",
              }}
            />
          </div>

          {/* Top Tables */}
          <div className="grid gap-6 xl:grid-cols-2">
            <TopRoutesTable routes={topRoutes} />
            <TopBusesTable buses={topBuses} />
          </div>

          {/* Recent Bookings */}
          <RecentBookingsTable bookings={recentBookings} />
        </>
      )}
    </div>
  );
};

const ReportCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colors = {
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </h3>
          <p className="mt-2 text-xs font-semibold text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            colors[color]
          }`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ title, value, color }) => {
  const colors = {
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
        className={`mt-2 rounded-2xl px-3 py-2 text-2xl font-black ${
          colors[color] || "bg-slate-50 text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

const BarChart = ({
  title,
  subtitle,
  data = [],
  valueKey,
  labelKey,
  color = "red",
  currency = false,
}) => {
  const maxValue = getMaxValue(data, valueKey);

  const barColor = color === "red" ? "bg-red-500" : "bg-slate-900";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>

      <div className="mt-6 flex h-72 items-end gap-3 overflow-x-auto">
        {data.length > 0 ? (
          data.map((item) => {
            const value = Number(item[valueKey] || 0);
            const height = Math.max((value / maxValue) * 220, 8);

            return (
              <div
                key={item[labelKey]}
                className="flex min-w-[48px] flex-1 flex-col items-center justify-end gap-2"
              >
                <p className="text-[10px] font-black text-slate-500">
                  {currency ? `₹${formatCurrency(value)}` : value}
                </p>

                <div
                  className={`w-full rounded-t-xl ${barColor}`}
                  style={{
                    height: `${height}px`,
                  }}
                />

                <span className="text-[10px] font-bold text-slate-400">
                  {String(item[labelKey]).slice(5)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
            No chart data available
          </div>
        )}
      </div>
    </div>
  );
};

const StatusBreakdown = ({ title, items = [], colorMap = {} }) => {
  const total = items.reduce((sum, item) => sum + Number(item.count || 0), 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-500">
        Distribution by status
      </p>

      <div className="mt-6 space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const percentage =
              total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={item._id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-black text-slate-700">
                    {item._id || "Unknown"}
                  </span>
                  <span className="font-bold text-slate-500">
                    {item.count} ({percentage}%)
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      colorMap[item._id] || "bg-slate-500"
                    }`}
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm font-bold text-slate-400">
            No status data available
          </div>
        )}
      </div>
    </div>
  );
};

const TopRoutesTable = ({ routes = [] }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <Route className="h-5 w-5 text-red-600" />
          Top Routes
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Route</th>
              <th className="px-6 py-4">Bookings</th>
              <th className="px-6 py-4">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {routes.length > 0 ? (
              routes.map((route, index) => (
                <tr key={index} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-black text-slate-900">
                    {route._id?.source} → {route._id?.destination}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {route.bookings}
                  </td>
                  <td className="px-6 py-4 font-black text-red-600">
                    ₹{formatCurrency(route.revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center font-semibold text-slate-400"
                >
                  No route analytics
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TopBusesTable = ({ buses = [] }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <BusFront className="h-5 w-5 text-red-600" />
          Top Buses
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">Bus</th>
              <th className="px-6 py-4">Bookings</th>
              <th className="px-6 py-4">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {buses.length > 0 ? (
              buses.map((bus) => (
                <tr key={bus._id} className="border-t border-slate-100">
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-900">
                      {bus.busName || "Bus"}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {bus.busNumber || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {bus.bookings}
                  </td>
                  <td className="px-6 py-4 font-black text-red-600">
                    ₹{formatCurrency(bus.revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-10 text-center font-semibold text-slate-400"
                >
                  No bus analytics
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const RecentBookingsTable = ({ bookings = [] }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <Ticket className="h-5 w-5 text-red-600" />
          Recent Bookings
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">PNR</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Bus</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-black text-slate-900">
                    {booking.pnr || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">
                      {booking.user?.name || "User"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {booking.user?.email || "N/A"}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {booking.bus?.busName || "Bus"}
                  </td>
                  <td className="px-6 py-4 font-black text-red-600">
                    ₹{formatCurrency(booking.totalAmount)}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">
                    {formatDate(booking.createdAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center font-semibold text-slate-400"
                >
                  No recent bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;