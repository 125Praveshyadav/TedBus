import React, { useEffect, useState } from "react";
import { Flag, Trash2, CheckCircle, ShieldAlert, Loader2, ExternalLink } from "lucide-react";
import reportService from "../../services/reportService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ManageCommunityReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await reportService.getReports({ status: filter });
      setReports(data.reports || []);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    if (window.confirm("Action: Delete content and resolve report?")) {
      try {
        await reportService.removeReportedContent(reportId);
        toast.success("Content removed and report resolved");
        fetchReports();
      } catch (err) {
        toast.error("Operation failed");
      }
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await reportService.updateReportStatus(reportId, "dismissed");
      toast.success("Report dismissed");
      fetchReports();
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Spam <span className="text-red-600">Reports</span></h1>
          <p className="text-slate-500 text-sm font-medium">Review and moderate reported community content</p>
        </div>
        
        {/* Status Filters */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {["pending", "resolved", "dismissed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                filter === status ? "bg-red-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-600" size={40} /></div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-[2rem] py-20 text-center border-2 border-dashed border-slate-100">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">All Clear!</h3>
          <p className="text-slate-400 font-medium">No {filter} reports to show.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
              {/* Type Badge & Reason */}
              <div className="md:w-48 shrink-0">
                <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-2 ${
                  report.targetType === 'Post' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  {report.targetType} Report
                </span>
                <div className="flex items-center gap-2 text-red-600 font-black text-sm uppercase">
                  <ShieldAlert size={16} /> {report.reason}
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">BY: {report.reportedBy?.name}</p>
              </div>

              {/* Description & Target Info */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-sm font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                  "{report.description || 'No detailed description provided.'}"
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Link 
                    to={`/community/${report.targetType.toLowerCase()}/${report.targetId}`}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:underline"
                  >
                    View Reported Content <ExternalLink size={14} />
                  </Link>
                </div>
              </div>

              {/* Actions */}
              {filter === "pending" && (
                <div className="flex md:flex-col gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleResolve(report._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-red-700 transition-all active:scale-95"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                  <button
                    onClick={() => handleDismiss(report._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                  >
                    <CheckCircle size={16} /> Dismiss
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCommunityReports;