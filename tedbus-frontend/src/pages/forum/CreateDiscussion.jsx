import { useState } from "react";
import { X, Send, MapPin, Loader2, Sparkles, Tag as TagIcon } from "lucide-react";
import { toast } from "react-toastify";

const CreateDiscussion = ({ forumId, onClose, onCreated }) => {
  const { createNewDiscussion, loading } = useDiscussions(); // Assuming this hook is available

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    source: "",
    destination: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Discussion title is required";
    if (!formData.content.trim()) newErrors.content = "Content cannot be empty";
    if (formData.content.trim().length < 15) {
      newErrors.content = "Content should be at least 15 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      route: {
        source: formData.source.trim(),
        destination: formData.destination.trim(),
      },
      tags: tagsArray,
    };

    const success = await createNewDiscussion(forumId, payload);

    if (success) {
      toast.success("Discussion created successfully!", {
        icon: <Sparkles className="text-violet-500" />,
      });
      onCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-xl">
      <div className="w-full max-w-2xl animate-in fade-in-50 zoom-in-95 duration-300">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black">Start New Discussion</h2>
                <p className="text-xs text-indigo-100">Share your thoughts with the community</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-white/20 transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Discussion Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="What do you want to discuss?"
                className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:ring-2 dark:bg-slate-800 ${
                  errors.title
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 dark:border-slate-700"
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Your Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                placeholder="Share your experience, question, or travel advice..."
                className={`w-full resize-y rounded-2xl border bg-slate-50 px-4 py-3 text-sm leading-relaxed outline-none transition focus:ring-2 dark:bg-slate-800 ${
                  errors.content
                    ? "border-red-400 focus:ring-red-300"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200 dark:border-slate-700"
                }`}
              />
              {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content}</p>}
            </div>

            {/* Route (Optional) */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 mb-3 text-xs font-black text-slate-500 dark:text-slate-400">
                <MapPin className="h-4 w-4 text-indigo-500" />
                ROUTE (OPTIONAL)
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="From (e.g. Delhi)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="To (e.g. Manali)"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Tags <span className="text-slate-400">(comma separated)</span>
              </label>
              <div className="relative">
                <TagIcon className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="solo-travel, budget, night-bus, volvo"
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-11 py-3 text-sm font-medium dark:border-slate-600 dark:bg-slate-900"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-2xl border border-slate-200 py-3.5 font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Start Discussion
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