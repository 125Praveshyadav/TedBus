import  { useState } from "react";
import { X, Send, MapPin, Loader2 } from "lucide-react";
import useDiscussions from "../../hooks/useDiscussions";
import { toast } from "react-toastify";

const CreateDiscussion = ({ forumId, onClose, onCreated }) => {
  const { createNewDiscussion, loading } = useDiscussions();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    source: "",
    destination: "",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      return toast.error("Title and content are required");
    }

    const success = await createNewDiscussion(forumId, formData);
    if (success) {
      onCreated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between rounded-t-[2.5rem]">
          <h2 className="text-xl font-black text-slate-900">Start New Discussion</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Discussion Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Best overnight bus from Delhi to Manali?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium"
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Details *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="5"
              placeholder="Describe your question or topic in detail..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white transition-colors outline-none font-medium resize-none"
              required
            />
          </div>

          {/* Route (Optional) */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-red-500" />
              Add Route (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="From (e.g. Delhi)"
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
              />
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="To (e.g. Manali)"
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-red-500 outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. volvo, night-travel, budget"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 outline-none font-medium text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold shadow-[0px_4px_12px_rgba(220,38,38,0.3)] hover:bg-red-700 active:scale-95 transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              {loading ? "Posting..." : "Start Discussion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDiscussion;