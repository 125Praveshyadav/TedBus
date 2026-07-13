import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MessageSquare, Loader2, ArrowLeft } from "lucide-react";
import useForums from "../../hooks/useForums";
import ForumCard from "../../components/forum/ForumCard";
import { useAuth } from "../../components/context/AuthContext";
import { toast } from "react-toastify";
import forumService from "../../services/forumService";

const Forums = () => {
  const { user } = useAuth();
  const { forums, loading, fetchForums } = useForums();
  const [showCreate, setShowCreate] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchForums();
  }, [fetchForums]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Community
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="text-red-600" size={28} />
              Discussion <span className="text-red-600">Forums</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">Join topic-wise conversations</p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-2xl font-bold shadow-[0px_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">New Forum</span>
            </button>
          )}
        </div>

        {/* Admin Create Forum Modal */}
        {showCreate && isAdmin && (
          <CreateForumBox onClose={() => setShowCreate(false)} onCreated={fetchForums} />
        )}

        {/* Forums Grid */}
        {loading && forums.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-red-600" size={40} />
          </div>
        ) : forums.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No forums available</h3>
            <p className="text-slate-500 text-sm">
              {isAdmin ? "Create the first forum to get started" : "Check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forums.map((forum) => (
              <ForumCard key={forum._id} forum={forum} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline Create Forum Component (Admin)
const CreateForumBox = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "💬",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Forum name is required");

    setLoading(true);
    try {
      await forumService.createForum(formData);
      toast.success("Forum created!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create forum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-6">
      <h3 className="text-lg font-black text-slate-800 mb-4">Create New Forum</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="col-span-1 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none text-center text-xl"
            maxLength="4"
          />
          <input
            type="text"
            placeholder="Forum Name (e.g. Route Discussions)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="col-span-3 px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none font-medium"
            required
          />
        </div>
        <textarea
          placeholder="Short description..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="2"
          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none resize-none text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create Forum"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default Forums;