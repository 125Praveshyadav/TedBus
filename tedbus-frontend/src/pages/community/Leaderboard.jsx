import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Crown,
  Loader2,
  MessageCircle,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import LeaderboardTable from "../../components/profile/LeaderboardTable";

const SCORE_RULES = [
  {
    icon: Sparkles,
    action: "Post",
    points: "+1",
    iconBg: "bg-violet-100 dark:bg-violet-950/50",
    iconColor: "text-violet-600 dark:text-violet-400",
    ptColor: "text-violet-700 dark:text-violet-300",
  },
  {
    icon: ThumbsUp,
    action: "Like Received",
    points: "+1",
    iconBg: "bg-amber-100 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    ptColor: "text-amber-700 dark:text-amber-300",
  },
  {
    icon: MessageCircle,
    action: "Comment",
    points: "+2",
    iconBg: "bg-teal-100 dark:bg-teal-950/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    ptColor: "text-teal-700 dark:text-teal-300",
  },
];

const Leaderboard = () => {
  const { leaderboard, loading, fetchLeaderboard } =
    useProfile();

  useEffect(() => {
    fetchLeaderboard(20);
  }, [fetchLeaderboard]);

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/community"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-amber-900 dark:hover:text-amber-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                Community
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Leaderboard
                </span>
              </h1>

              <p className="hidden text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:block">
                Top contributors of TedBus Community
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
            <Users className="h-3.5 w-3.5" />
            {loading ? "..." : `${leaderboard.length} ranked`}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero banner */}
        <div className="relative mb-6 overflow-hidden rounded-[2rem] shadow-2xl shadow-amber-500/15">
          {/* Gradient background */}
          <div className="relative bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-yellow-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] [background-size:40px_40px] opacity-20" />

            <div className="relative flex items-start gap-4">
              {/* Trophy icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-xl shadow-lg">
                <Trophy className="h-8 w-8 fill-white" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                  <Crown className="h-3 w-3" />
                  Top Contributors
                </div>

                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Leaderboard
                </h2>

                <p className="mt-1 text-sm font-medium text-amber-100/85">
                  Earn points by contributing to
                  TedBus Community
                </p>
              </div>
            </div>

            {/* Score rules */}
            <div className="relative mt-5 grid grid-cols-3 divide-x divide-white/20 overflow-hidden rounded-2xl border border-white/15 bg-black/10 backdrop-blur-xl">
              {SCORE_RULES.map((rule) => {
                const RuleIcon = rule.icon;

                return (
                  <div
                    key={rule.action}
                    className="flex flex-col items-center gap-1.5 p-3 text-center"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                      <RuleIcon className="h-4 w-4 text-white" />
                    </div>

                    <p className="text-xl font-black leading-none">
                      {rule.points}
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/70">
                      {rule.action}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ticket notch */}
          <div className="relative z-10">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
          </div>

          {/* Bottom info strip */}
          <div className="flex items-center justify-between gap-3 bg-white px-5 py-3 dark:bg-slate-900 sm:px-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Rankings update in real-time
            </div>

            <span className="flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              Top {loading ? "—" : leaderboard.length} contributors
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((index) => {
              const gradients = [
                "from-amber-200 via-yellow-100 to-orange-200 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950",
                "from-slate-200 via-zinc-100 to-slate-200 dark:from-slate-800 dark:via-zinc-900 dark:to-slate-800",
                "from-orange-200 via-amber-100 to-yellow-200 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950",
                "from-violet-100 via-indigo-50 to-violet-100 dark:from-violet-950 dark:via-indigo-950 dark:to-violet-950",
                "from-teal-100 via-cyan-50 to-teal-100 dark:from-teal-950 dark:via-cyan-950 dark:to-teal-950",
              ];

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`h-0.5 animate-pulse bg-gradient-to-r ${gradients[index]} opacity-60`}
                  />

                  <div className="flex items-center gap-3 p-4 sm:p-5">
                    <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                    </div>

                    <div className="space-y-1 text-right">
                      <div className="h-6 w-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                      <div className="h-2 w-10 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard table */}
        {!loading && (
          <LeaderboardTable users={leaderboard} />
        )}
      </div>
    </main>
  );
};

export default Leaderboard;