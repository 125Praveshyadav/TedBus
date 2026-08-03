import { Link } from "react-router-dom";
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/*
 * 5 premium color themes — cycle करते हैं
 * Forums के साथ consistent
 */
const FORUM_THEMES = [
  {
    id: "violet",
    gradient: "from-violet-600 via-indigo-600 to-blue-600",
    glow: "bg-violet-400/20",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    hoverBorder: "hover:border-violet-200 dark:hover:border-violet-900/60",
    hoverShadow: "hover:shadow-violet-500/10",
    titleHover: "group-hover:text-violet-600 dark:group-hover:text-violet-400",
    iconBg: "bg-gradient-to-br from-violet-50 to-indigo-100 dark:from-violet-950/60 dark:to-indigo-950/40",
    iconBorder: "border-violet-100 dark:border-violet-900/50",
    stripGradient: "from-violet-300 via-indigo-300 to-blue-300 dark:from-violet-800 dark:via-indigo-800 dark:to-blue-800",
    statBg: "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
    arrowHover: "group-hover:text-violet-500 dark:group-hover:text-violet-400",
    glowGradient: "from-violet-500 to-indigo-500",
    label: "Forum",
    labelColor: "bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
  },
  {
    id: "teal",
    gradient: "from-teal-600 via-cyan-500 to-sky-500",
    glow: "bg-teal-400/20",
    accentText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
    hoverBorder: "hover:border-teal-200 dark:hover:border-teal-900/60",
    hoverShadow: "hover:shadow-teal-500/10",
    titleHover: "group-hover:text-teal-600 dark:group-hover:text-teal-400",
    iconBg: "bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-950/60 dark:to-cyan-950/40",
    iconBorder: "border-teal-100 dark:border-teal-900/50",
    stripGradient: "from-teal-300 via-cyan-300 to-sky-300 dark:from-teal-800 dark:via-cyan-800 dark:to-sky-800",
    statBg: "bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/50",
    arrowHover: "group-hover:text-teal-500 dark:group-hover:text-teal-400",
    glowGradient: "from-teal-500 to-cyan-500",
    label: "Forum",
    labelColor: "bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400",
  },
  {
    id: "amber",
    gradient: "from-amber-600 via-orange-500 to-yellow-500",
    glow: "bg-amber-400/20",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-900/60",
    hoverShadow: "hover:shadow-amber-500/10",
    titleHover: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    iconBg: "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/60 dark:to-orange-950/40",
    iconBorder: "border-amber-100 dark:border-amber-900/50",
    stripGradient: "from-amber-300 via-orange-300 to-yellow-300 dark:from-amber-800 dark:via-orange-800 dark:to-yellow-800",
    statBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    arrowHover: "group-hover:text-amber-500 dark:group-hover:text-amber-400",
    glowGradient: "from-amber-500 to-orange-500",
    label: "Forum",
    labelColor: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
  },
  {
    id: "fuchsia",
    gradient: "from-fuchsia-600 via-purple-600 to-violet-600",
    glow: "bg-fuchsia-400/20",
    accentText: "text-fuchsia-600 dark:text-fuchsia-400",
    softBg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
    softBorder: "border-fuchsia-100 dark:border-fuchsia-900/50",
    hoverBorder: "hover:border-fuchsia-200 dark:hover:border-fuchsia-900/60",
    hoverShadow: "hover:shadow-fuchsia-500/10",
    titleHover: "group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400",
    iconBg: "bg-gradient-to-br from-fuchsia-50 to-purple-100 dark:from-fuchsia-950/60 dark:to-purple-950/40",
    iconBorder: "border-fuchsia-100 dark:border-fuchsia-900/50",
    stripGradient: "from-fuchsia-300 via-purple-300 to-violet-300 dark:from-fuchsia-800 dark:via-purple-800 dark:to-violet-800",
    statBg: "bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-100 dark:border-fuchsia-900/50",
    arrowHover: "group-hover:text-fuchsia-500 dark:group-hover:text-fuchsia-400",
    glowGradient: "from-fuchsia-500 to-purple-500",
    label: "Forum",
    labelColor: "bg-fuchsia-100 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    id: "emerald",
    gradient: "from-emerald-600 via-green-500 to-teal-500",
    glow: "bg-emerald-400/20",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    hoverShadow: "hover:shadow-emerald-500/10",
    titleHover: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    iconBg: "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/60 dark:to-green-950/40",
    iconBorder: "border-emerald-100 dark:border-emerald-900/50",
    stripGradient: "from-emerald-300 via-green-300 to-teal-300 dark:from-emerald-800 dark:via-green-800 dark:to-teal-800",
    statBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    arrowHover: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
    glowGradient: "from-emerald-500 to-teal-500",
    label: "Forum",
    labelColor: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
];

const getTheme = (index) =>
  FORUM_THEMES[(Number(index) || 0) % FORUM_THEMES.length];

const ForumCard = ({ forum, index = 0 }) => {
  const theme = getTheme(index);

  const discussionCount = forum.discussionCount || 0;
  const memberCount = forum.memberCount || forum.subscriberCount || 0;

  return (
    <Link
      to={`/community/forums/${forum.slug || forum._id}`}
      className={`group relative block overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${theme.hoverBorder} ${theme.hoverShadow}`}
    >
      {/* Themed top strip on hover */}
      <div
        className={`h-0.5 w-full bg-gradient-to-r ${theme.stripGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Icon box */}
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-3xl shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${theme.iconBg} ${theme.iconBorder}`}
          >
            {forum.icon || "💬"}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            {/* Name + label */}
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`truncate text-base font-black text-slate-900 transition-colors dark:text-white sm:text-lg ${theme.titleHover}`}
              >
                {forum.name}
              </h3>

              <span
                className={`shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${theme.labelColor}`}
              >
                {theme.label}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-sm sm:leading-6">
              {forum.description ||
                "Explore and join discussions in this forum."}
            </p>

            {/* Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[10px] font-black ${theme.statBg}`}
              >
                <MessageSquare className="h-3 w-3" />
                {discussionCount}{" "}
                {discussionCount === 1
                  ? "Discussion"
                  : "Discussions"}
              </span>

              {memberCount > 0 && (
                <span
                  className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-[10px] font-black ${theme.statBg}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {memberCount} Members
                </span>
              )}

              {discussionCount > 10 && (
                <span className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <TrendingUp className="h-3 w-3" />
                  Trending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div
          className={`mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 ${theme.softBorder} ${theme.softBg}`}
        >
          <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${theme.accentText}`}>
            Join discussion
          </p>

          <div
            className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white shadow-md transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110`}
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className={`pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${theme.glowGradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]`}
      />
    </Link>
  );
};

export default ForumCard;