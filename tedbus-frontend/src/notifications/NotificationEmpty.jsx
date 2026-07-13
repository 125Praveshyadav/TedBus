import React from "react";
import { BellOff } from "lucide-react";

const NotificationEmpty = ({ message = "No notifications yet" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <BellOff size={28} className="text-slate-300" />
      </div>
      <p className="text-slate-400 font-bold text-sm">{message}</p>
      <p className="text-slate-300 text-xs font-medium mt-1">
        You're all caught up!
      </p>
    </div>
  );
};

export default NotificationEmpty;