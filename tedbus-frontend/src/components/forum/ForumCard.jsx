import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight } from "lucide-react";

const ForumCard = ({ forum }) => {
  return (
    <Link
      to={`/community/forums/${forum.slug || forum._id}`}
      className="group bg-white p-5 sm:p-6 rounded-[2rem] border-2 border-slate-100 hover:border-red-200 shadow-sm hover:shadow-lg transition-all block"
    >
      <div className="flex items-start gap-4">
        {/* Icon Box */}
        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-3xl shadow-sm">
          {forum.icon || "💬"}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-slate-800 group-hover:text-red-600 transition-colors truncate">
            {forum.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mt-1">
            {forum.description || "Explore discussions in this forum"}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400 font-bold">
              <MessageSquare size={14} />
              {forum.discussionCount || 0} Discussions
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight
          size={20}
          className="text-slate-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all shrink-0"
        />
      </div>
    </Link>
  );
};

export default ForumCard;