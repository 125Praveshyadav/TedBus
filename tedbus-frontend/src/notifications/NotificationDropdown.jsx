import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BellOff,
  CheckCheck,
  Loader2,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

import useNotifications from "../hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import NotificationEmpty from "./NotificationEmpty";

const SKELETON_COUNT = 4;

const NotificationDropdown = ({ onClose }) => {
  const dropdownRef = useRef(null);

  const {
    notifications,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    fetchNotifications({ limit: 10 });
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 z-50 w-[22rem] max-h-[75vh] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
    >
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="relative bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 px-4 py-3.5 text-white">
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-0 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl">
                <Bell className="h-4 w-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black">
                    Notifications
                  </h3>

                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-1.5 text-[9px] font-black text-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-[9px] font-bold text-indigo-100/80">
                  {loading
                    ? "Loading..."
                    : `${notifications.length} recent`}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>

              <Link
                to="/notification-settings"
                onClick={onClose}
                title="Settings"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <Settings className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[50vh] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.4)_transparent]">
        {loading && notifications.length === 0 ? (
          <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: SKELETON_COUNT }).map(
              (_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3.5"
                >
                  <div className="h-9 w-9 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

                  <div className="flex-1 space-y-2 pt-0.5">
                    <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ),
            )}
          </div>
        ) : notifications.length === 0 ? (
          <div className="relative overflow-hidden px-4 py-10 text-center">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-900/10" />

            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                <BellOff className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-black text-slate-800 dark:text-slate-200">
                All caught up!
              </p>

              <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                No new notifications right now
              </p>
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
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-950/50">
        <Link
          to="/notifications"
          onClick={onClose}
          className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-black text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/30 active:translate-y-0 active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          View All Notifications
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;