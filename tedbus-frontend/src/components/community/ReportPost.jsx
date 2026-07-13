import React, { useState } from "react";
import { Flag, X, Loader2 } from "lucide-react";
import reportService from "../../services/reportService";
import { toast } from "react-toastify";
import { useAuth } from "../../components/context/AuthContext";

const ReportPost = ({ targetType = "Post", targetId }) => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reasons = [
    { value: "spam", label: "Spam or misleading" },
    { value: "abuse", label: "Abusive or harmful" },
    { value: "inappropriate", label: "Inappropriate content" },
    { value: "misinformation", label: "False information" },
    { value: "other", label: "Something else" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to report");
    if (!reason) return toast.error("Please select a reason");
    if (reason === "other" && description.trim().length < 5) {
      return toast.error("Please provide details (min 5 characters)");
    }

    setLoading(true);
    try {
      await reportService.createReport({
        targetType,
        targetId,
        reason,
        description,
      });
      toast.success("Report submitted. Thank you!");
      setShowModal(false);
      setReason("");
      setDescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        title="Report post"
      >
        <Flag size={16} />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
            
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex items-center justify-between rounded-t-[2.5rem]">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Flag className="text-red-600" size={20} />
                Report Content
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Help us keep TedBus Community safe. Please tell us what's wrong:
              </p>

              {/* Reason Options */}
              <div className="space-y-2">
                {reasons.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      reason === r.value
                        ? "border-red-500 bg-red-50"
                        : "border-slate-100 hover:border-slate-200 bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-red-600"
                    />
                    <span className="text-sm font-bold text-slate-700">{r.label}</span>
                  </label>
                ))}
              </div>

              {/* Description (for "other") */}
              {reason === "other" && (
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue..."
                  rows="3"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-red-500 focus:bg-white outline-none font-medium text-sm resize-none"
                  required
                />
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Flag size={16} />}
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPost;