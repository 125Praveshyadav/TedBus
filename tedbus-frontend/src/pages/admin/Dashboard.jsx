import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bus,
  CalendarDays,
  IndianRupee,
  Map,
  RefreshCcw,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

import adminService from "../../services/adminService";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatNumber = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    const safeTarget = Number(target) || 0;
    fromRef.current = value;
    startRef.current = null;

    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const next =
        fromRef.current +
        (safeTarget - fromRef.current) * eased;

      setValue(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setValue(safeTarget);
      }
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current)
        cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
};

const STAT_THEMES = {
  blue: {
    gradient: "from-blue-600 to-indigo-500",
    soft: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/10 dark:ring-blue-500/15",
    glow: "bg-blue-400/30",
  },
  red: {
    gradient: "from-red-600 to-orange-500",
    soft: "bg-red-50 dark:bg-red-950/40",
    text: "text-red-600 dark:text-red-400",
    ring: "ring-red-500/10 dark:ring-red-500/15",
    glow: "bg-red-400/30",
  },
  green: {
    gradient: "from-emerald-600 to-teal-500",
    soft: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/10 dark:ring-emerald-500/15",
    glow: "bg-emerald-400/30",
  },
  amber: {
    gradient: "from-amber-500 to-orange-500",
    soft: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/10 dark:ring-amber-500/15",
    glow: "bg-amber-400/30",
  },
  purple: {
    gradient: "from-purple-600 to-fuchsia-500",
    soft: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-500/10 dark:ring-purple-500/15",
    glow: "bg-purple-400/30",
  },
  slate: {
    gradient: "from-slate-700 to-slate-500",
    soft: "bg-slate-100 dark:bg-slate-800/60",
    text: "text-slate-600 dark:text-slate-300",
    ring: "ring-slate-500/10 dark:ring-slate-500/15",
    glow: "bg-slate-400/30",
  },
};

const STATUS_STYLES = {
  confirmed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  paid: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  processing: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  cancelled: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
  failed: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

const getStatusStyle = (status) => {
  const key = String(status || "").toLowerCase();
  return (
    STATUS_STYLES[key] ||
    "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
  );
};

const AVATAR_GRADIENTS = [
  "from-red-500 to-orange-400",
  "from-blue-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-purple-500 to-fuchsia-400",
  "from-amber-500 to-orange-400",
  "from-slate-600 to-slate-400",
];

const getAvatarGradient = (seed) => {
  const str = String(seed || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[
    Math.abs(hash) % AVATAR_GRADIENTS.length
  ];
};

const getInitials = (name) => {
  const parts = String(name || "?").trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return initials.toUpperCase() || "?";
};

/* ------------------------------------------------------------------ */
/* Stat card                                                           */
/* ------------------------------------------------------------------ */

const StatCard = ({
  title,
  subtitle,
  icon: Icon,
  color,
  rawValue,
  prefix = "",
  format = formatNumber,
  delay = 0,
}) => {
  const theme = STAT_THEMES[color] || STAT_THEMES.slate;
  const animated = useCountUp(rawValue, 1000);

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm [animation-fill-mode:forwards] [animation:fadeSlideUp_0.6s_ease-out_forwards] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${theme.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg ring-8 ${theme.ring} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
        >
          <Icon className="h-5.5 w-5.5" />
        </div>

        <span
          className={`rounded-full ${theme.soft} px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${theme.text}`}
        >
          Live
        </span>
      </div>

      <p className="relative mt-5 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {title}
      </p>

      <p className="relative mt-1 text-3xl font-black tracking-tight text-slate-900 tabular-nums dark:text-white">
        {prefix}
        {format(animated)}
      </p>

      <p className="relative mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {subtitle}
      </p>

      <div
        className={`absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${theme.gradient} transition-transform duration-500 group-hover:scale-x-100`}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

const ShimmerBlock = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/70 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:shimmer_1.4s_infinite] dark:via-white/10" />
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-2">
      <ShimmerBlock className="h-8 w-48" />
      <ShimmerBlock className="h-4 w-72" />
    </div>

    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ShimmerBlock key={i} className="h-[168px] rounded-3xl" />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <ShimmerBlock className="h-96 rounded-3xl" />
      <ShimmerBlock className="h-96 rounded-3xl" />
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <ShimmerBlock className="h-80 rounded-3xl" />
      <ShimmerBlock className="h-80 rounded-3xl" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Chart                                                                */
/* Fixed: bars were collapsing to zero height because the flex row     */
/* used items-end (no stretch), so the h-full track never resolved     */
/* to a real pixel height. Now the row uses items-stretch and each     */
/* bar's track uses flex-1, so percentage heights always work.         */
/* ------------------------------------------------------------------ */

const BarChart = ({ data, dataKey, labelKey, barGradient, emptyLabel, valuePrefix = "" }) => {
  const max = useMemo(() => {
    const values = data.map((d) => Number(d[dataKey]) || 0);
    return Math.max(...values, 1);
  }, [data, dataKey]);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-2xl bg-slate-50 text-sm font-bold text-slate-400 dark:bg-slate-800/40 dark:text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="relative mt-6 h-72">
      {/* Grid lines */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[calc(100%-22px)] flex-col justify-between">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-t border-dashed border-slate-100 dark:border-slate-800/70"
          />
        ))}
      </div>

      {/* Bars */}
      <div className="relative flex h-full items-stretch gap-2.5 sm:gap-3">
        {data.map((item, index) => {
          const value = Number(item[dataKey]) || 0;
          const heightPct = Math.max((value / max) * 100, 4);

          return (
            <div
              key={item._id || index}
              className="group/bar relative flex flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-black text-white opacity-0 shadow-lg transition-all duration-200 group-hover/bar:translate-y-0 group-hover/bar:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                {valuePrefix}
                {formatNumber(value)}
              </div>

              <div className="relative w-full flex-1 overflow-hidden rounded-t-xl bg-slate-100/70 dark:bg-slate-800/40">
                <div
                  className={`absolute bottom-0 w-full origin-bottom rounded-t-xl bg-gradient-to-t ${barGradient} shadow-sm [animation:growBar_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] transition-[filter] duration-200 group-hover/bar:brightness-110`}
                  style={{
                    height: `${heightPct}%`,
                    animationDelay: `${index * 45}ms`,
                  }}
                />
              </div>

              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {String(item[labelKey] || "").slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Dashboard                                                            */
/* ------------------------------------------------------------------ */

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async ({ silent = false } = {}) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      setError("");

      const response = await adminService.getDashboard();

      setDashboard(response);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "Unable to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <>
        <GlobalKeyframes />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <GlobalKeyframes />
        <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-red-50 p-8 text-center [animation:scaleIn_0.4s_ease-out_forwards] dark:border-red-900/40 dark:bg-red-950/20">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />
          <h2 className="relative text-xl font-black text-slate-900 dark:text-white">
            Dashboard unavailable
          </h2>
          <p className="relative mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
            {error}
          </p>
          <button
            onClick={() => fetchDashboard()}
            className="relative mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </>
    );
  }

  const stats = dashboard?.stats || {};
  const recentBookings = dashboard?.recentBookings || [];
  const recentUsers = dashboard?.recentUsers || [];

  return (
    <div className="space-y-8">
      <GlobalKeyframes />

      {/* Page Header */}
      <div className="flex flex-col gap-4 opacity-0 [animation:fadeSlideUp_0.5s_ease-out_forwards] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <TrendingUp className="h-3 w-3" />
            Platform overview
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Overview of TedBus platform performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}

          <button
            type="button"
            onClick={() => fetchDashboard({ silent: true })}
            disabled={refreshing}
            className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/20 dark:hover:text-red-400"
          >
            <RefreshCcw
              className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Users"
          rawValue={stats.totalUsers || 0}
          icon={Users}
          color="blue"
          subtitle="Registered users"
          delay={0}
        />

        <StatCard
          title="Total Buses"
          rawValue={stats.totalBuses || 0}
          icon={Bus}
          color="red"
          subtitle="Available fleet"
          delay={60}
        />

        <StatCard
          title="Total Bookings"
          rawValue={stats.totalBookings || 0}
          icon={Ticket}
          color="green"
          subtitle="All-time bookings"
          delay={120}
        />

        <StatCard
          title="Total Revenue"
          rawValue={stats.totalRevenue || 0}
          prefix="₹"
          format={formatCurrency}
          icon={IndianRupee}
          color="amber"
          subtitle="Paid bookings revenue"
          delay={180}
        />

        <StatCard
          title="Today's Bookings"
          rawValue={stats.todaysBookings || 0}
          icon={CalendarDays}
          color="purple"
          subtitle="Bookings created today"
          delay={240}
        />

        <StatCard
          title="Active Routes"
          rawValue={stats.activeRoutes || 0}
          icon={Map}
          color="slate"
          subtitle="Currently active routes"
          delay={300}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm [animation-delay:200ms] [animation:fadeSlideUp_0.6s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Revenue Chart
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Last 30 days revenue
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <IndianRupee className="h-4.5 w-4.5" />
            </div>
          </div>

          <BarChart
            data={dashboard?.charts?.revenueChart || []}
            dataKey="revenue"
            labelKey="_id"
            barGradient="from-red-600 to-orange-400"
            emptyLabel="No revenue data available"
            valuePrefix="₹"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 opacity-0 shadow-sm [animation-delay:260ms] [animation:fadeSlideUp_0.6s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Booking Chart
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Last 7 days bookings
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Ticket className="h-4.5 w-4.5" />
            </div>
          </div>

          <BarChart
            data={dashboard?.charts?.bookingChart || []}
            dataKey="bookings"
            labelKey="_id"
            barGradient="from-slate-900 to-slate-600 dark:from-white dark:to-slate-400"
            emptyLabel="No booking data available"
          />
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Bookings */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white opacity-0 shadow-sm [animation-delay:320ms] [animation:fadeSlideUp_0.6s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recent Bookings
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {recentBookings.length} recent
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">PNR</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, index) => (
                    <tr
                      key={booking._id}
                      style={{
                        animationDelay: `${380 + index * 45}ms`,
                      }}
                      className="border-t border-slate-100 opacity-0 [animation:fadeSlideUp_0.4s_ease-out_forwards] transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                        {booking.pnr || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {booking.user?.name || "User"}
                      </td>
                      <td className="px-6 py-4 font-bold text-red-600 dark:text-red-400">
                        ₹{formatCurrency(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black capitalize ${getStatusStyle(
                            booking.bookingStatus,
                          )}`}
                        >
                          {booking.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center font-semibold text-slate-400 dark:text-slate-500"
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
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white opacity-0 shadow-sm [animation-delay:380ms] [animation:fadeSlideUp_0.6s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Recent Users
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {recentUsers.length} recent
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>

              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      style={{
                        animationDelay: `${440 + index * 45}ms`,
                      }}
                      className="border-t border-slate-100 opacity-0 [animation:fadeSlideUp_0.4s_ease-out_forwards] transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-black text-white ${getAvatarGradient(
                              user.name || user.email,
                            )}`}
                          >
                            {getInitials(user.name)}
                          </span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black capitalize text-red-600 dark:bg-red-950/40 dark:text-red-400">
                          {user.role || "user"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center font-semibold text-slate-400 dark:text-slate-500"
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

/* ------------------------------------------------------------------ */
/* Keyframes (injected once)                                           */
/* ------------------------------------------------------------------ */

const GlobalKeyframes = () => (
  <style>{`
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `}</style>
);

export default Dashboard;