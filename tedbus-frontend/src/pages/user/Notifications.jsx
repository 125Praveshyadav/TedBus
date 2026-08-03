import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  Filter,
  Loader2,
  Settings,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";

import useNotifications from "../../hooks/useNotifications";
import NotificationItem from "../../notifications/NotificationItem";
import NotificationEmpty from "../../notifications/NotificationEmpty";

const FILTER_TABS = [
  {
    key: "all",
    label: "All",
    activeGradient:
      "from-violet-600 to-indigo-600",
    activeShadow: "shadow-violet-500/25",
    activeText: "text-violet-600 dark:text-violet-400",
    dotColor: "bg-violet-500",
  },
  {
    key: "unread",
    label: "Unread",
    activeGradient:
      "from-amber-500 to-orange-500",
    activeShadow: "shadow-amber-500/25",
    activeText: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  {
    key: "read",
    label: "Read",
    activeGradient:
      "from-teal-600 to-cyan-500",
    activeShadow: "shadow-teal-500/25",
    activeText: "text-teal-600 dark:text-teal-400",
    dotColor: "bg-teal-500",
  },
];

const ActionButton = ({
  onClick,
  title,
  icon: Icon,
  hoverColor,
  hoverBg,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 ${hoverColor} ${hoverBg}`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const SKELETON_COLORS = [
  "from-violet-200 via-indigo-100 to-violet-200 dark:from-violet-950 dark:via-indigo-950 dark:to-violet-950",
  "from-amber-200 via-orange-100 to-amber-200 dark:from-amber-950 dark:via-orange-950 dark:to-amber-950",
  "from-teal-200 via-cyan-100 to-teal-200 dark:from-teal-950 dark:via-cyan-950 dark:to-teal-950",
  "from-fuchsia-200 via-purple-100 to-fuchsia-200 dark:from-fuchsia-950 dark:via-purple-950 dark:to-fuchsia-950",
  "from-indigo-200 via-blue-100 to-indigo-200 dark:from-indigo-950 dark:via-blue-950 dark:to-indigo-950",
];

const Notifications = () => {
  const {
    notifications,
    loading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotifications();

  const [filter, setFilter] = useState("all");

  const activeTab =
    FILTER_TABS.find((t) => t.key === filter) ||
    FILTER_TABS[0];

  useEffect(() => {
    const params = { limit: 20 };
    if (filter === "unread") params.isRead = false;
    if (filter === "read") params.isRead = true;
    fetchNotifications(params);
  }, [filter, fetchNotifications]);

  const unreadCount = notifications.filter(
    (n) => !n.isRead,
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Notifications
                </span>

                {unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 text-[9px] font-black text-white shadow-sm shadow-amber-500/30">
                    {unreadCount}
                  </span>
                )}
              </h1>

              <p className="hidden text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:block">
                {loading
                  ? "Loading..."
                  : `${pagination.total || 0} total notifications`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <ActionButton
              onClick={markAllAsRead}
              title="Mark all as read"
              icon={CheckCheck}
              hoverColor="hover:text-emerald-600 dark:hover:text-emerald-400"
              hoverBg="hover:border-emerald-200 hover:bg-emerald-50 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30"
            />

            <ActionButton
              onClick={deleteAllRead}
              title="Delete all read"
              icon={Trash2}
              hoverColor="hover:text-rose-600 dark:hover:text-rose-400"
              hoverBg="hover:border-rose-200 hover:bg-rose-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/30"
            />

            <Link
              to="/notification-settings"
              title="Notification settings"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-indigo-900 dark:hover:text-indigo-400"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero header card */}
        <div className="relative mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Gradient banner */}
          <div className="relative bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:38px_38px] opacity-20" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl shadow-lg">
                <Bell className="h-7 w-7" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                  <Zap className="h-3 w-3" />
                  Live updates
                </div>

                <h2 className="text-xl font-black sm:text-2xl">
                  Your Notifications
                </h2>

                <p className="mt-0.5 text-sm font-medium text-indigo-100/85">
                  Stay updated with the latest activity
                </p>
              </div>

              {/* Unread count badge */}
              {unreadCount > 0 && (
                <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-center backdrop-blur-xl">
                  <p className="text-xl font-black">
                    {unreadCount}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-wider text-white/70">
                    Unread
                  </p>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="relative mt-4 grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-2xl border border-white/10 bg-black/10 backdrop-blur-xl">
              <div className="p-3 text-center">
                <p className="text-lg font-black">
                  {pagination.total || 0}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Total
                </p>
              </div>

              <div className="p-3 text-center">
                <p className="text-lg font-black text-amber-300">
                  {unreadCount}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Unread
                </p>
              </div>

              <div className="p-3 text-center">
                <p className="text-lg font-black text-teal-300">
                  {(pagination.total || 0) -
                    unreadCount}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Read
                </p>
              </div>
            </div>
          </div>

          {/* Ticket notch */}
          <div className="relative z-10">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 p-4 sm:p-5">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Filter
              </p>
            </div>

            <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/60">
              {FILTER_TABS.map((tab) => {
                const isActive = filter === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.activeGradient} text-white shadow-lg ${tab.activeShadow}`
                        : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                    }`}
                  >
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white opacity-80" />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Active filter hint */}
            <span
              className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider sm:inline-flex ${
                filter === "all"
                  ? "border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400"
                  : filter === "unread"
                    ? "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                    : "border-teal-100 bg-teal-50 text-teal-600 dark:border-teal-900/50 dark:bg-teal-950/30 dark:text-teal-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${activeTab.dotColor}`}
              />
              {loading
                ? "Loading..."
                : `${notifications.length} shown`}
            </span>
          </div>
        </div>

        {/* Notifications list card */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Section header */}
          <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-violet-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20 sm:p-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activeTab.activeGradient} text-white shadow-lg ${activeTab.activeShadow}`}
                >
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
                    {filter === "all"
                      ? "All Notifications"
                      : filter === "unread"
                        ? "Unread Notifications"
                        : "Read Notifications"}
                  </h2>

                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {loading
                      ? "Fetching..."
                      : `${notifications.length} notification${notifications.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>

              {unreadCount > 0 &&
                filter !== "read" && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
            </div>
          </div>

          {/* Content */}
          {loading && notifications.length === 0 ? (
            <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
              {SKELETON_COLORS.map(
                (gradient, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 sm:p-5"
                  >
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                    </div>

                    <div className="h-2 w-12 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                  </div>
                ),
              )}
            </div>
          ) : notifications.length === 0 ? (
            <div className="relative overflow-hidden p-8 text-center sm:p-10">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/10" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                  <BellOff className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                  {filter === "unread"
                    ? "No unread notifications"
                    : filter === "read"
                      ? "No read notifications"
                      : "No notifications yet"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
                  {filter === "all"
                    ? "You'll see notifications here when there's activity."
                    : `Switch to "All" to see all your notifications.`}
                </p>

                {filter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setFilter("all")}
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Show all notifications
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((n) => (
                <NotificationItem
                  key={n._id}
                  notification={n}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom hint */}
        {notifications.length > 0 && !loading && (
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Notifications update in real-time
          </div>
        )}
      </div>
    </main>
  );
};

export default Notifications;