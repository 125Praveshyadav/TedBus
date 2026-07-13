import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessagesSquare,
  FileText,
  MessageCircle,
  Reply,
  Flag,
  ClipboardList,
  ChevronRight,
  Loader2,
} from "lucide-react";
import adminCommunityService from "../../services/adminCommunityService";
import reportService from "../../services/reportService";

const CommunityAdmin = () => {
  const [stats, setStats] = useState(null);
  const [pendingReports, setPendingReports] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, reportsData] = await Promise.all([
          adminCommunityService.getStats(),
          reportService.getReports({ status: "pending", limit: 1 }),
        ]);
        setStats(statsData?.stats || {});
        setPendingReports(reportsData?.pagination?.total || 0);
      } catch (err) {
        console.error("Failed to load community stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const statCards = [
    {
      label: "Total Posts",
      value: stats?.totalPosts || 0,
      icon: FileText,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Total Comments",
      value: stats?.totalComments || 0,
      icon: MessageCircle,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Discussions",
      value: stats?.totalDiscussions || 0,
      icon: MessagesSquare,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Replies",
      value: stats?.totalReplies || 0,
      icon: Reply,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const quickLinks = [
    {
      to: "/admin/community/posts",
      icon: ClipboardList,
      label: "Manage Posts",
      desc: "Approve, reject or remove posts",
    },
    {
      to: "/admin/community/forums",
      icon: MessagesSquare,
      label: "Manage Forums",
      desc: "Create and manage discussion boards",
    },
    {
      to: "/admin/community/reports",
      icon: Flag,
      label: "Review Reports",
      desc: `${pendingReports} pending reports`,
      alert: pendingReports > 0,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-red-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">
          Community <span className="text-red-600">Dashboard</span>
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Overview of community activity and moderation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-lg font-black text-slate-800 mb-4">Moderation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-red-200 hover:bg-red-50/30 transition-all"
              >
                <div
                  className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center ${
                    link.alert
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/25 animate-pulse"
                      : "bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600"
                  } transition-colors`}
                >
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm group-hover:text-red-600 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs font-medium text-slate-400 truncate">{link.desc}</p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all shrink-0"
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommunityAdmin;