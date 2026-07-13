import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, MessageSquare, Loader2, X } from "lucide-react";
import forumService from "../../services/forumService";
import { toast } from "react-toastify";

const ManageCommunityForums = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingForum, setEditingForum] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", icon: "💬" });

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      const data = await forumService.getForums();
      setForums(data.forums || []);
    } catch (err) {
      toast.error("Failed to load forums");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingForum) {
        await forumService.updateForum(editingForum._id, formData);
        toast.success("Forum updated successfully");
      } else {
        await forumService.createForum(formData);
        toast.success("Forum created successfully");
      }
      setShowModal(false);
      setEditingForum(null);
      setFormData({ name: "", description: "", icon: "💬" });
      fetchForums();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure? This will deactivate the forum.")) {
      try {
        await forumService.deleteForum(id);
        toast.success("Forum deactivated");
        fetchForums();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage <span className="text-red-600">Forums</span></h1>
          <p className="text-slate-500 text-sm font-medium">Create and organize community discussion boards</p>
        </div>
        <button
          onClick={() => { setEditingForum(null); setFormData({ name: "", description: "", icon: "💬" }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Forum
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forums.map((forum) => (
            <div key={forum._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-3xl shadow-inner">
                  {forum.icon}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingForum(forum); setFormData({ name: forum.name, description: forum.description, icon: forum.icon }); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(forum._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-1">{forum.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 font-medium">{forum.description}</p>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 w-fit px-3 py-1.5 rounded-lg">
                <MessageSquare size={14} /> {forum.discussionCount || 0} Discussions
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">{editingForum ? "Edit" : "Create"} Forum</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Icon (Emoji)</label>
                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none text-2xl text-center" maxLength="2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Forum Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none font-medium" placeholder="e.g. Travel Stories" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none resize-none text-sm font-medium" rows="3" placeholder="What is this forum about?" />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all active:scale-95">
                {editingForum ? "Save Changes" : "Create Forum"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCommunityForums;