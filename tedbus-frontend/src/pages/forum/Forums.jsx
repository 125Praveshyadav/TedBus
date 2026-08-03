import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Hash,
  Layers,
  Loader2,
  MessageSquare,
  Plus,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import useForums from "../../hooks/useForums";
import ForumCard from "../../components/forum/ForumCard";
import { useAuth } from "../../components/context/AuthContext";
import forumService from "../../services/forumService";

/*
 * Emoji suggestions for quick pick
 */
const EMOJI_SUGGESTIONS = [
  "💬", "🚌", "🗺️", "✈️", "🏙️",
  "🌄", "💡", "❓", "📢", "🎒",
  "🛣️", "🌍", "🔥", "⭐", "🏆",
];

const inputBase =
  "w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500";

/* ── Inline admin create form ── */
const CreateForumBox = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💬",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = "Forum name is required";
    else if (formData.name.trim().length < 3)
      errs.name = "Name must be at least 3 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await forumService.createForum({
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
      });
      toast.success("Forum created successfully!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to create forum",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      {/* Card header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-5 text-white dark:border-slate-800 sm:p-6">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-36 w-36 rounded-full bg-indigo-300/25 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:36px_36px] opacity-20" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
              <Layers className="h-5 w-5" />
            </div>

            <div>
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                <Sparkles className="h-3 w-3" />
                Admin
              </div>

              <h3 className="text-base font-black">
                Create New Forum
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Form body */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 p-5 sm:p-6"
      >
        {/* Emoji + Name row */}
        <div className="flex gap-3">
          {/* Emoji picker */}
          <div className="shrink-0">
            <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Icon
            </label>

            <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-800/70">
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                maxLength={4}
                className="h-full w-full bg-transparent text-center text-xl outline-none"
              />
            </div>
          </div>

          {/* Name */}
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              <Type className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              Forum Name
              <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Route Discussions"
              className={`${inputBase} h-11 px-4 ${
                errors.name
                  ? "border-rose-400 ring-rose-500/5 dark:border-rose-800"
                  : "border-slate-200 focus:border-violet-500 focus:ring-violet-500/10 dark:border-slate-700"
              }`}
            />

            {errors.name && (
              <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>
        </div>

        {/* Emoji quick pick */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            <Hash className="h-3.5 w-3.5 text-teal-500" />
            Quick pick emoji
          </p>

          <div className="flex flex-wrap gap-1.5">
            {EMOJI_SUGGESTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    icon: emoji,
                  }))
                }
                className={`flex h-9 w-9 items-center justify-center rounded-xl border text-lg transition hover:scale-110 ${
                  formData.icon === emoji
                    ? "border-violet-400 bg-violet-50 shadow-md shadow-violet-500/20 dark:border-violet-700 dark:bg-violet-950/50"
                    : "border-slate-200 bg-white hover:border-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-800"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <MessageSquare className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            Description
            <span className="ml-auto font-bold normal-case tracking-normal text-slate-400">
              optional
            </span>
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe what this forum is about..."
            rows={2}
            className={`${inputBase} resize-none px-4 pt-3.5 leading-6 border-slate-200 focus:border-teal-500 focus:ring-teal-500/10 dark:border-slate-700`}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`group flex flex-1 h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all duration-200 ${
              loading
                ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
                : "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Forum
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ── Main Forums page ── */
const Forums = () => {
  const { user } = useAuth();
  const { forums, loading, fetchForums } = useForums();
  const [showCreate, setShowCreate] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/community"
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-violet-900 dark:hover:text-violet-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <h1 className="flex items-center gap-1.5 text-sm font-black text-slate-900 dark:text-white sm:text-base">
                Discussion
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Forums
                </span>
              </h1>

              <p className="hidden text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:block">
                Join topic-wise conversations &
                discussions
              </p>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() =>
                setShowCreate((prev) => !prev)
              }
              className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white transition-all duration-200 ${
                showCreate
                  ? "bg-slate-600 hover:bg-slate-700"
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
                    New Forum
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero info row */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-violet-500/25">
              <MessageSquare className="h-7 w-7" />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
                Community
              </p>

              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                All Forums
              </h2>

              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                {loading
                  ? "Loading..."
                  : `${forums.length} forum${forums.length !== 1 ? "s" : ""} available`}
              </p>
            </div>
          </div>

          {/* Stats mini badges */}
          {!loading && forums.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-2 text-[10px] font-black text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                <Layers className="h-3.5 w-3.5" />
                {forums.length} Forums
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-[10px] font-black text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400">
                <Sparkles className="h-3.5 w-3.5" />
                Active
              </span>
            </div>
          )}
        </div>

        {/* Admin create forum form */}
        {showCreate && isAdmin && (
          <CreateForumBox
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              fetchForums();
              setShowCreate(false);
            }}
          />
        )}

        {/* Loading skeleton */}
        {loading && forums.length === 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => {
              const gradients = [
                "from-violet-200 via-indigo-100 to-blue-200 dark:from-violet-950 dark:via-indigo-950 dark:to-blue-950",
                "from-teal-200 via-cyan-100 to-teal-200 dark:from-teal-950 dark:via-cyan-950 dark:to-teal-950",
                "from-amber-200 via-orange-100 to-amber-200 dark:from-amber-950 dark:via-orange-950 dark:to-amber-950",
                "from-fuchsia-200 via-purple-100 to-fuchsia-200 dark:from-fuchsia-950 dark:via-purple-950 dark:to-fuchsia-950",
              ];

              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className={`h-1.5 animate-pulse bg-gradient-to-r ${gradients[index]} opacity-50`}
                  />

                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />

                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                      <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && forums.length === 0 && (
          <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50/50 p-8 text-center dark:from-violet-950/30 dark:via-slate-900 dark:to-indigo-950/20 sm:p-10">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                  <MessageSquare className="h-8 w-8" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                  No forums available
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
                  {isAdmin
                    ? "Create the first forum to get the community conversations started!"
                    : "No forums have been created yet. Check back later!"}
                </p>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Forum
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Forums grid */}
        {!loading && forums.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {forums.map((forum, index) => (
                <ForumCard
                  key={forum._id}
                  forum={forum}
                  index={index}
                />
              ))}
            </div>

            {/* Bottom hint */}
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              Click any forum to join the discussion
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Forums;