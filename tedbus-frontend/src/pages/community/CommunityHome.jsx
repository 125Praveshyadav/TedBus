import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Loader2,
  MessageCircle,
  PenSquare,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Users,
  MapPin,
  Compass,
  ArrowRight,
  Bus,
} from "lucide-react";

import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/community/PostCard";
import CommunitySidebar from "../../components/community/CommunitySidebar";

const feedTabs = [
  {
    key: "latest",
    label: "Latest",
    icon: Sparkles,
    gradient: "from-red-600 to-orange-500",
    ring: "ring-red-500/30",
  },
  {
    key: "trending",
    label: "Trending",
    icon: Flame,
    gradient: "from-amber-500 to-orange-500",
    ring: "ring-amber-500/30",
  },
  {
    key: "top",
    label: "Top",
    icon: TrendingUp,
    gradient: "from-violet-600 to-fuchsia-500",
    ring: "ring-violet-500/30",
  },
];

const heroStats = [
  { label: "Travelers", value: "1.5K+", icon: Users },
  { label: "Stories", value: "250+", icon: MapPin },
  { label: "Routes", value: "50+", icon: Compass },
];

const CommunityHome = () => {
  const { posts, loading, error, fetchPosts } = usePosts();
  const [activeTab, setActiveTab] = useState("latest");

  useEffect(() => {
    fetchPosts({ sortBy: activeTab });
  }, [activeTab, fetchPosts]);

  const handleTabChange = (tabKey) => {
    if (tabKey === activeTab && !loading) {
      fetchPosts({ sortBy: tabKey });
      return;
    }
    setActiveTab(tabKey);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 transition-colors duration-300 dark:bg-slate-950 md:pb-10">
     
      <section className="relative overflow-hidden">
     
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 dark:from-red-950 dark:via-orange-950 dark:to-slate-950" />
        
       
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-yellow-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 animate-pulse rounded-full bg-pink-400/30 blur-3xl [animation-delay:1s]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-64 animate-pulse rounded-full bg-orange-300/30 blur-3xl [animation-delay:2s]" />

       
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8 lg:pb-16 lg:pt-20">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Left content */}
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-widest text-white">
                  Live Community
                </span>
                <Sparkles className="h-3 w-3 text-yellow-300" />
              </div>

              {/* Heading */}
              <h1 className="mt-4 text-3xl font-black leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Share Your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-yellow-200 via-yellow-100 to-white bg-clip-text text-transparent">
                    Journey
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                  >
                    <path
                      d="M2 5.5C50 2 100 2 198 5.5"
                      stroke="#FDE68A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                Inspire Fellow{" "}
                <span className="inline-flex items-center gap-2">
                  Travelers
                  <Bus className="inline h-8 w-8 text-yellow-200 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 max-w-xl text-sm font-medium text-white/90 sm:text-base">
                Connect with bus travelers across India. Share stories, discover hidden routes, get travel tips & build memories together.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to="/community/create-post"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-red-600 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] sm:text-base"
                >
                  <PenSquare className="h-4 w-4" />
                  Share Your Story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="#feed"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20 sm:text-base"
                >
                  <Compass className="h-4 w-4" />
                  Explore Feed
                </a>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md sm:gap-4">
                {heroStats.map((stat) => {
                  const StatIcon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/15 sm:p-4"
                    >
                      <StatIcon className="h-4 w-4 text-yellow-200 sm:h-5 sm:w-5" />
                      <p className="mt-1.5 text-lg font-black text-white sm:text-xl">
                        {stat.value}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 sm:text-[11px]">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Floating cards (hidden on mobile) */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="relative h-[420px]">
                {/* Card 1 — Top */}
                <div className="absolute right-0 top-0 w-64 rotate-3 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition hover:rotate-0 dark:bg-slate-900/95">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-black text-white">
                      SS
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        Saumya S.
                      </p>
                      <p className="text-[10px] font-bold text-slate-500">
                        Delhi → Lucknow
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    "Best overnight bus experience! TedBus AC sleeper was 🔥"
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-slate-400">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>1.2k likes</span>
                  </div>
                </div>

                {/* Card 2 — Middle */}
                <div className="absolute left-0 top-32 w-64 -rotate-6 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition hover:rotate-0 dark:bg-slate-900/95">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-500 text-xs font-black text-white">
                      RS
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        Rakshit S.
                      </p>
                      <p className="text-[10px] font-bold text-slate-500">
                        Mumbai → Goa
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    "Pro tip: Book window seat on left for sunset views! 🌅"
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-slate-400">
                    <MessageCircle className="h-3 w-3 text-blue-500" />
                    <span>324 comments</span>
                  </div>
                </div>

                {/* Card 3 — Bottom */}
                <div className="absolute bottom-0 right-8 w-64 rotate-6 rounded-2xl border border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition hover:rotate-0 dark:bg-slate-900/95">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-black text-white">
                      VS
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">
                        Vijay Y.
                      </p>
                      <p className="text-[10px] font-bold text-slate-500">
                        Delhi → Deoria
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                    "Ghats route was breathtaking! Sharing my full itinerary 📍"
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] font-black text-slate-400">
                    <TrendingUp className="h-3 w-3 text-violet-500" />
                    <span>Trending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg
          className="relative block w-full text-slate-50 dark:text-slate-950"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,32L60,32C120,32,240,32,360,37.3C480,43,600,53,720,50.7C840,48,960,32,1080,26.7C1200,21,1320,27,1380,29.3L1440,32L1440,60L1380,60C1320,60,1200,60,1080,60C960,60,840,60,720,60C600,60,480,60,360,60C240,60,120,60,60,60L0,60Z"
          />
        </svg>
      </section>

      {/* ═══════════════════ STICKY TABS ═══════════════════ */}
      <div
        id="feed"
        className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Pill tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100/70 p-1 dark:border-slate-800 dark:bg-slate-800/50">
            {feedTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition sm:px-4 sm:text-xs ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg ${tab.ring} shadow-black/10`
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Create button */}
          <Link
            to="/community/create-post"
            className="group hidden items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] sm:inline-flex"
          >
            <PenSquare className="h-4 w-4" />
            <span className="hidden lg:inline">Write a Post</span>
            <span className="lg:hidden">Post</span>
          </Link>

          {/* Mobile refresh */}
          <button
            type="button"
            onClick={() => fetchPosts({ sortBy: activeTab })}
            disabled={loading}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 sm:hidden"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ═══════════════════ BODY ═══════════════════ */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* Mobile create post trigger */}
        <Link
          to="/community/create-post"
          className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 sm:hidden"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20">
            <PenSquare className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Share your travel experience...
          </span>
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main feed */}
          <div className="lg:col-span-8">
            {/* Active tab indicator */}
            {!loading && !error && posts.length > 0 && (
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                  Showing{" "}
                  <span className="font-black text-slate-700 dark:text-slate-300">
                    {posts.length}
                  </span>{" "}
                  {posts.length === 1 ? "post" : "posts"}
                </p>

                <button
                  type="button"
                  onClick={() => fetchPosts({ sortBy: activeTab })}
                  disabled={loading}
                  className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-black text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 sm:flex"
                >
                  <RefreshCcw
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && posts.length === 0 && (
              <div className="space-y-4">
                {[0, 1, 2].map((index) => {
                  const gradients = [
                    "from-red-200 via-orange-100 to-red-100 dark:from-red-950 dark:via-slate-900 dark:to-orange-950",
                    "from-violet-200 via-purple-100 to-violet-100 dark:from-violet-950 dark:via-slate-900 dark:to-purple-950",
                    "from-emerald-200 via-teal-100 to-emerald-100 dark:from-emerald-950 dark:via-slate-900 dark:to-teal-950",
                  ];

                  return (
                    <div
                      key={index}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div
                        className={`h-1.5 animate-pulse bg-gradient-to-r ${gradients[index]} opacity-40`}
                      />
                      <div className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="h-2 w-1/4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                        </div>
                        <div className="mt-4 h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                        <div className="mt-4 flex gap-4">
                          <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                          <div className="h-8 w-16 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inline loading */}
            {loading && posts.length > 0 && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white py-3 dark:border-slate-800 dark:bg-slate-900">
                <Loader2 className="h-4 w-4 animate-spin text-red-600 dark:text-red-400" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Loading posts...
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-white p-6 text-center shadow-lg dark:border-red-900/50 dark:bg-slate-900 sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/15" />
                <div className="relative">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <MessageCircle className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                    Unable to load posts
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchPosts({ sortBy: activeTab })}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && posts.length === 0 && (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/10" />
                <div className="relative">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                    <PenSquare className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    No posts yet
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Be the first to share a travel story, route tip or bus review!
                  </p>
                  <Link
                    to="/community/create-post"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                  >
                    <PenSquare className="h-4 w-4" />
                    Create First Post
                  </Link>
                </div>
              </div>
            )}

            {/* Posts feed */}
            {posts.length > 0 && (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-[88px]">
              <CommunitySidebar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <Link
        to="/community/create-post"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-2xl shadow-red-500/30 transition hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Create post"
      >
        <PenSquare className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default CommunityHome;