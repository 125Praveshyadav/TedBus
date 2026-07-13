import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { getNotificationConfig, formatTimeAgo } from "../utils/notificationHelpers";

const NotificationItem = ({ notification, onRead, onDelete, compact = false }) => {
  const navigate = useNavigate();
  const config = getNotificationConfig(notification.type);
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification._id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all group ${
        notification.isRead
          ? "bg-white hover:bg-slate-50"
          : "bg-red-50/50 hover:bg-red-50"
      }`}
    >
      {/* Icon */}
      <div className={`w-10 h-10 shrink-0 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-snug ${notification.isRead ? "text-slate-600" : "text-slate-800 font-bold"}`}>
            {notification.message}
          </p>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-1">
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>

      {/* Delete */}
      {!compact && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(notification._id); }}
          className="p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;