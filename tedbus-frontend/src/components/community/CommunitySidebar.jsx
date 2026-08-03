import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  MessageSquare,
  Trophy,
  PenSquare,
  Users,
  Bookmark,
  Award,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Crown,
} from "lucide-react";

import useForums from "../../hooks/useForums";
import useProfile from "../../hooks/useProfile";
import usePosts from "../../hooks/usePosts";

// Premium "boarding pass" palette — ink navy / deep teal / brass gold.
// Deliberately not the red-orange default: this is a travellers' community,
// so the token system leans on lounge/passport materials instead.
const TABS = [
  { key: "trending", label: "Trending", icon: Flame },
  { key: "forums", label: "Forums", icon: MessageSquare },
  { key: "leaders", label: "Top", icon: Trophy },
];

const CommunitySidebar = () => {
  const { forums, fetchForums } = useForums();
  const { leaderboard, fetchLeaderboard } = useProfile();
  const { posts: trendingPosts, fetchPosts } = usePosts();

  const [activeTab, setActiveTab] = useState("trending");
  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  useEffect(() => {
    fetchForums({ limit: 6 });
    fetchLeaderboard(5);
    fetchPosts({ sortBy: "trending", limit: 5 });
  }, [fetchForums, fetchLeaderboard, fetchPosts]);

  return (
    <div className="w-full space-y-6">
      <style>{`
        @keyframes cs-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cs-shimmer {
          0% { transform: translateX(-120%) skewX(-12deg); }
          100% { transform: translateX(220%) skewX(-12deg); }
        }
        @keyframes cs-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(201, 162, 75, 0.55); }
          70% { box-shadow: 0 0 0 8px rgba(201, 162, 75, 0); }
          100% { box-shadow: 0 0 0 0 rgba(201, 162, 75, 0); }
        }
        @keyframes cs-glow-drift {
          0%, 100% { opacity: 0.55; transform: translate(0, 0); }
          50% { opacity: 0.9; transform: translate(6px, -4px); }
        }
        .cs-fade-up { animation: cs-fade-up 0.5s ease-out forwards; }
        .cs-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 255, 255, 0.35) 45%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0.35) 55%,
            transparent 100%
          );
          animation: cs-shimmer 3.2s ease-in-out infinite;
          animation-delay: 1s;
          pointer-events: none;
        }
        .cs-pulse { animation: cs-pulse-ring 2.4s ease-out infinite; }
        .cs-glow { animation: cs-glow-drift 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cs-fade-up, .cs-shimmer::after, .cs-pulse, .cs-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Quick Actions — midnight lounge gradient, boarding-pass perforation */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0B1220] via-[#122A4D] to-[#0E4B43] p-6 text-white shadow-2xl shadow-[#0B1220]/30">
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#C9A24B]/20 blur-3xl cs-glow"
          aria-hidden="true"
        />

        <div className="relative mb-5 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#E7CE8C]" />
          <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#E7CE8C]">
            Quick Actions
          </h3>
        </div>

        <div className="relative grid grid-cols-2 gap-3">
          <Link
            to="/community/create-post"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/40 hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9A24B]/15 text-[#E7CE8C] transition-transform duration-300 group-hover:scale-110">
              <PenSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold tracking-wide">New Post</span>
          </Link>

          <Link
            to="/community/forums"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/40 hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9A24B]/15 text-[#E7CE8C] transition-transform duration-300 group-hover:scale-110">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold tracking-wide">Forums</span>
          </Link>

          <Link
            to="/community/profile/me"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/40 hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9A24B]/15 text-[#E7CE8C] transition-transform duration-300 group-hover:scale-110">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold tracking-wide">My Profile</span>
          </Link>

          <Link
            to="/community/profile/me"
            className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A24B]/40 hover:bg-white/10 active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C9A24B]/15 text-[#E7CE8C] transition-transform duration-300 group-hover:scale-110">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold tracking-wide">Saved</span>
          </Link>
        </div>

        {/* Boarding-pass perforation */}
        <div className="relative mt-6 flex items-center">
          <div
            className="h-4 w-4 -translate-x-2 rounded-full bg-white dark:bg-slate-900"
            style={{ boxShadow: "0 0 0 6px rgba(11,18,32,1)" }}
            aria-hidden="true"
          />
          <div
            className="h-px flex-1 border-t-2 border-dashed border-white/20"
            aria-hidden="true"
          />
          <div
            className="h-4 w-4 translate-x-2 rounded-full bg-white dark:bg-slate-900"
            style={{ boxShadow: "0 0 0 6px rgba(11,18,32,1)" }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Tabbed Card — sliding gold indicator */}
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex border-b border-slate-100 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950">
          <div
            className="absolute inset-y-1 rounded-xl bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-slate-900"
            style={{
              width: `calc(${100 / TABS.length}% - 4px)`,
              transform: `translateX(calc(${activeIndex} * (100% + 4px) + 2px))`,
            }}
            aria-hidden="true"
          />

          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-3 text-xs font-black transition-colors duration-300 ${
                  isActive
                    ? "text-[#8A6D1F] dark:text-[#E7CE8C]"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <tab.icon
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {activeTab === "trending" && (
            <div className="space-y-4">
              {trendingPosts.map((post, idx) => (
                <Link
                  key={post._id}
                  to={`/community/post/${post._id}`}
                  className="cs-fade-up group -mx-2 flex items-start gap-3 rounded-2xl px-2 py-2 opacity-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7A2E3A] to-[#A8434F] text-xs font-black text-[#F3D9A4] shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-[#7A2E3A] dark:text-slate-200 dark:group-hover:text-[#E7CE8C]">
                      {post.title}
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">
                      {post.likeCount || 0} upvotes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {activeTab === "forums" && (
            <div className="space-y-2">
              {forums.map((forum, idx) => (
                <Link
                  key={forum._id}
                  to={`/community/forums/${forum.slug || forum._id}`}
                  className="cs-fade-up group flex items-center gap-3 rounded-2xl p-3 opacity-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0E4B43]/10 text-lg dark:bg-[#0E4B43]/30">
                    {forum.icon || "💬"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 group-hover:text-[#0E4B43] dark:text-slate-200 dark:group-hover:text-[#5FD1BE]">
                      {forum.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {forum.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-600" />
                </Link>
              ))}
            </div>
          )}

          {activeTab === "leaders" && (
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => {
                const isFirst = idx === 0;
                return (
                  <Link
                    key={entry._id}
                    to={`/community/profile/${entry._id}`}
                    className="cs-fade-up group flex items-center gap-3 rounded-2xl p-2 opacity-0 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    style={{ animationDelay: `${idx * 70}ms` }}
                  >
                    <div className="relative">
                      <img
                        src={
                          entry.user?.profileImage ||
                          `https://ui-avatars.com/api/?name=${entry.user?.name}&background=0E4B43&color=fff`
                        }
                        alt={entry.user?.name}
                        className={`h-9 w-9 rounded-2xl object-cover ring-2 ${
                          isFirst
                            ? "cs-pulse ring-[#C9A24B]"
                            : "ring-white dark:ring-slate-800"
                        }`}
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white shadow ${
                          isFirst
                            ? "bg-gradient-to-br from-[#E7CE8C] to-[#C9A24B]"
                            : "bg-slate-400"
                        }`}
                      >
                        {isFirst ? (
                          <Crown className="h-2.5 w-2.5" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900 group-hover:text-[#0E4B43] dark:text-white dark:group-hover:text-[#5FD1BE]">
                        {entry.user?.name}
                      </p>
                      <p className="text-xs font-black text-[#0E4B43] dark:text-[#5FD1BE]">
                        {entry.score} points
                      </p>
                    </div>

                    <Award className="h-5 w-5 text-[#C9A24B]" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reputation Banner — gold foil with shimmer sweep */}
      <Link
        to="/community/leaderboard"
        className="cs-shimmer group relative block overflow-hidden rounded-[2rem] border border-[#C9A24B]/30 bg-gradient-to-br from-[#FBF3DE] to-[#F0DFB0] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#C9A24B]/20 dark:from-[#241D0C] dark:to-[#1B1608]"
      >
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E7CE8C] to-[#C9A24B] shadow-inner">
            <Award className="h-6 w-6 text-[#3A2E0C]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-[#8A6D1F] dark:text-[#E7CE8C]">
                Reputation Program
              </p>
              <Sparkles className="h-3.5 w-3.5 text-[#C9A24B]" />
            </div>

            <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
              Earn points • Unlock badges • Rise in leaderboard
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-[#C9A24B] transition-transform group-hover:translate-x-1" />
        </div>
      </Link>

      {/* Guidelines */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#0E4B43] dark:text-[#5FD1BE]" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Community Guidelines
          </p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E4B43] dark:bg-[#5FD1BE]" />
            <p className="text-slate-600 dark:text-slate-400">
              Be respectful and helpful to fellow travellers
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E4B43] dark:bg-[#5FD1BE]" />
            <p className="text-slate-600 dark:text-slate-400">
              Share verified routes and genuine experiences only
            </p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0E4B43] dark:bg-[#5FD1BE]" />
            <p className="text-slate-600 dark:text-slate-400">
              No spam, promotions, or irrelevant content
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;