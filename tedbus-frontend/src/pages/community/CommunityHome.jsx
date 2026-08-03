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
} from "lucide-react";

import usePosts from "../../hooks/usePosts";
import PostCard from "../../components/community/PostCard";
import CommunitySidebar from "../../components/community/CommunitySidebar";

const feedTabs = [
  {
    key: "latest",
    label: "Latest",
    icon: Sparkles,
    activeText: "text-red-600 dark:text-red-400",
    activeBorder: "border-red-600 dark:border-red-400",
    activeBg: "bg-red-50 dark:bg-red-950/30",
    hoverText: "hover:text-red-500 dark:hover:text-red-400",
  },
  {
    key: "trending",
    label: "Trending",
    icon: Flame,
    activeText: "text-amber-600 dark:text-amber-400",
    activeBorder: "border-amber-600 dark:border-amber-400",
    activeBg: "bg-amber-50 dark:bg-amber-950/30",
    hoverText: "hover:text-amber-500 dark:hover:text-amber-400",
  },
  {
    key: "top",
    label: "Top",
    icon: TrendingUp,
    activeText: "text-violet-600 dark:text-violet-400",
    activeBorder: "border-violet-600 dark:border-violet-400",
    activeBg: "bg-violet-50 dark:bg-violet-950/30",
    hoverText: "hover:text-violet-500 dark:hover:text-violet-400",
  },
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
    <div className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950 md:pb-10">
      {/* Compact sticky header */}
      <div className="sticky top-0 z-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left — title */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
              <MessageCircle className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                Travel
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Community
                </span>

                <Sparkles className="h-4 w-4 text-amber-500" />
              </h1>

              <p className="hidden text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:block">
                Share stories, ask routes & help fellow travellers
              </p>
            </div>
          </div>

          {/* Right — create post */}
          <Link
            to="/community/create-post"
            className="group hidden items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98] sm:inline-flex"
          >
            <PenSquare className="h-4 w-4" />

            <span className="hidden lg:inline">
              Write a Post
            </span>

            <span className="lg:hidden">Post</span>
          </Link>
        </div>

        {/* Feed tabs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1">
            {feedTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[11px] font-black uppercase tracking-wider transition sm:px-4 sm:text-xs ${
                    isActive
                      ? `${tab.activeBorder} ${tab.activeText}`
                      : `border-transparent text-slate-400 dark:text-slate-500 ${tab.hoverText}`
                  }`}
                >
                  <TabIcon
                    className={`h-3.5 w-3.5 ${
                      isActive
                        ? tab.activeText
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        {/* Mobile create post trigger */}
        <Link
          to="/community/create-post"
          className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 sm:hidden"
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
                  {posts.length === 1
                    ? "post"
                    : "posts"}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    fetchPosts({ sortBy: activeTab })
                  }
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-black text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <RefreshCcw
                    className={`h-3 w-3 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </div>
            )}

            {/* Loading */}
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
                      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
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

            {/* Inline loading when refreshing */}
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
              <div className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-6 text-center shadow-lg dark:border-red-900/50 dark:bg-slate-900 sm:p-8">
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
                    onClick={() =>
                      fetchPosts({ sortBy: activeTab })
                    }
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
              <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900 sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/10" />

                <div className="relative">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                    <PenSquare className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900 dark:text-white">
                    No posts yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Be the first to share a travel story,
                    route tip or bus review!
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
                  <PostCard
                    key={post._id}
                    post={post}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-[120px]">
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