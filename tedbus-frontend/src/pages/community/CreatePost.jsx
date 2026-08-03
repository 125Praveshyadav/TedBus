import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ImagePlus,
  MapPin,
  Tag,
  ArrowLeft,
  Loader2,
  Send,
  X,
  BookOpen,
  Lightbulb,
  Camera,
  MessageCircle,
} from "lucide-react";
import usePosts from "../../hooks/usePosts";
import { toast } from "react-toastify";

const postTypeConfig = {
  story: {
    label: "Travel Story",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    ring: "ring-emerald-500/20",
  },
  tip: {
    label: "Travel Tip",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-500/20",
  },
  photo: {
    label: "Photo Gallery",
    icon: Camera,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    ring: "ring-blue-500/20",
  },
  discussion: {
    label: "Discussion",
    icon: MessageCircle,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    ring: "ring-purple-500/20",
  },
};

const CreatePost = () => {
  const navigate = useNavigate();
  const { createNewPost, loading } = usePosts();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    postType: "story",
    source: "",
    destination: "",
    tags: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages([...images, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // cleanup memory
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required!");
      return;
    }

    const postData = new FormData();
    postData.append("title", formData.title);
    postData.append("content", formData.content);
    postData.append("postType", formData.postType);

    if (formData.source) postData.append("source", formData.source);
    if (formData.destination)
      postData.append("destination", formData.destination);
    if (formData.tags) postData.append("tags", formData.tags);

    images.forEach((img) => {
      postData.append("images", img);
    });

    const success = await createNewPost(postData);
    if (success) {
      navigate("/community");
    }
  };

  const activeType = postTypeConfig[formData.postType];
  const ActiveIcon = activeType.icon;
  const charCount = formData.content.length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* ── Full-width Top Bar ── */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between h-16">
          <Link
            to="/community"
            className="group inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-bold transition-all duration-200"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            <span className="hidden sm:inline">Back to Community</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${activeType.bg} ${activeType.border} border`}
            >
              <ActiveIcon size={14} className={activeType.color} />
              <span
                className={`text-xs font-bold ${activeType.color} uppercase tracking-wide`}
              >
                {activeType.label}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-red-500/25 hover:bg-red-700 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Send size={16} />
              )}
              <span className="hidden xs:inline">
                {loading ? "Publishing..." : "Publish"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 lg:py-10">
        <div className="w-full max-w-[1400px] mx-auto">
          {/* Page Heading */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Create a{" "}
              <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Post
              </span>
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
              Share your travel stories, tips, and experiences with the
              community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
            {/* ── Left Column (Main Inputs) ── */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title */}
              <div className="group space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  Post Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. My amazing journey to Manali"
                  maxLength={120}
                  className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/50 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-500/20 transition-all duration-200 outline-none font-semibold text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  required
                />
                <div className="flex justify-end">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                    {formData.title.length}/120
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  Your Story / Content
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows="10"
                    placeholder="Write your experience, tips, or ask a question... Let the community know about your journey!"
                    className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700/50 focus:border-red-500 dark:focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-500/20 transition-all duration-200 outline-none font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none leading-relaxed"
                    required
                  />
                  <div className="absolute bottom-3 right-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        charCount > 2000
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-700/50 dark:text-slate-500"
                      }`}
                    >
                      {charCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <ImagePlus size={16} className="text-blue-500" />
                  Add Photos
                  <span className="text-slate-400 dark:text-slate-500 font-medium">
                    ({images.length}/5)
                  </span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                  {/* Previews */}
                  {imagePreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-slate-200 dark:border-slate-700 group/img hover:border-red-400 dark:hover:border-red-500 transition-colors duration-200"
                    >
                      <img
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-200" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 backdrop-blur-sm text-white rounded-full p-1 w-7 h-7 flex items-center justify-center shadow-lg opacity-0 group-hover/img:opacity-100 hover:bg-red-700 hover:scale-110 transition-all duration-200"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {images.length < 5 && (
                    <label className="aspect-square flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl text-slate-400 dark:text-slate-500 hover:border-red-500 dark:hover:border-red-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-500/5 cursor-pointer transition-all duration-200 active:scale-95">
                      <ImagePlus size={24} />
                      <span className="text-xs font-bold">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right Column (Sidebar) ── */}
            <div className="lg:col-span-4 space-y-6">
              {/* Post Type Selection */}
              <div className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Post Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(postTypeConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    const isActive = formData.postType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, postType: key })
                        }
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 active:scale-95 ${
                          isActive
                            ? `${config.bg} ${config.border} ${config.color} ring-2 ${config.ring}`
                            : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/30"
                        }`}
                      >
                        <Icon size={16} />
                        <span className="truncate">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Route (Optional) */}
              <div className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 space-y-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <MapPin size={16} className="text-red-500" />
                  Add Route
                  <span className="text-slate-400 dark:text-slate-500 font-medium text-xs">
                    (Optional)
                  </span>
                </h3>

                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="Source City"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/10 outline-none text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200"
                    />
                  </div>

                  {/* Dotted line connector */}
                  <div className="flex justify-start pl-[18px]">
                    <div className="w-0.5 h-4 border-l-2 border-dotted border-slate-300 dark:border-slate-600" />
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Destination City"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/10 outline-none text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-slate-800/40 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Tag size={16} className="text-slate-400 dark:text-slate-500" />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="budget, night-travel, volvo"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-2 focus:ring-red-500/10 outline-none text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200"
                />
                {formData.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.tags
                      .split(",")
                      .filter((t) => t.trim())
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-100 dark:border-red-500/20"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Bottom Publish Button (visible on large screens) */}
              <div className="hidden lg:block">
                <button
                  type="submit"
                  disabled={loading || !formData.title.trim() || !formData.content.trim()}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={22} />
                  ) : (
                    <Send size={22} />
                  )}
                  {loading ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </div>

            {/* Mobile/Tablet Bottom Submit */}
            <div className="lg:hidden col-span-full pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={22} />
                ) : (
                  <Send size={22} />
                )}
                {loading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;