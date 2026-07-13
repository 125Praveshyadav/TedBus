import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Tag, MapPin } from "lucide-react";
import postService from "../../services/postService";
import { toast } from "react-toastify";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      } catch (err) {
        toast.error("Failed to load post");
        navigate("/community");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return toast.error("Title and content are required");
    }

    setSaving(true);
    try {
      const updateData = {
        title: formData.title,
        content: formData.content,
        postType: formData.postType,
        source: formData.source,
        destination: formData.destination,
        tags: formData.tags,
      };

      await postService.updatePost(id, updateData);
      toast.success("Post updated successfully!");
      navigate(`/community/post/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/community/post/${id}`}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Post
        </Link>

        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100">
          <h1 className="text-3xl font-black text-slate-900 mb-8">
            Edit <span className="text-red-600">Post</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Type</label>
                <select
                  name="postType"
                  value={formData.postType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800 cursor-pointer"
                >
                  <option value="story">Travel Story</option>
                  <option value="tip">Travel Tip</option>
                  <option value="photo">Photo Gallery</option>
                  <option value="discussion">Discussion</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-red-500" />
                Route (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  placeholder="Source City"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
                />
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Destination City"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Tag size={16} className="text-slate-400" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. budget, night-travel, volvo"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium text-slate-800"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-[0px_8px_16px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;