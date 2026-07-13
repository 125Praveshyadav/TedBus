import React, { useState } from "react";
import { Bell } from "lucide-react";
import useNotifications from "../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white text-slate-600 transition-all hover:border-red-200 hover:text-red-600 active:scale-95"
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-pulse" : ""} />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black shadow-lg shadow-red-500/40 animate-bounce">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown onClose={() => setShowDropdown(false)} />
      )}
    </div>
  );
};

export default NotificationBell;