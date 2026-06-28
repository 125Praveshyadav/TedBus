import { useEffect, useState } from "react";
import {
  Bus,
  CalendarDays,
  IndianRupee,
  Loader2,
  Map,
  RefreshCcw,
  Ticket,
  Users,
} from "lucide-react";

import DashboardCard from "../../components/admin/DashboardCard";
import adminService from "../../services/adminService";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getDashboard();

      setDashboard(response);
    } catch (err) {
      setError(err?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
        <h2 className="text-xl font-black text-slate-900">
          Dashboard unavailable
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          {error}
        </p>
        <button
          onClick={fetchDashboard}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
        >
          <RefreshCcw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const recentBookings = dashboard?.recentBookings || [];
  const recentUsers = dashboard?.recentUsers || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Overview of TedBus platform performance.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={Users}
          color="blue"
          subtitle="Registered users"
        />

        <DashboardCard
          title="Total Buses"
          value={stats.totalBuses || 0}
          icon={Bus}
          color="red"
          subtitle="Available fleet"
        />

        <DashboardCard
          title="Total Bookings"
          value={stats.totalBookings || 0}
          icon={Ticket}
          color="green"
          subtitle="All-time bookings"
        />

        <DashboardCard
          title="Total Revenue"
          value={`₹${formatCurrency(stats.totalRevenue)}`}
          icon={IndianRupee}
          color="amber"
          subtitle="Paid bookings revenue"
        />

        <DashboardCard
          title="Today's Bookings"
          value={stats.todaysBookings || 0}
          icon={CalendarDays}
          color="purple"
          subtitle="Bookings created today"
        />

        <DashboardCard
          title="Active Routes"
          value={stats.activeRoutes || 0}
          icon={Map}
          color="slate"
          subtitle="Currently active routes"
        />
      </div>

      {/* Charts Placeholder */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Revenue Chart
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Last 30 days revenue
          </p>

          <div className="mt-6 flex h-72 items-end gap-3">
            {(dashboard?.charts?.revenueChart || []).length > 0 ? (
              dashboard.charts.revenueChart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t-xl bg-red-500"
                    style={{
                      height: `${Math.max(item.revenue / 1000, 8)}px`,
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">
                    {item._id.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                No revenue data available
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">
            Booking Chart
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Last 7 days bookings
          </p>

          <div className="mt-6 flex h-72 items-end gap-3">
            {(dashboard?.charts?.bookingChart || []).length > 0 ? (
              dashboard.charts.bookingChart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <div
                    className="w-full rounded-t-xl bg-slate-900"
                    style={{
                      height: `${Math.max(item.bookings * 18, 8)}px`,
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400">
                    {item._id.slice(5)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400">
                No booking data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Bookings */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-black text-slate-900">
              Recent Bookings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">PNR</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {booking.pnr || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {booking.user?.name || "User"}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600">
                        ₹{formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                          {booking.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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

        {/* Recent Users */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h2 className="text-xl font-black text-slate-900">
              Recent Users
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                          {user.role || "user"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center font-semibold text-slate-400"
                    >
                      No recent users
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;