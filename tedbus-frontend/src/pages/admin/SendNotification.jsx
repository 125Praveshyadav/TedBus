import React, { useState, useEffect } from "react";
import {
  Send,
  Bell,
  Users,
  Gift,
  AlertCircle,
  Loader2,
  CheckCircle,
  BarChart3,
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
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">
          Send <span className="text-red-600">Notifications</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Broadcast promotional or system notifications to users
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Send Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
              <Send size={20} className="text-red-600" />
              Compose Notification
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Notification Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "promotional", label: "Promotional", icon: Gift, color: "text-yellow-600" },
                    { value: "system", label: "System", icon: Bell, color: "text-blue-600" },
                    { value: "schedule_changed", label: "Schedule", icon: AlertCircle, color: "text-purple-600" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: opt.value })
                      }
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        formData.type === opt.value
                          ? "border-red-500 bg-red-50"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <opt.icon
                        size={24}
                        className={
                          formData.type === opt.value
                            ? "text-red-600"
                            : opt.color
                        }
                      />
                      <span className="text-xs font-bold text-slate-700">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. 🎁 Flat 50% OFF on all routes!"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white outline-none font-medium"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows="4"
                  placeholder="Write the notification message..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white outline-none font-medium resize-none"
                  required
                />
              </div>

              {/* Audience */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Audience
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sendToAll: true })
                    }
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      formData.sendToAll
                        ? "border-red-500 bg-red-50"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        formData.sendToAll ? "text-red-600" : "text-slate-500"
                      }
                    />
                    <span className="font-bold text-sm text-slate-700">
                      All Users
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, sendToAll: false })
                    }
                    className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      !formData.sendToAll
                        ? "border-red-500 bg-red-50"
                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <Users
                      size={20}
                      className={
                        !formData.sendToAll ? "text-red-600" : "text-slate-500"
                      }
                    />
                    <span className="font-bold text-sm text-slate-700">
                      Specific Users
                    </span>
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Preview
                </p>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                    <Gift size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {formData.title || "Notification Title"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData.message || "Notification message will appear here..."}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Just now</p>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70"
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

        {/* Right: Quick Stats */}
        <div className="flex flex-col gap-5">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-red-600" />
              Quick Stats
            </h3>

            {statsLoading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-red-600" size={24} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-sm font-bold text-green-700">
                    Total Posts
                  </span>
                  <span className="text-xl font-black text-green-600">
                    {stats?.totalPosts || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-bold text-blue-700">
                    Total Comments
                  </span>
                  <span className="text-xl font-black text-blue-600">
                    {stats?.totalComments || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm font-bold text-purple-700">
                    Discussions
                  </span>
                  <span className="text-xl font-black text-purple-600">
                    {stats?.totalDiscussions || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <div className="bg-slate-950 p-6 rounded-[2rem] text-white shadow-xl">
            <h3 className="text-lg font-black mb-4">📋 Best Practices</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-slate-200">
                  🎯 Keep promotional titles short and catchy
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-slate-200">
                  ⏰ Send offers during 9 AM — 9 PM for max engagement
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-slate-200">
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