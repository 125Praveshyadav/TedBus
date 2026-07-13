import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft, CheckCheck, Trash2, Loader2, Settings, Filter } from "lucide-react";
import useNotifications from "../../hooks/useNotifications";
import NotificationItem from "../../notifications/NotificationItem";
import NotificationEmpty from "../../notifications/NotificationEmpty";

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

  useEffect(() => {
    const params = { limit: 20 };
    if (filter === "unread") params.isRead = false;
    if (filter === "read") params.isRead = true;
    fetchNotifications(params);
  }, [filter, fetchNotifications]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                <Bell size={24} className="text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
                <p className="text-slate-500 text-sm font-medium">{pagination.total || 0} total notifications</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="p-2.5 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck size={20} />
              </button>
              <button
                onClick={deleteAllRead}
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete all read"
              >
                <Trash2 size={20} />
              </button>
              <Link
                to="/notification-settings"
                className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Settings"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          {["all", "unread", "read"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === tab
                  ? "bg-red-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {loading && notifications.length === 0 ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-red-600" size={32} />
            </div>
          ) : notifications.length === 0 ? (
            <NotificationEmpty
              message={filter === "unread" ? "No unread notifications" : "No notifications yet"}
            />
          ) : (
            <div className="p-3 space-y-1">
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
      </div>
    </div>
  );
};

export default Notifications;