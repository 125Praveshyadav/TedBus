import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import useForums from "../../hooks/useForums";
import useDiscussions from "../../hooks/useDiscussions";
import DiscussionCard from "../../components/forum/DiscussionCard";
import CreateDiscussion from "../../components/forum/CreateDiscussion";
import { useAuth } from "../../components/context/AuthContext";

const ForumDetails = () => {
  const { slug } = useParams();
  const { user } = useAuth();

  const {
    singleForum,
    fetchForumBySlug,
    loading: forumLoading,
  } = useForums();

  const {
    discussions,
    fetchDiscussionsByForum,
    loading: discussionsLoading,
  } = useDiscussions();

  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchForumBySlug(slug);
  }, [slug, fetchForumBySlug]);

  useEffect(() => {
    if (singleForum?._id) {
      fetchDiscussionsByForum(singleForum._id);
    }
  }, [singleForum, fetchDiscussionsByForum]);

  const handleDiscussionCreated = () => {
    setShowCreate(false);
    fetchDiscussionsByForum(singleForum._id);
  };

  /* ── Loading ── */
  if (forumLoading || !singleForum) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>

          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Loading forum...
          </p>
        </div>
      </main>
    );
  }

  const discussionCount =
    singleForum.discussionCount || discussions.length || 0;

  const memberCount =
    singleForum.memberCount ||
    singleForum.subscriberCount ||
    0;

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/community/forums"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {singleForum.icon || "💬"}
                </span>

                <h1 className="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  {singleForum.name}
                </h1>
              </div>

              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {discussionCount}{" "}
                {discussionCount === 1
                  ? "discussion"
                  : "discussions"}
              </p>
            </div>
          </div>

          {/* Start discussion button */}
          {user && (
            <button
              type="button"
              onClick={() =>
                setShowCreate((prev) => !prev)
              }
              className={`group flex h-9 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black text-white transition-all duration-200 ${
                showCreate
                  ? "bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              }`}
            >
              {showCreate ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Cancel
                  </span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    Start Discussion
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Forum header card */}
        <div className="relative mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Gradient banner */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-600 p-5 text-white sm:p-6">
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-0 h-52 w-52 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:38px_38px] opacity-20" />

            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-4xl backdrop-blur-xl shadow-lg">
                {singleForum.icon || "💬"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                  <Layers className="h-3 w-3" />
                  Forum
                </div>

                <h2 className="text-xl font-black leading-tight tracking-tight sm:text-2xl lg:text-3xl">
                  {singleForum.name}
                </h2>

                {singleForum.description && (
                  <p className="mt-1.5 text-sm font-medium leading-6 text-indigo-100/85">
                    {singleForum.description}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {discussionCount}{" "}
                    {discussionCount === 1
                      ? "Discussion"
                      : "Discussions"}
                  </span>

                  {memberCount > 0 && (
                    <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                      <Users className="h-3.5 w-3.5" />
                      {memberCount} Members
                    </span>
                  )}

                  {discussionCount > 10 && (
                    <span className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/10 px-3 py-1.5 text-[10px] font-black backdrop-blur">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Trending
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket notch */}
          <div className="relative z-10">
            <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
            <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
            <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
          </div>

          {/* Bottom action strip */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              Join the conversation
            </div>

            {user && (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="group flex items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-black text-violet-700 transition hover:bg-violet-100 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400 dark:hover:bg-violet-950/50"
              >
                <Plus className="h-3.5 w-3.5" />
                Start a discussion
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>
        </div>

        {/* Discussions section */}
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Section header */}
          <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/20 sm:p-5">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/15" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Discussions
                  </h2>

                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    {discussionsLoading
                      ? "Loading..."
                      : `${discussions.length} thread${discussions.length !== 1 ? "s" : ""} in this forum`}
                  </p>
                </div>
              </div>

              {user && (
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="group hidden items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-black text-white shadow-md shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] sm:flex"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Discussion
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* Discussions loading */}
            {discussionsLoading &&
              discussions.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>

                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                      Loading discussions...
                    </p>
                  </div>
                </div>
              )}

            {/* Empty state */}
            {!discussionsLoading &&
              discussions.length === 0 && (
                <div className="relative overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60">
                  <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-slate-50 to-indigo-50/50 p-8 text-center dark:from-violet-950/30 dark:via-slate-900 dark:to-indigo-950/20 sm:p-10">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

                    <div className="relative">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                        <MessageSquare className="h-7 w-7" />
                      </div>

                      <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">
                        No discussions yet
                      </h3>

                      <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
                        Be the first to start a
                        conversation in{" "}
                        <span className="font-black text-violet-600 dark:text-violet-400">
                          {singleForum.name}
                        </span>
                        !
                      </p>

                      {user && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowCreate(true)
                          }
                          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                        >
                          <Plus className="h-4 w-4" />
                          Start First Discussion
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Discussion list */}
            {discussions.length > 0 && (
              <div className="space-y-3">
                {discussions.map(
                  (discussion, index) => (
                    <DiscussionCard
                      key={discussion._id}
                      discussion={discussion}
                      index={index}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom hint */}
        {discussions.length > 0 && (
          <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Click any discussion to read and reply
          </div>
        )}
      </div>

      {/* Create discussion modal */}
      {showCreate && (
        <CreateDiscussion
          forumId={singleForum._id}
          onClose={() => setShowCreate(false)}
          onCreated={handleDiscussionCreated}
        />
      )}
    </main>
  );
};

export default ForumDetails;