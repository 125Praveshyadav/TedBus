import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Gift,
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Moon,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  VolumeX,
  XCircle,
} from "lucide-react";

import usePreferences from "../../hooks/usePreferences";

const channelThemes = {
  inApp: {
    icon: Bell,
    label: "In-App Notifications",
    desc: "Show notifications inside the app",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/50",
    activeGradient: "from-violet-600 to-indigo-600",
  },
  email: {
    icon: Mail,
    label: "Email Notifications",
    desc: "Receive notifications via email",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-100 dark:border-teal-900/50",
    activeGradient: "from-teal-600 to-cyan-500",
  },
  push: {
    icon: Smartphone,
    label: "Push Notifications",
    desc: "Browser push notifications",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
    activeGradient: "from-amber-500 to-orange-500",
  },
};

const categoryLabels = {
  booking_confirmed: {
    label: "Booking Confirmed",
    desc: "Ticket confirmation alerts",
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
    activeGradient: "from-emerald-600 to-teal-500",
  },
  booking_cancelled: {
    label: "Booking Cancelled",
    desc: "Cancellation and refund updates",
    icon: XCircle,
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900/50",
    activeGradient: "from-rose-600 to-pink-500",
  },
  schedule_changed: {
    label: "Schedule Changes",
    desc: "Departure or arrival time changes",
    icon: CalendarClock,
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
    activeGradient: "from-amber-500 to-orange-500",
  },
  journey_reminder: {
    label: "Journey Reminders",
    desc: "Reminders before your trip",
    icon: Clock3,
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-100 dark:border-cyan-900/50",
    activeGradient: "from-cyan-600 to-blue-500",
  },
  promotional: {
    label: "Offers & Promotions",
    desc: "Coupons, offers and deal alerts",
    icon: Gift,
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "border-fuchsia-100 dark:border-fuchsia-900/50",
    activeGradient: "from-fuchsia-600 to-purple-600",
  },
  community_like: {
    label: "Likes on Posts",
    desc: "When someone likes your content",
    icon: Heart,
    bg: "bg-pink-50 dark:bg-pink-950/40",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-100 dark:border-pink-900/50",
    activeGradient: "from-pink-600 to-rose-500",
  },
  community_comment: {
    label: "Comments on Posts",
    desc: "When someone comments on your posts",
    icon: MessageCircle,
    bg: "bg-violet-50 dark:bg-violet-950/40",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/50",
    activeGradient: "from-violet-600 to-indigo-600",
  },
  community_reply: {
    label: "Replies on Discussions",
    desc: "When someone replies to your discussion",
    icon: BellRing,
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/50",
    activeGradient: "from-indigo-600 to-blue-600",
  },
  system: {
    label: "System Updates",
    desc: "Security and important system alerts",
    icon: ShieldCheck,
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
    activeGradient: "from-slate-700 to-zinc-600",
  },
};

const digestOptions = [
  {
    key: "instant",
    label: "Instant",
    desc: "Right away",
    gradient: "from-violet-600 to-indigo-600",
    shadow: "shadow-violet-500/25",
  },
  {
    key: "daily",
    label: "Daily",
    desc: "Once a day",
    gradient: "from-teal-600 to-cyan-500",
    shadow: "shadow-teal-500/25",
  },
  {
    key: "weekly",
    label: "Weekly",
    desc: "Once a week",
    gradient: "from-amber-500 to-orange-500",
    shadow: "shadow-amber-500/25",
  },
  {
    key: "none",
    label: "None",
    desc: "No digest",
    gradient: "from-slate-700 to-zinc-600",
    shadow: "shadow-slate-500/25",
  },
];

const ToggleSwitch = ({ checked, onChange, gradient }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-all duration-300 ${
        checked
          ? `bg-gradient-to-r ${gradient} shadow-lg`
          : "bg-slate-200 dark:bg-slate-700"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 dark:bg-slate-100 ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      >
        {checked && (
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        )}
      </span>
    </button>
  );
};

const ToggleRow = ({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
  theme,
}) => {
  return (
    <div
      className={`group flex items-center justify-between gap-4 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${
        checked
          ? `${theme.bg} ${theme.border}`
          : "border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${theme.bg} ${theme.border} ${theme.text}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black text-slate-800 dark:text-slate-200">
            {label}
          </p>

          {desc && (
            <p className="mt-0.5 text-[10px] font-medium leading-4 text-slate-400 dark:text-slate-500">
              {desc}
            </p>
          )}
        </div>
      </div>

      <ToggleSwitch
        checked={checked}
        onChange={onChange}
        gradient={theme.activeGradient}
      />
    </div>
  );
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  gradient,
  glow,
  children,
}) => {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      <div
        className={`relative overflow-hidden border-b border-slate-100 bg-gradient-to-br ${gradient} p-4 text-white dark:border-slate-800 sm:p-5`}
      >
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full ${glow} blur-3xl`}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-black">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] font-medium text-white/70">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {children}
      </div>
    </section>
  );
};

const NotificationSettings = () => {
  const {
    preferences,
    loading,
    fetchPreferences,
    updatePreferences,
  } = usePreferences();

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  if (loading || !preferences) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Loading notification preferences...
          </p>
        </div>
      </main>
    );
  }

  const handleChannelToggle = (channel) => {
    updatePreferences({
      channels: {
        [channel]: !preferences.channels[channel],
      },
    });
  };

  const handleCategoryToggle = (category) => {
    updatePreferences({
      categories: {
        [category]: !preferences.categories[category],
      },
    });
  };

  const handleQuietHoursToggle = () => {
    updatePreferences({
      quietHours: {
        enabled: !preferences.quietHours.enabled,
      },
    });
  };

  const handleDigestChange = (value) => {
    updatePreferences({ emailDigest: value });
  };

  const enabledChannels = Object.values(
    preferences.channels || {},
  ).filter(Boolean).length;

  const enabledCategories = Object.values(
    preferences.categories || {},
  ).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/notifications"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                Notification
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Settings
                </span>
              </h1>

              <p className="hidden text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:block">
                Manage channels, categories and digest
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Saved
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-5 px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:38px_38px] opacity-20" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl shadow-lg">
                <Settings className="h-7 w-7" />
              </div>

              <div>
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                  <Sparkles className="h-3 w-3" />
                  Preferences
                </div>

                <h2 className="text-xl font-black sm:text-2xl">
                  Customize Notifications
                </h2>

                <p className="mt-0.5 text-sm font-medium text-indigo-100/85">
                  Choose what you want to hear about
                </p>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 divide-x divide-white/15 overflow-hidden rounded-2xl border border-white/10 bg-black/10 backdrop-blur-xl">
              <div className="p-3 text-center">
                <p className="text-lg font-black">
                  {enabledChannels}/3
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Channels
                </p>
              </div>
              <div className="p-3 text-center">
                <p className="text-lg font-black">
                  {enabledCategories}/
                  {
                    Object.keys(
                      preferences.categories || {},
                    ).length
                  }
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-white/60">
                  Categories
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Channels */}
        <SectionCard
          title="Notification Channels"
          subtitle="Choose how you want to receive notifications"
          icon={Bell}
          gradient="from-violet-600 via-indigo-600 to-blue-600"
          glow="bg-violet-300/25"
        >
          {Object.entries(channelThemes).map(
            ([key, theme]) => {
              const Icon = theme.icon;

              return (
                <ToggleRow
                  key={key}
                  icon={Icon}
                  label={theme.label}
                  desc={theme.desc}
                  checked={Boolean(
                    preferences.channels[key],
                  )}
                  onChange={() =>
                    handleChannelToggle(key)
                  }
                  theme={theme}
                />
              );
            },
          )}
        </SectionCard>

        {/* Categories */}
        <SectionCard
          title="Notification Categories"
          subtitle="Enable or disable specific notification types"
          icon={BellRing}
          gradient="from-teal-600 via-cyan-600 to-blue-500"
          glow="bg-teal-300/25"
        >
          {Object.entries(categoryLabels).map(
            ([key, config]) => {
              const Icon = config.icon;

              return (
                <ToggleRow
                  key={key}
                  icon={Icon}
                  label={config.label}
                  desc={config.desc}
                  checked={Boolean(
                    preferences.categories[key],
                  )}
                  onChange={() =>
                    handleCategoryToggle(key)
                  }
                  theme={config}
                />
              );
            },
          )}
        </SectionCard>

        {/* Quiet hours */}
        <SectionCard
          title="Quiet Hours"
          subtitle="Pause push notifications during rest time"
          icon={Moon}
          gradient="from-slate-800 via-indigo-900 to-violet-900"
          glow="bg-indigo-400/25"
        >
          <ToggleRow
            icon={VolumeX}
            label="Enable Quiet Hours"
            desc={`No push notifications between ${preferences.quietHours.start} — ${preferences.quietHours.end}`}
            checked={preferences.quietHours.enabled}
            onChange={handleQuietHoursToggle}
            theme={{
              bg: "bg-indigo-50 dark:bg-indigo-950/40",
              text: "text-indigo-600 dark:text-indigo-400",
              border:
                "border-indigo-100 dark:border-indigo-900/50",
              activeGradient:
                "from-indigo-600 to-violet-600",
            }}
          />
        </SectionCard>

        {/* Digest */}
        <SectionCard
          title="Email Digest Frequency"
          subtitle="How often should we email you?"
          icon={Mail}
          gradient="from-amber-500 via-orange-500 to-yellow-500"
          glow="bg-amber-300/25"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {digestOptions.map((option) => {
              const active =
                preferences.emailDigest === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    handleDigestChange(option.key)
                  }
                  className={`rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.98] ${
                    active
                      ? `border-transparent bg-gradient-to-r ${option.gradient} text-white shadow-lg ${option.shadow}`
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:border-amber-900 dark:hover:bg-amber-950/30 dark:hover:text-amber-400"
                  }`}
                >
                  <p className="text-sm font-black capitalize">
                    {option.label}
                  </p>
                  <p
                    className={`mt-0.5 text-[10px] font-bold ${
                      active
                        ? "text-white/70"
                        : "text-slate-400"
                    }`}
                  >
                    {option.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Footer note */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          Your notification preferences are saved automatically
        </div>
      </div>
    </main>
  );
};

export default NotificationSettings;