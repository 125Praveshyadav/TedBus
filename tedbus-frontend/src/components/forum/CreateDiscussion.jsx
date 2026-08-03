import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlignLeft,
  ArrowRight,
  Hash,
  Loader2,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import useDiscussions from "../../hooks/useDiscussions";

const TAG_COLORS = [
  "text-indigo-500 dark:text-indigo-400",
  "text-violet-500 dark:text-violet-400",
  "text-teal-500 dark:text-teal-400",
  "text-amber-500 dark:text-amber-400",
  "text-cyan-500 dark:text-cyan-400",
  "text-fuchsia-500 dark:text-fuchsia-400",
];

const FieldLabel = ({
  label,
  icon: Icon,
  iconColor,
  required,
  hint,
}) => (
  <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
    {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
    {label}
    {required && <span className="text-rose-500">*</span>}
    {hint && (
      <span className="ml-auto font-bold normal-case tracking-normal text-slate-400 dark:text-slate-500">
        {hint}
      </span>
    )}
  </label>
);

const inputBase =
  "w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500";

const CreateDiscussion = ({ forumId, onClose, onCreated }) => {
  const { createNewDiscussion, loading } = useDiscussions();
  const modalRef = useRef(null);
  const titleRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    source: "",
    destination: "",
    tags: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  /* Auto focus title on open */
  useEffect(() => {
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* Close on backdrop click */
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  /* Close on Escape */
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Discussion title is required";
    } else if (formData.title.trim().length < 10) {
      errors.title = "Title must be at least 10 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Discussion details are required";
    } else if (formData.content.trim().length < 20) {
      errors.content = "Details must be at least 20 characters";
    }

    if (formData.source.trim() && !formData.destination.trim()) {
      errors.destination = "Enter destination too";
    }

    if (formData.destination.trim() && !formData.source.trim()) {
      errors.source = "Enter source too";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before posting");
      return;
    }

    const success = await createNewDiscussion(forumId, {
      title: formData.title.trim(),
      content: formData.content.trim(),
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      tags: formData.tags.trim(),
    });

    if (success) {
      onCreated();
    }
  };

  const parsedTags = formData.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const charCounts = {
    title: formData.title.length,
    content: formData.content.length,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="w-full max-h-[95dvh] overflow-hidden rounded-t-[2rem] border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:max-w-2xl sm:rounded-[2rem] animate-in slide-in-from-bottom duration-300"
      >
        {/* Modal header */}
        <div className="relative overflow-hidden">
          {/* Gradient header strip */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 px-5 py-5 text-white sm:px-6">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-36 w-36 rounded-full bg-violet-300/25 blur-2xl" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:36px_36px] opacity-20" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
                  <MessageSquare className="h-5 w-5" />
                </div>

                <div>
                  <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                    <Sparkles className="h-3 w-3" />
                    New Discussion
                  </div>

                  <h2 className="text-lg font-black tracking-tight">
                    Start a Discussion
                  </h2>

                  <p className="mt-0.5 text-[11px] font-medium text-indigo-100/80">
                    Ask questions, share experiences, get answers
                  </p>
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
        </div>

        {/* Scrollable form body */}
        <div className="max-h-[calc(95dvh-140px)] overflow-y-auto [scrollbar-width:thin] sm:max-h-[calc(90dvh-140px)]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 p-5 sm:p-6"
          >
            {/* Title field */}
            <div>
              <FieldLabel
                label="Discussion Title"
                icon={Type}
                iconColor="text-indigo-600 dark:text-indigo-400"
                required
                hint={`${charCounts.title}/120`}
              />

              <input
                ref={titleRef}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Best overnight bus from Delhi to Manali?"
                maxLength={120}
                className={`${inputBase} h-12 px-4 ${
                  fieldErrors.title
                    ? "border-rose-400 ring-rose-500/5 dark:border-rose-800"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 dark:border-slate-700"
                }`}
              />

              {fieldErrors.title && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {fieldErrors.title}
                </p>
              )}
            </div>

            {/* Content field */}
            <div>
              <FieldLabel
                label="Details"
                icon={AlignLeft}
                iconColor="text-violet-600 dark:text-violet-400"
                required
                hint={`${charCounts.content} chars`}
              />

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your question or topic in detail. The more context you provide, the better answers you'll get..."
                className={`${inputBase} resize-none px-4 pt-3.5 leading-6 ${
                  fieldErrors.content
                    ? "border-rose-400 ring-rose-500/5 dark:border-rose-800"
                    : "border-slate-200 focus:border-violet-500 focus:ring-violet-500/10 dark:border-slate-700"
                }`}
              />

              {fieldErrors.content && (
                <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {fieldErrors.content}
                </p>
              )}
            </div>

            {/* Route card */}
            <div className="overflow-hidden rounded-2xl border border-teal-100 bg-teal-50/50 dark:border-teal-900/50 dark:bg-teal-950/20">
              <div className="border-b border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50/50 px-4 py-3 dark:border-teal-900/50 dark:from-teal-950/40 dark:to-cyan-950/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-teal-700 dark:text-teal-400">
                    Route{" "}
                    <span className="font-bold normal-case tracking-normal text-teal-500 dark:text-teal-500">
                      (optional)
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-4">
                <div>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="From (e.g. Delhi)"
                    className={`${inputBase} h-10 px-3 text-xs focus:border-teal-500 focus:ring-teal-500/10 ${
                      fieldErrors.source
                        ? "border-rose-400 dark:border-rose-800"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />

                  {fieldErrors.source && (
                    <p className="mt-1 text-[9px] font-bold text-rose-500">
                      {fieldErrors.source}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="To (e.g. Manali)"
                    className={`${inputBase} h-10 px-3 text-xs focus:border-cyan-500 focus:ring-cyan-500/10 ${
                      fieldErrors.destination
                        ? "border-rose-400 dark:border-rose-800"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />

                  {fieldErrors.destination && (
                    <p className="mt-1 text-[9px] font-bold text-rose-500">
                      {fieldErrors.destination}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tags field */}
            <div>
              <FieldLabel
                label="Tags"
                icon={Hash}
                iconColor="text-amber-600 dark:text-amber-400"
                hint="comma-separated"
              />

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. volvo, night-travel, budget"
                className={`${inputBase} h-11 px-4 border-slate-200 focus:border-amber-500 focus:ring-amber-500/10 dark:border-slate-700`}
              />

              {/* Tag preview */}
              {parsedTags.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {parsedTags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`text-[11px] font-black ${TAG_COLORS[index % TAG_COLORS.length]}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`group flex flex-1 h-11 items-center justify-center gap-2 rounded-2xl text-sm font-black text-white transition-all duration-200 ${
                  loading
                    ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
                    : "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 active:translate-y-0 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Start Discussion
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDiscussion;