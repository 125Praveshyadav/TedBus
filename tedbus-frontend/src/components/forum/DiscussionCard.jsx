import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Eye, Pin, Lock, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const DiscussionCard = ({ discussion }) => {
  return (
    <Link
      to={`/community/discussions/${discussion._id}`}
      className="group bg-white p-5 rounded-2xl border-2 border-slate-100 hover:border-red-200 hover:shadow-md transition-all block"
    >
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <img
          src={discussion.author?.profileImage || `https://ui-avatars.com/api/?name=${discussion.author?.name}&background=fee2e2&color=dc2626`}
          alt={discussion.author?.name}
          className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm"
        />

        <div className="flex-1 min-w-0">
          {/* Pin/Close Badges */}
          <div className="flex items-center gap-2 mb-1">
            {discussion.isPinned && (
              <span className="flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">
                <Pin size={10} /> Pinned
              </span>
            )}
            {discussion.isClosed && (
              <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">
                <Lock size={10} /> Closed
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-black text-slate-800 group-hover:text-red-600 transition-colors leading-tight">
            {discussion.title}
          </h3>

          {/* Content Preview */}
          <p className="text-sm text-slate-500 line-clamp-1 mt-1">
            {discussion.content}
          </p>

          {/* Route Badge */}
          {discussion.route?.source && discussion.route?.destination && (
            <div className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg mt-2">
              <MapPin size={12} />
              {discussion.route.source} → {discussion.route.destination}
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
            <span>by <span className="text-slate-600 font-bold">{discussion.author?.name}</span></span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}</span>
            <span className="flex items-center gap-1">
              <MessageCircle size={12} />
              {discussion.replyCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {discussion.views || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DiscussionCard;