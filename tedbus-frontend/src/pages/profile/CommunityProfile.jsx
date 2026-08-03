import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Grid3x3,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import useProfile from "../../hooks/useProfile";
import usePosts from "../../hooks/usePosts";
import UserBadges from "../../components/profile/UserBadges";
import { useAuth } from "../../components/context/AuthContext";

const statThemes = [
  {
    label: "posts",
    icon: Grid3x3,
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    iconColor: "text-red-500 dark:text-red-400",
  },
  {
    label: "answers",
    icon: MessageCircle,
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    iconColor: "text-violet-500 dark:text-violet-400",
  },
  {
    label: "upvotes",
    icon: Heart,
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    iconColor: "text-amber-500 dark:text-amber-400",
  },
];

const tabThemes = {
  posts: {
    activeText: "text-red-600 dark:text-red-400",
    activeBorder: "border-red-600 dark:border-red-400",
    activeIcon: "text-red-600 dark:text-red-400",
    hoverText:
      "hover:text-red-500 dark:hover:text-red-400",
  },
  saved: {
    activeText: "text-emerald-600 dark:text-emerald-400",
    activeBorder:
      "border-emerald-600 dark:border-emerald-400",
    activeIcon:
      "text-emerald-600 dark:text-emerald-400",
    hoverText:
      "hover:text-emerald-500 dark:hover:text-emerald-400",
  },
  answers: {
    activeText: "text-violet-600 dark:text-violet-400",
    activeBorder:
      "border-violet-600 dark:border-violet-400",
    activeIcon: "text-violet-600 dark:text-violet-400",
    hoverText:
      "hover:text-violet-500 dark:hover:text-violet-400",
  },
};

