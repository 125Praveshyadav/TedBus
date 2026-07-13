import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Medal, Award } from "lucide-react";

const rankConfig = {
  1: { icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200", label: "🥇" },
  2: { icon: Medal, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200", label: "🥈" },
  3: { icon: Award, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", label: "🥉" },
};

const LeaderboardTable = ({ users = [] }) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
        <Trophy size={48} className="mx-auto text-slate-300 mb-3" />
        <h3 className="text-lg font-bold text-slate-700">No contributors yet</h3>
        <p className="text-slate-500 text-sm">Be the first to earn a spot on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((entry, idx) => {
        const rank = idx + 1;
        const config = rankConfig[rank];

        return (
          <Link
            key={entry._id}
            to={`/community/profile/${entry._id}`}
            className={`group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 transition-all hover:shadow-md ${
              config ? `${config.bg} ${config.border}` : "bg-white border-slate-100 hover:border-red-100"
            }`}
          >
            {/* Rank */}
            <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg ${
              config ? `bg-white shadow-md ${config.color}` : "bg-slate-100 text-slate-500"
            }`}>
              {config ? config.label : `#${rank}`}
            </div>

            {/* Avatar */}
            <img
              src={
                entry.user?.profileImage ||
                `https://ui-avatars.com/api/?name=${entry.user?.name}&background=fee2e2&color=dc2626`
              }
              alt={entry.user?.name}
              className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm border-2 border-white"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-black text-slate-800 group-hover:text-red-600 transition-colors truncate">
                {entry.user?.name || "Anonymous"}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-500">
                <span>{entry.totalPosts} posts</span>
                <span>•</span>
                <span>{entry.totalLikes} likes</span>
                <span>•</span>
                <span>{entry.totalComments} comments</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <p className="text-xl sm:text-2xl font-black text-red-600">{entry.score}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Points</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;