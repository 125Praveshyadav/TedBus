import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, Settings, Loader2 } from "lucide-react";
import useNotifications from "../hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import NotificationEmpty from "./NotificationEmpty";

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

  useEffect(() => {
    fetchNotifications({ limit: 10 });
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-14 z-50 w-[22rem] max-h-[70vh] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 p-4 flex items-center justify-between">
        <h3 className="font-black text-slate-800">Notifications</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Mark all as read"
          >
            <CheckCheck size={18} />
          </button>
          <Link
            to="/notification-settings"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Settings"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[50vh] p-2">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-red-600" size={24} />
          </div>
        ) : notifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onRead={markAsRead}
              onDelete={deleteNotification}
              compact={true}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-3">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block text-center text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
        >
          View All Notifications →
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;