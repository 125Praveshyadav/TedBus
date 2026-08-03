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
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border-2  border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 active:scale-95"
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
