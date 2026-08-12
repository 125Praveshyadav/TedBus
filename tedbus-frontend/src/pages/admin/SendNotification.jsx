import React, { useState, useEffect } from "react";
import {
  Send,
  Bell,
  Users,
  Gift,
  AlertCircle,
  Loader2,
  BarChart3,
  Sparkles,
} from "lucide-react";
import api from "../../services/api";
import { toast } from "react-toastify";

const SendNotification = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "promotional",
    sendToAll: true,
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryStats();
  }, []);

  const fetchDeliveryStats = async () => {
    try {
      const res = await api.get("/admin/community/stats");
      setStats(res.data?.stats || res.stats || null);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      return toast.error("Title and message are required");
    }

    if (
      !window.confirm(
        formData.sendToAll
          ? "Send this notification to ALL users?"
          : "Send this notification?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/notifications/send", formData);
      const data = res.data || res;
      toast.success(data.message || "Notification sent!");
      setFormData({
        title: "",
        message: "",
        type: "promotional",
        sendToAll: true,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.data?.message || "Failed to send"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-colors dark:bg-slate-950">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Send{" "}
              <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent dark:from-red-500 dark:to-orange-400">
                Notifications
              </span>
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Broadcast promotional or system notifications to users
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Send Form */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white">
              <Send size={20} className="text-red-600 dark:text-red-500" />
              Compose Notification
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Notification Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "promotional",
                      label: "Promotional",
                      icon: Gift,
                      color: "text-amber-600 dark:text-amber-500",
                    },
                    {
                      value: "system",
                      label: "System",
                      icon: Bell,
                      color: "text-blue-600 dark:text-blue-500",
                    },
                    {
                      value: "schedule_changed",
                      label: "Schedule",
                      icon: AlertCircle,
                      color: "text-purple-600 dark:text-purple-500",
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: opt.value })
                      }
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        formData.type === opt.value
                          ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                      }`}
                    >
                      <opt.icon
                        size={24}
                        className={
                          formData.type === opt.value
                            ? "text-red-600 dark:text-red-500"
                            : opt.color
                        }
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. 🎁 Flat 50% OFF on all routes!"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-600 dark:focus:bg-slate-800"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="4"
                  placeholder="Write the notification message..."
                  className="w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 outline-none transition-all focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-red-600 dark:focus:bg-slate-800"
                  required
                />
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Audience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sendToAll: true })
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      formData.sendToAll
                        ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        formData.sendToAll
                          ? "text-red-600 dark:text-red-500"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      All Users
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sendToAll: false })
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                      !formData.sendToAll
                        ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/30"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        !formData.sendToAll
                          ? "text-red-600 dark:text-red-500"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      Specific Users
                    </span>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Preview
                </p>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
                    <Gift size={18} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                      {formData.title || "Notification Title"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {formData.message ||
                        "Notification message will appear here..."}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      Just now
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 py-4 font-black text-white shadow-lg shadow-red-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
                {loading
                  ? "Sending..."
                  : formData.sendToAll
                  ? "Send to All Users"
                  : "Send Notification"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Quick Stats & Tips */}
        <div className="flex flex-col gap-5">
          {/* Stats Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-800 dark:text-white">
              <BarChart3 size={18} className="text-red-600 dark:text-red-500" />
              Quick Stats
            </h3>

            {statsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-red-600 dark:text-red-500" size={24} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/30">
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    Total Posts
                  </span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {stats?.totalPosts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    Total Comments
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {stats?.totalComments || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-3 dark:border-purple-900/40 dark:bg-purple-950/30">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
                    Discussions
                  </span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                    {stats?.totalDiscussions || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl dark:border-slate-700">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Best Practices
            </h3>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:bg-white/10">
                <p className="text-sm font-semibold text-slate-200">
                  🎯 Keep promotional titles short and catchy
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:bg-white/10">
                <p className="text-sm font-semibold text-slate-200">
                  ⏰ Send offers during 9 AM — 9 PM for max engagement
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition hover:bg-white/10">
                <p className="text-sm font-semibold text-slate-200">
                  🚫 Avoid sending more than 2 promos per week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;