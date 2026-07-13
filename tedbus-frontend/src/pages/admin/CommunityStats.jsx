import React, { useEffect, useState } from "react";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  MessagesSquare, 
  TrendingUp, 
  Award,
  Loader2,
  ArrowUpRight
} from "lucide-react";
import api from "../../services/api"; // backend se stats lane ke liye direct api use karenge
import { toast } from "react-toastify";

const CommunityStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/community/stats");
      setStats(res.data?.stats || res.stats);
    } catch (err) {
      toast.error("Failed to load community stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Posts", value: stats?.totalPosts || 0, icon: FileText, color: "bg-blue-500" },
    { label: "Comments", value: stats?.totalComments || 0, icon: MessageSquare, color: "bg-purple-500" },
    { label: "Discussions", value: stats?.totalDiscussions || 0, icon: MessagesSquare, color: "bg-orange-500" },
    { label: "Replies", value: stats?.totalReplies || 0, icon: TrendingUp, color: "bg-green-500" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Community <span className="text-red-600">Analytics</span></h1>
        <p className="text-slate-500 text-sm font-medium">Detailed overview of community engagement and growth</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 ${item.color} opacity-[0.03] -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform`} />
            
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${item.color} text-white shadow-lg`}>
                <item.icon size={24} />
              </div>
              <div className="text-green-500 flex items-center gap-1 text-xs font-black bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} /> ACTIVE
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-800 mb-1">{item.value.toLocaleString()}</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Bottom Layout - Comparison/Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Engagement Summary */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-800">Engagement Ratio</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Real-time Data</span>
          </div>

          <div className="space-y-6">
            {/* Posts vs Discussions */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">User Content (Posts)</span>
                <span className="text-sm font-black text-red-600">
                  {Math.round((stats?.totalPosts / (stats?.totalPosts + stats?.totalDiscussions || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 rounded-full" 
                  style={{ width: `${(stats?.totalPosts / (stats?.totalPosts + stats?.totalDiscussions || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Comments vs Replies */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-600">Response Rate (Comments/Replies)</span>
                <span className="text-sm font-black text-blue-600">
                  {Math.round((stats?.totalReplies / (stats?.totalComments + stats?.totalReplies || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${(stats?.totalReplies / (stats?.totalComments + stats?.totalReplies || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 p-6 bg-red-50 rounded-3xl border border-red-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="text-red-900 font-black text-sm">Community Health Score: High</p>
              <p className="text-red-700 text-xs font-medium">User engagement has increased by 12% this week.</p>
            </div>
          </div>
        </div>

        {/* Quick Legend / Info */}
        <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-xl">
          <h3 className="text-xl font-black mb-6">Moderation Tip</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Posts Management</p>
              <p className="text-sm text-slate-200">Regularly check for spam in 'Travel Stories' to maintain quality.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Reports</p>
              <p className="text-sm text-slate-200">Pending reports should be resolved within 24 hours for safety.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Forums</p>
              <p className="text-sm text-slate-200">Pinned discussions get 5x more engagement.</p>
            </div>
          </div>
          
          <button className="w-full mt-8 py-4 bg-red-600 rounded-2xl font-black shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95">
            Download Report (CSV)
          </button>
        </div>

      </div>
    </div>
  );
};

export default CommunityStats;