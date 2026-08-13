import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Bookmark,
  ChevronRight,
  Crown,
  Flame,
  MessageSquare,
  PenSquare,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import useForums from "../../hooks/useForums";
import useProfile from "../../hooks/useProfile";
import usePosts from "../../hooks/usePosts";

/* Quick actions — navigate away */
const QUICK_ACTIONS = [
  {
    to: "/community/create-post",
    icon: PenSquare,
    label: "New Post",
    color: "from-red-600 to-orange-500",
    shadow: "shadow-red-500/20",
  },
  {
    to: "/community/forums",
    icon: MessageSquare,
    label: "Forums",
    color: "from-emerald-600 to-teal-500",
    shadow: "shadow-emerald-500/20",
  },
  {
    to: "/community/profile/me",
    icon: Users,
    label: "Profile",
    color: "from-violet-600 to-purple-500",
    shadow: "shadow-violet-500/20",
  },
  {
    to: "/community/saved",
    icon: Bookmark,
    label: "Saved",
    color: "from-amber-600 to-yellow-500",
    shadow: "shadow-amber-500/20",
  },
];

/* Tabs — toggle content below */
const TABS = [
  {
    key: "trending",
    label: "Trending",
    icon: Flame,
    activeText: "text-red-600 dark:text-red-400",
    activeBg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    key: "forums",
    label: "Forums",
    icon: MessageSquare,
    activeText: "text-emerald-600 dark:text-emerald-400",
    activeBg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    key: "leaders",
    label: "Top",
    icon: Trophy,
    activeText: "text-amber-600 dark:text-amber-400",
    activeBg: "bg-amber-50 dark:bg-amber-950/30",
  },
];

const CommunitySidebar = () => {
  const { forums, fetchForums } = useForums();
  const { leaderboard, fetchLeaderboard } = useProfile();
  const { posts: trendingPosts, fetchPosts } = usePosts();

  const [activeTab, setActiveTab] = useState("trending");

  useEffect(() => {
    fetchForums({ limit: 6 });
    fetchLeaderboard(5);
    fetchPosts({ sortBy: "trending", limit: 6 });
  }, [fetchForums, fetchLeaderboard, fetchPosts]);

  return (
    <div className="w-full space-y-4">
      {/* ═══════════ QUICK ACTIONS ═══════════ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <Zap className="h-4 w-4 text-red-500" />
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 p-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md active:scale-[0.97] dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-md ${action.shadow} text-white transition-transform duration-300 group-hover:scale-110`}
              >
                <action.icon className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ═══════════ TABBED SECTION ═══════════ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Tab bar */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[11px] font-black transition-colors ${
                  isActive
                    ? `${tab.activeText} ${tab.activeBg}`
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content — vertical list */}
        <div className="p-3">
          {/* ── Trending ── */}
          {activeTab === "trending" && (
            <div className="space-y-1">
              {trendingPosts.map((post, idx) => (
                <Link
                  key={post._id}
                  to={`/community/post/${post._id}`}
                  className="group flex items-start gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black shadow-sm ${
                      idx === 0
                        ? "bg-gradient-to-br from-red-600 to-orange-500 text-white"
                        : idx === 1
                          ? "bg-gradient-to-br from-slate-700 to-slate-500 text-white"
                          : idx === 2
                            ? "bg-gradient-to-br from-amber-700 to-amber-500 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-800 transition-colors group-hover:text-red-600 dark:text-slate-200 dark:group-hover:text-red-400">
                      {post.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2.5 text-[10px] font-bold text-slate-400">
                      <span>❤️ {post.likeCount || 0}</span>
                      <span>💬 {post.commentCount || 0}</span>
                    </div>
                  </div>

                  {post.images?.[0]?.url && (
                    <img
                      src={post.images[0].url}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* ── Forums ── */}
          {activeTab === "forums" && (
            <div className="space-y-1">
              {forums.map((forum) => (
                <Link
                  key={forum._id}
                  to={`/community/forums/${forum.slug || forum._id}`}
                  className="group flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-base dark:bg-emerald-950/30">
                    {forum.icon || "💬"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-800 group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
                      {forum.name}
                    </p>
                    <p className="truncate text-[10px] text-slate-400">
                      {forum.description}
                    </p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
                </Link>
              ))}
            </div>
          )}

          {/* ── Leaders ── */}
          {activeTab === "leaders" && (
            <div className="space-y-1">
              {leaderboard.map((entry, idx) => (
                <Link
                  key={entry._id}
                  to={`/community/profile/${entry._id}`}
                  className="group flex items-center gap-2.5 rounded-xl p-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        entry.user?.profileImage ||
                        `https://ui-avatars.com/api/?name=${entry.user?.name}&background=dc2626&color=fff`
                      }
                      alt={entry.user?.name}
                      className={`h-9 w-9 rounded-lg object-cover ring-2 ${
                        idx === 0
                          ? "ring-amber-400"
                          : "ring-slate-200 dark:ring-slate-700"
                      }`}
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black text-white shadow ${
                        idx === 0
                          ? "bg-gradient-to-br from-amber-400 to-amber-600"
                          : idx === 1
                            ? "bg-gradient-to-br from-slate-400 to-slate-500"
                            : idx === 2
                              ? "bg-gradient-to-br from-amber-700 to-amber-800"
                              : "bg-slate-400"
                      }`}
                    >
                      {idx === 0 ? <Crown className="h-2.5 w-2.5" /> : idx + 1}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                      {entry.user?.name}
                    </p>
                    <p className="text-[11px] font-black text-amber-600 dark:text-amber-400">
                      {entry.score} pts
                    </p>
                  </div>

                  <Award className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;