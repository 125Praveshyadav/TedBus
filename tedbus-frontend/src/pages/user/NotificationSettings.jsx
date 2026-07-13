import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, Mail, Smartphone, Loader2 } from "lucide-react";
import usePreferences from "../../hooks/usePreferences";

const NotificationSettings = () => {
  const { preferences, loading, fetchPreferences, updatePreferences } = usePreferences();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleChannelToggle = (channel) => {
    updatePreferences({
      channels: { [channel]: !preferences.channels[channel] },
    });
  };

  const handleCategoryToggle = (category) => {
    updatePreferences({
      categories: { [category]: !preferences.categories[category] },
    });
  };

  const handleQuietHoursToggle = () => {
    updatePreferences({
      quietHours: { enabled: !preferences.quietHours.enabled },
    });
  };

  const handleDigestChange = (value) => {
    updatePreferences({ emailDigest: value });
  };

  if (loading || !preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  const categoryLabels = {
    booking_confirmed: { label: "Booking Confirmed", emoji: "🎫" },
    booking_cancelled: { label: "Booking Cancelled", emoji: "❌" },
    schedule_changed: { label: "Schedule Changes", emoji: "⚠️" },
    journey_reminder: { label: "Journey Reminders", emoji: "⏰" },
    promotional: { label: "Offers & Promotions", emoji: "🎁" },
    community_like: { label: "Likes on Posts", emoji: "❤️" },
    community_comment: { label: "Comments on Posts", emoji: "💬" },
    community_reply: { label: "Replies on Discussions", emoji: "📝" },
    system: { label: "System Updates", emoji: "🔔" },
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/notifications"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Notifications
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-red-600 to-red-500 p-6 sm:p-8 rounded-[2.5rem] shadow-lg mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Bell size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Notification Settings</h1>
              <p className="text-white/80 text-sm font-medium">Choose what you want to be notified about</p>
            </div>
          </div>
        </div>

        {/* Channels Section */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-5">
          <h2 className="text-lg font-black text-slate-800 mb-4">Notification Channels</h2>
          <p className="text-xs text-slate-400 font-medium mb-5">Choose how you want to receive notifications</p>

          <div className="space-y-3">
            <ToggleRow
              icon={<Bell size={18} />}
              label="In-App Notifications"
              desc="Show notifications inside the app"
              checked={preferences.channels.inApp}
              onChange={() => handleChannelToggle("inApp")}
            />
            <ToggleRow
              icon={<Mail size={18} />}
              label="Email Notifications"
              desc="Receive notifications via email"
              checked={preferences.channels.email}
              onChange={() => handleChannelToggle("email")}
            />
            <ToggleRow
              icon={<Smartphone size={18} />}
              label="Push Notifications"
              desc="Browser push notifications"
              checked={preferences.channels.push}
              onChange={() => handleChannelToggle("push")}
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-5">
          <h2 className="text-lg font-black text-slate-800 mb-4">Notification Categories</h2>
          <p className="text-xs text-slate-400 font-medium mb-5">Enable or disable specific notification types</p>

          <div className="space-y-3">
            {Object.entries(categoryLabels).map(([key, config]) => (
              <ToggleRow
                key={key}
                icon={<span className="text-lg">{config.emoji}</span>}
                label={config.label}
                checked={preferences.categories[key]}
                onChange={() => handleCategoryToggle(key)}
              />
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-5">
          <h2 className="text-lg font-black text-slate-800 mb-4">🌙 Quiet Hours (DND)</h2>
          <ToggleRow
            icon={<span className="text-lg">🔇</span>}
            label="Enable Quiet Hours"
            desc={`No push notifications between ${preferences.quietHours.start} — ${preferences.quietHours.end}`}
            checked={preferences.quietHours.enabled}
            onChange={handleQuietHoursToggle}
          />
        </div>

        {/* Email Digest */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-800 mb-4">📧 Email Digest Frequency</h2>
          <p className="text-xs text-slate-400 font-medium mb-5">How often should we email you?</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["instant", "daily", "weekly", "none"].map((option) => (
              <button
                key={option}
                onClick={() => handleDigestChange(option)}
                className={`py-3 rounded-2xl text-sm font-bold capitalize transition-all ${
                  preferences.emailDigest === option
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-red-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Toggle Row Component
const ToggleRow = ({ icon, label, desc, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">{label}</p>
          {desc && <p className="text-[11px] text-slate-400 font-medium">{desc}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-7 rounded-full transition-all ${
          checked ? "bg-red-600" : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
};

export default NotificationSettings;