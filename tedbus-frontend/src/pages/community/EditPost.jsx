import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  FileEdit,
  Loader2,
  MapPin,
  Save,
  Sparkles,
  Tag,
  Type,
  AlignLeft,
  ListFilter,
} from "lucide-react";
import { toast } from "react-toastify";

import postService from "../../services/postService";

const POST_TYPES = [
  {
    value: "story",
    label: "Travel Story",
    emoji: "✈️",
    color:
      "bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
    activeColor:
      "bg-violet-600 text-white shadow-lg shadow-violet-500/25",
  },
  {
    value: "tip",
    label: "Travel Tip",
    emoji: "💡",
    color:
      "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    activeColor:
      "bg-amber-500 text-white shadow-lg shadow-amber-500/25",
  },
  {
    value: "photo",
    label: "Photo Gallery",
    emoji: "📷",
    color:
      "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border-cyan-100 dark:border-cyan-900/50",
    activeColor:
      "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25",
  },
  {
    value: "discussion",
    label: "Discussion",
    emoji: "💬",
    color:
      "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    activeColor:
      "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
  },
];

const FormField = ({
  label,
  error,
  icon: Icon,
  iconBg = "bg-red-50 dark:bg-red-950/40",
  iconColor = "text-red-600 dark:text-red-400",
  required = false,
  hint,
  children,
}) => {
  const hasError = Boolean(error);

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
        {Icon && (
          <Icon
            className={`h-3.5 w-3.5 ${iconColor}`}
          />
        )}
        {label}
        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>

      {children}

      {hint && !hasError && (
        <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}

      {hasError && (
        <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

const inputClass = (hasError = false) =>
  `h-11 w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 px-4 ${
    hasError
      ? "border-red-400 ring-red-500/5 dark:border-red-800"
      : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
  }`;

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: "story",
    source: "",
    destination: "",
    tags: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getPostById(id);
        const post = data?.post || data;

        setFormData({
          title: post.title || "",
          content: post.content || "",
          postType: post.postType || "story",
          source: post.route?.source || "",
          destination: post.route?.destination || "",
          tags: post.tags?.join(", ") || "",
        });
      } catch {
        toast.error("Failed to load post");
        navigate("/community");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Post title is required";
    } else if (formData.title.trim().length < 5) {
      errors.title =
        "Title must be at least 5 characters";
    }

    if (!formData.content.trim()) {
      errors.content = "Post content is required";
    } else if (
      formData.content.trim().length < 20
    ) {
      errors.content =
        "Content must be at least 20 characters";
    }

    if (
      formData.source.trim() &&
      !formData.destination.trim()
    ) {
      errors.destination =
        "Enter destination too, or leave both empty";
    }

    if (
      formData.destination.trim() &&
      !formData.source.trim()
    ) {
      errors.source =
        "Enter source too, or leave both empty";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      toast.error(
        "Please fix the errors before saving",
      );
      return;
    }

    setSaving(true);

    try {
      await postService.updatePost(id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        postType: formData.postType,
        source: formData.source.trim(),
        destination: formData.destination.trim(),
        tags: formData.tags.trim(),
      });

      toast.success("Post updated successfully!");
      navigate(`/community/post/${id}`);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update post",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>

          <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
            Loading post...
          </p>
        </div>
      </main>
    );
  }

  const selectedType =
    POST_TYPES.find(
      (t) => t.value === formData.postType,
    ) || POST_TYPES[0];

  const charCount = {
    title: formData.title.length,
    content: formData.content.length,
  };

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={`/community/post/${id}`}
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  Edit Post
                </h1>

                <span
                  className={`hidden rounded-full px-2 py-0.5 text-[8px] font-black sm:inline ${selectedType.activeColor}`}
                >
                  {selectedType.emoji}{" "}
                  {selectedType.label}
                </span>
              </div>

              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                Make changes and save
              </p>
            </div>
          </div>

          <button
            type="submit"
            form="edit-post-form"
            disabled={saving}
            className={`group flex h-9 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-black text-white transition-all duration-200 ${
              saving
                ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
                : "bg-gradient-to-r from-red-600 to-orange-500 shadow-lg shadow-red-500/25 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
            }`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <form
          id="edit-post-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          {/* Post type selector */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-violet-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20 sm:p-5">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/25">
                  <ListFilter className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    Post Type
                  </h2>

                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Select what kind of post this is
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-4 sm:p-5">
              {POST_TYPES.map((type) => {
                const isActive =
                  formData.postType === type.value;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() =>
                      setFormData((current) => ({
                        ...current,
                        postType: type.value,
                      }))
                    }
                    className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-left text-xs font-black transition-all duration-200 ${
                      isActive
                        ? `${type.activeColor} border-transparent`
                        : `${type.color} border hover:scale-[1.02]`
                    }`}
                  >
                    <span className="text-sm">
                      {type.emoji}
                    </span>
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title + Content card */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-red-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-red-950/20 sm:p-5">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/15" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25">
                  <FileEdit className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    Post Content
                  </h2>

                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Edit your title and main content
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-4 sm:p-5">
              {/* Title */}
              <FormField
                label="Post Title"
                error={fieldErrors.title}
                icon={Type}
                iconColor="text-red-600 dark:text-red-400"
                required
                hint={`${charCount.title} characters`}
              >
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your post a compelling title..."
                  maxLength={120}
                  className={inputClass(
                    Boolean(fieldErrors.title),
                  )}
                />
              </FormField>

              {/* Content */}
              <FormField
                label="Content"
                error={fieldErrors.content}
                icon={AlignLeft}
                iconColor="text-violet-600 dark:text-violet-400"
                required
                hint={`${charCount.content} characters · minimum 20`}
              >
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Share your full story, experience or travel tip here..."
                  rows={7}
                  className={`w-full resize-none rounded-xl border bg-slate-50 px-4 pt-3.5 text-sm font-bold leading-6 text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
                    fieldErrors.content
                      ? "border-red-400 ring-red-500/5 dark:border-red-800"
                      : "border-slate-200 focus:border-violet-500 focus:ring-violet-500/10 dark:border-slate-700"
                  }`}
                />
              </FormField>
            </div>
          </div>

          {/* Route card */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-emerald-950/20 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    Route{" "}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      (optional)
                    </span>
                  </h2>

                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Add source & destination if relevant
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              <FormField
                label="Source City"
                error={fieldErrors.source}
                icon={MapPin}
                iconColor="text-emerald-600 dark:text-emerald-400"
              >
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="e.g. Delhi"
                  className={`${inputClass(Boolean(fieldErrors.source))} focus:border-emerald-500 focus:ring-emerald-500/10`}
                />
              </FormField>

              <FormField
                label="Destination City"
                error={fieldErrors.destination}
                icon={MapPin}
                iconColor="text-cyan-600 dark:text-cyan-400"
              >
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="e.g. Jaipur"
                  className={`${inputClass(Boolean(fieldErrors.destination))} focus:border-cyan-500 focus:ring-cyan-500/10`}
                />
              </FormField>
            </div>
          </div>

          {/* Tags card */}
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-amber-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-amber-950/20 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Tag className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white">
                    Tags{" "}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      (optional)
                    </span>
                  </h2>

                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Comma-separated tags help others
                    discover your post
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <FormField
                label="Tags"
                icon={Tag}
                iconColor="text-amber-600 dark:text-amber-400"
                hint="Example: budget, night-travel, volvo, delhi"
              >
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="budget, night-travel, volvo..."
                  className={`${inputClass()} focus:border-amber-500 focus:ring-amber-500/10`}
                />
              </FormField>

              {/* Tag preview */}
              {formData.tags.trim() && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag, index) => {
                      const colors = [
                        "text-red-500 dark:text-red-400",
                        "text-violet-500 dark:text-violet-400",
                        "text-emerald-500 dark:text-emerald-400",
                        "text-amber-500 dark:text-amber-400",
                        "text-cyan-500 dark:text-cyan-400",
                        "text-pink-500 dark:text-pink-400",
                      ];

                      return (
                        <span
                          key={`${tag}-${index}`}
                          className={`text-[11px] font-black ${colors[index % colors.length]}`}
                        >
                          #{tag}
                        </span>
                      );
                    })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Changes auto-validated before saving
            </div>

            <div className="flex gap-3">
              <Link
                to={`/community/post/${id}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className={`group flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-black text-white transition-all duration-200 ${
                  saving
                    ? "cursor-not-allowed bg-slate-400 dark:bg-slate-700"
                    : "bg-gradient-to-r from-red-600 to-orange-500 shadow-lg shadow-red-500/25 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                }`}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save Changes"}

                {!saving && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditPost;