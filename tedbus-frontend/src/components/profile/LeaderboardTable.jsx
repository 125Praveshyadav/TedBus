import { Link } from "react-router-dom";
import { Trophy, Medal, Award, Sparkles, TrendingUp } from "lucide-react";

const rankThemes = {
  1: {
    icon: Trophy,
    label: "1st",
    gradient: "from-yellow-400 to-amber-500",
    bg: "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/40 dark:to-amber-950/40",
    text: "text-yellow-700 dark:text-yellow-300",
    border: "border-yellow-200 dark:border-yellow-900/50",
    glow: "shadow-yellow-500/30",
    badge: "🥇",
  },
  2: {
    icon: Medal,
    label: "2nd",
    gradient: "from-slate-300 to-slate-400",
    bg: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700",
    text: "text-slate-700 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-600",
    glow: "shadow-slate-400/30",
    badge: "🥈",
  },
  3: {
    icon: Award,
    label: "3rd",
    gradient: "from-orange-400 to-amber-600",
    bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-900/50",
    glow: "shadow-orange-500/30",
    badge: "🥉",
  },
};

const defaultTheme = {
  bg: "bg-white dark:bg-slate-900",
  border: "border-slate-100 dark:border-slate-800",
  text: "text-slate-700 dark:text-slate-300",
  glow: "shadow-slate-500/10",
};

const LeaderboardTable = ({ users = [] }) => {
  if (users.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
          <Trophy className="h-8 w-8" />
        </div>
        <h3 className="mt-5 text-lg font-black text-slate-700 dark:text-slate-300">
          Leaderboard is empty
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Be the first to earn reputation and appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((entry, idx) => {
        const rank = idx + 1;
        const config = rankThemes[rank] || defaultTheme;
        const Icon = config.icon || TrendingUp;

        return (
          <Link
            key={entry._id}
            to={`/community/profile/${entry._id}`}
            className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl border p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${config.border} ${config.bg} ${config.glow}`}
          >
            {/* Rank Circle */}
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 text-xl font-black shadow-inner transition-transform group-hover:scale-110 ${config.border}`}
            >
              {config.badge || `#${rank}`}
            </div>

            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  entry.user?.profileImage ||
                  `https://ui-avatars.com/api/?name=${entry.user?.name}&background=4f46e5&color=fff`
                }
                alt={entry.user?.name}
                className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800"
              />
              {rank <= 3 && (
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg shadow dark:bg-slate-900">
                  {config.badge}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {entry.user?.name || "Anonymous"}
                </p>
                {rank === 1 && <Sparkles className="h-4 w-4 text-yellow-500" />}
              </div>

              <div className="mt-1 flex flex-wrap gap-x-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span>{entry.totalPosts || 0} posts</span>
                <span>{entry.totalLikes || 0} likes</span>
                <span>{entry.totalComments || 0} answers</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className={`text-3xl font-black ${config.text || "text-indigo-600 dark:text-indigo-400"}`}>
                {entry.score || 0}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Points
              </p>
            </div>

            {/* Hover Arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
              {/* <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600" /> */}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;