const CommunityProfile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const {
    profileData,
    savedPosts,
    loading,
    fetchProfile,
    fetchSavedPosts,
  } = useProfile();

  const { posts, fetchPosts } = usePosts();

  const [activeTab, setActiveTab] = useState("posts");

  const isMyProfile =
    !id || id === currentUser?._id;

  useEffect(() => {
    if (isMyProfile) {
      fetchProfile("me");
    } else {
      fetchProfile(id);
    }
  }, [id, isMyProfile, fetchProfile]);

  useEffect(() => {
    if (activeTab === "saved" && isMyProfile) {
      fetchSavedPosts();
    }
  }, [activeTab, isMyProfile, fetchSavedPosts]);

  if (loading && !profileData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-600 dark:text-red-400" />

          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Loading profile...
          </p>
        </div>
      </main>
    );
  }

  if (!profileData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-slate-950">
        <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-2xl shadow-red-500/10 dark:border-red-900/50 dark:bg-slate-900">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Users className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-xl font-black text-slate-900 dark:text-white">
              Profile not found
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              This user profile doesn&apos;t exist or
              has been removed.
            </p>

            <Link
              to="/community"
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Community
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { user, stats, badges } = profileData;

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || "U";

  const statValues = [
    stats.postCount,
    stats.commentCount,
    stats.totalLikesReceived,
  ];

  const tabs = [
    {
      key: "posts",
      label: "Posts",
      icon: Grid3x3,
      show: true,
    },
    {
      key: "saved",
      label: "Saved",
      icon: Bookmark,
      show: isMyProfile,
    },
    {
      key: "answers",
      label: "Answers",
      icon: MessageCircle,
      show: true,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/community"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
                {user.name}
              </h1>

              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {stats.postCount} posts ·{" "}
                {stats.totalLikesReceived} upvotes
              </p>
            </div>
          </div>

          {isMyProfile && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              Your Profile
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-6 sm:py-7">
        {/* Profile header */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Gradient banner */}
          <div className="relative h-28 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 sm:h-36">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-orange-300/25 blur-3xl" />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%,transparent)] [background-size:40px_40px] opacity-20" />

            {/* Member badge */}
            <div className="absolute right-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                <Sparkles className="h-3 w-3" />
                TedBus Member
              </span>
            </div>
          </div>

          {/* Avatar — overlapping banner */}
          <div className="relative px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="-mt-14 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:gap-5">
              {/* Avatar with gradient ring */}
              <div className="shrink-0">
                <div className="rounded-full bg-gradient-to-tr from-red-500 via-orange-500 to-amber-400 p-[3px] shadow-xl shadow-red-500/20">
                  <div className="rounded-full bg-white p-[3px] dark:bg-slate-900">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-orange-500 text-3xl font-black text-white sm:h-28 sm:w-28 sm:text-4xl">
                        {userInitial}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* User info */}
              <div className="flex-1 text-center sm:pb-1 sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                  <h1 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                    {user.name}
                  </h1>

                  {isMyProfile && (
                    <Link
                      to="/profile"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                  {user.city && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                      {user.city}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                    Joined{" "}
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats cards */}
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {statThemes.map((theme, index) => {
                const StatIcon = theme.icon;

                return (
                  <div
                    key={theme.label}
                    className={`rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${theme.softBorder} ${theme.softBg}`}
                  >
                    <div
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-xl ${theme.softBg}`}
                    >
                      <StatIcon
                        className={`h-4 w-4 ${theme.iconColor}`}
                      />
                    </div>

                    <p
                      className={`mt-2 text-lg font-black ${theme.accentText}`}
                    >
                      {statValues[index] || 0}
                    </p>

                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {theme.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges?.length > 0 && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="mb-3 flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Achievements
            </p>

            <UserBadges badges={badges} />
          </div>
        )}

        {/* Tabs */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center border-b border-slate-100 dark:border-slate-800">
            {tabs.map((tab) => {
              if (!tab.show) return null;

              const TabIcon = tab.icon;
              const theme = tabThemes[tab.key];
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition sm:text-xs ${
                    active
                      ? `${theme.activeBorder} ${theme.activeText}`
                      : `border-transparent text-slate-400 dark:text-slate-500 ${theme.hoverText}`
                  }`}
                >
                  <TabIcon
                    className={`h-3.5 w-3.5 ${
                      active
                        ? theme.activeIcon
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="min-h-[300px]">
            {activeTab === "posts" && (
              <UserPostsGrid
                userId={user._id}
                isMyProfile={isMyProfile}
              />
            )}

            {activeTab === "saved" && isMyProfile && (
              <SavedPostsGrid
                savedPosts={savedPosts}
              />
            )}

            {activeTab === "answers" && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                  <MessageCircle className="h-6 w-6" />
                </div>

                <p className="mt-4 text-sm font-black text-slate-700 dark:text-slate-300">
                  Answers coming soon
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Answer history will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const UserPostsGrid = ({ userId, isMyProfile }) => {
  const { posts, loading, fetchPosts } = usePosts();

  useEffect(() => {
    fetchPosts({ author: userId });
  }, [userId, fetchPosts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-red-600 dark:text-red-400" />
      </div>
    );
  }

  const displayPosts = posts.filter(
    (p) => p.author?._id === userId,
  );

  if (displayPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
          <Grid3x3 className="h-6 w-6" />
        </div>

        <p className="mt-4 text-sm font-black text-slate-700 dark:text-slate-300">
          No posts yet
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400 dark:text-slate-500">
          {isMyProfile
            ? "Share your first travel experience!"
            : "This user hasn't posted yet."}
        </p>

        {isMyProfile && (
          <Link
            to="/community/create"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Create Post
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-[2px] sm:gap-1">
      {displayPosts.map((post, index) => {
        const colors = [
          "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
          "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20",
          "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
          "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20",
          "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20",
          "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20",
        ];

        const textColors = [
          "text-red-600 dark:text-red-400",
          "text-violet-600 dark:text-violet-400",
          "text-emerald-600 dark:text-emerald-400",
          "text-amber-600 dark:text-amber-400",
          "text-cyan-600 dark:text-cyan-400",
          "text-pink-600 dark:text-pink-400",
        ];

        const colorIndex = index % colors.length;

        return (
          <Link
            key={post._id}
            to={`/community/post/${post._id}`}
            className="group relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
          >
            {post.images?.[0]?.url ? (
              <img
                src={post.images[0].url}
                alt={post.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br p-3 ${colors[colorIndex]}`}
              >
                <p
                  className={`line-clamp-4 text-center text-[10px] font-black leading-4 sm:text-xs ${textColors[colorIndex]}`}
                >
                  {post.title}
                </p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
              <div className="flex items-center gap-3 text-white">
                <span className="flex items-center gap-1 text-sm font-black">
                  <Heart className="h-4 w-4 fill-white" />
                  {post.likes?.length ||
                    post.likesCount ||
                    0}
                </span>

                <span className="flex items-center gap-1 text-sm font-black">
                  <MessageCircle className="h-4 w-4 fill-white" />
                  {post.comments?.length ||
                    post.commentCount ||
                    0}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

const SavedPostsGrid = ({ savedPosts }) => {
  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Bookmark className="h-6 w-6" />
        </div>

        <p className="mt-4 text-sm font-black text-slate-700 dark:text-slate-300">
          No saved posts yet
        </p>

        <p className="mx-auto mt-1 max-w-xs text-center text-xs font-medium text-slate-400 dark:text-slate-500">
          Bookmark posts to see them here for quick
          access.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-[2px] sm:gap-1">
      {savedPosts.map((saved, index) => {
        if (!saved.post) return null;

        const colors = [
          "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
          "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20",
          "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20",
          "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20",
          "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20",
          "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
        ];

        const textColors = [
          "text-emerald-600 dark:text-emerald-400",
          "text-cyan-600 dark:text-cyan-400",
          "text-violet-600 dark:text-violet-400",
          "text-amber-600 dark:text-amber-400",
          "text-pink-600 dark:text-pink-400",
          "text-red-600 dark:text-red-400",
        ];

        const colorIndex = index % colors.length;

        return (
          <Link
            key={saved._id}
            to={`/community/post/${saved.post._id}`}
            className="group relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
          >
            {saved.post.images?.[0]?.url ? (
              <img
                src={saved.post.images[0].url}
                alt={saved.post.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center bg-gradient-to-br p-3 ${colors[colorIndex]}`}
              >
                <p
                  className={`line-clamp-4 text-center text-[10px] font-black leading-4 sm:text-xs ${textColors[colorIndex]}`}
                >
                  {saved.post.title}
                </p>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
              <div className="flex items-center gap-2 text-white">
                <Bookmark className="h-5 w-5 fill-white" />

                <span className="text-sm font-black">
                  Saved
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CommunityProfile;