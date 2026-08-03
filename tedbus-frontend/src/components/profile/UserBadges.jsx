import React from "react";
import { Award, Star, Shield, Zap } from "lucide-react";

const badgeConfig = {
  Explorer: {
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  "Trusted Reviewer": {
    icon: Shield,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  "Top Contributor": {
    icon: Award,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  "Community Favorite": {
    icon: Star,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-red-200",
  },
};

const UserBadges = ({ badges = [] }) => {
  if (badges.length === 0) {
    return (
      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-center text-sm text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-700">
        Post more content to earn cool badges! 🎖️
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge, idx) => {
        const config = badgeConfig[badge] || badgeConfig["Explorer"];
        const Icon = config.icon;

        return (
          <div
            key={idx}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 ${config.bg} ${config.border} shadow-sm`}
          >
            <Icon size={18} className={config.color} />
            <span
              className={`text-xs font-black uppercase tracking-wide ${config.color}`}
            >
              {badge}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UserBadges;
