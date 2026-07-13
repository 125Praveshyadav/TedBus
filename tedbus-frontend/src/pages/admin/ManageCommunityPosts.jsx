import  { useEffect, useState, useCallback } from "react";
import {
  Search,
  Trash2,
  Eye,
  Loader2,
  MessageSquare,
  Heart,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import api from "../../services/api";
import postService from "../../services/postService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const statusConfig = {
  approved: { label: "Approved", bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  pending: { label: "Pending", bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
};

const ManageCommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = useCallback(async (showToast = false) => {
    try {
      setLoading(true);
      const response = await postService.getPosts({ limit: 200 });
      const fetchedPosts =
        response?.posts ||
        response?.data?.posts ||
        (Array.isArray(response) ? response : []);
      setPosts(fetchedPosts);
      if (showToast) toast.success("Posts list updated");
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(id);
        toast.success("Post deleted successfully");
        fetchPosts();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete post");
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/admin/community/posts/${id}/status`, { status });
      toast.success(`Post ${status} successfully`);
      fetchPosts();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.data?.message || "Failed to update status");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Manage Community <span className="text-red-600">Posts</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Review, approve and moderate user content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-red-600 hover:border-red-100 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          </button>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search title or author..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 outline-none w-full md:w-80 shadow-sm transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
        {["all", "approved", "pending", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              filterStatus === status
                ? "bg-red-600 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading && !isRefreshing ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
          <p className="text-slate-500 font-bold animate-pulse">Loading posts...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">Post Info</th>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">Author</th>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">Engagement</th>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest">Date</th>
                  <th className="px-6 py-5 text-xs font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    const config = statusConfig[post.status] || statusConfig.approved;
                    return (
                      <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                        {/* Post Info */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col max-w-xs">
                            <span className="font-bold text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                              {post.title || "Untitled Post"}
                            </span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2.5 py-1 rounded-lg tracking-wider">
                                {post.postType || "story"}
                              </span>
                              {post.images?.length > 0 && (
                                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg tracking-wider">
                                  {post.images.length} Photos
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {post.author?.profileImage ? (
                              <img
                                src={post.author.profileImage}
                                alt={post.author.name}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase border border-slate-200">
                                {post.author?.name?.charAt(0) || "U"}
                              </div>
                            )}
                            <span className="text-sm font-bold text-slate-700">
                              {post.author?.name || "Unknown"}
                            </span>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.text} ${config.border}`}>
                            {post.status === "approved" && <CheckCircle size={12} />}
                            {post.status === "pending" && <Loader2 size={12} />}
                            {post.status === "rejected" && <XCircle size={12} />}
                            {config.label}
                          </span>
                        </td>

                        {/* Engagement */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                              <Heart size={14} className="text-red-500" fill={post.likeCount > 0 ? "currentColor" : "none"} />
                              <span className="text-xs font-black text-slate-700">{post.likeCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl">
                              <MessageSquare size={14} className="text-blue-500" />
                              <span className="text-xs font-black text-slate-700">{post.commentCount || 0}</span>
                            </div>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <Calendar size={14} className="text-slate-400" />
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {/* Approve Button - Sirf pending posts ke liye */}
                            {post.status !== "approved" && (
                              <button
                                onClick={() => handleStatusUpdate(post._id, "approved")}
                                className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                title="Approve post"
                              >
                                <CheckCircle size={16} />
                                <span className="hidden lg:inline">Approve</span>
                              </button>
                            )}

                            {/* Reject Button - Sirf approved/pending posts ke liye */}
                            {post.status !== "rejected" && (
                              <button
                                onClick={() => handleStatusUpdate(post._id, "rejected")}
                                className="flex items-center gap-1.5 px-3 py-2 bg-orange-50 text-orange-600 rounded-xl text-xs font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                title="Reject post"
                              >
                                <XCircle size={16} />
                                <span className="hidden lg:inline">Reject</span>
                              </button>
                            )}

                            {/* View */}
                            <Link
                              to={`/community/post/${post._id}`}
                              target="_blank"
                              className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                              title="View on site"
                            >
                              <Eye size={16} />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Delete post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <AlertCircle size={40} className="text-slate-200 mb-3" />
                        <p className="text-slate-400 font-bold text-lg">No posts found</p>
                        <p className="text-slate-400 text-sm">Try refreshing or adjusting your filters</p>
                        <button
                          onClick={handleRefresh}
                          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl font-bold text-sm active:scale-95 transition-transform"
                        >
                          Refresh Now
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCommunityPosts;