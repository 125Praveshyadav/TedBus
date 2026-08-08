import { Activity } from "lucide-react";

// Replace emojis with CSS glowing dots
const GlowingDot = ({ colorClass }) => (
  <span className="relative flex h-2.5 w-2.5">
    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${colorClass}`}></span>
    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${colorClass}`}></span>
  </span>
);

const levels = {
  smooth: {
    label: "Smooth",
    dotColor: "bg-emerald-500",
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    bar: "bg-gradient-to-r from-emerald-400 to-emerald-500",
    barWidth: "w-1/4",
    border: "border-emerald-100 dark:border-emerald-900/50"
  },
  moderate: {
    label: "Moderate",
    dotColor: "bg-amber-500",
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    bar: "bg-gradient-to-r from-amber-400 to-amber-500",
    barWidth: "w-2/4",
    border: "border-amber-100 dark:border-amber-900/50"
  },
  heavy: {
    label: "Heavy Traffic",
    dotColor: "bg-rose-500",
    bg: "bg-rose-50/80 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    bar: "bg-gradient-to-r from-rose-400 to-rose-600",
    barWidth: "w-full",
    border: "border-rose-100 dark:border-rose-900/50"
  },
};

const TrafficIndicator = ({ traffic, compact = false }) => {
  if (!traffic) return null;

  const config = levels[traffic.level] || levels.smooth;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${config.bg} ${config.border} ${config.text}`}>
        <GlowingDot colorClass={config.dotColor} />
        {config.label}
      </span>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-3.5 transition-all ${config.bg} ${config.border}`}>
      {/* Background Icon Watermark */}
      <Activity className={`absolute -right-2 -top-2 h-16 w-16 opacity-[0.04] ${config.text}`} />

      <div className="relative flex items-center justify-between mb-2.5">
        <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${config.text}`}>
          <GlowingDot colorClass={config.dotColor} />
          {config.label}
        </span>
        <span className={`rounded-lg bg-white/50 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm dark:bg-black/20 ${config.text}`}>
          {traffic.currentSpeed} / {traffic.freeFlowSpeed} <span className="opacity-70">km/h</span>
        </span>
      </div>
      
      {/* Premium Congestion Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60 shadow-inner dark:bg-slate-800/60">
        <div className={`h-full rounded-full transition-all duration-700 ${config.bar} ${config.barWidth}`} />
      </div>

      {traffic.delayPercent > 5 && (
        <p className={`mt-2 text-[10px] font-bold ${config.text}`}>
          <span className="opacity-70">Expect delays:</span> ~{traffic.delayPercent}% slower than usual
        </p>
      )}
    </div>
  );
};

export default TrafficIndicator;