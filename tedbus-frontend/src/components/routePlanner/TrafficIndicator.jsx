const levels = {
  smooth: {
    label: "Smooth",
    dot: "🟢",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-400",
    bar: "bg-green-500",
    barWidth: "w-1/4",
  },
  moderate: {
    label: "Moderate",
    dot: "🟡",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-700 dark:text-yellow-400",
    bar: "bg-yellow-500",
    barWidth: "w-2/4",
  },
  heavy: {
    label: "Heavy Traffic",
    dot: "🔴",
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    bar: "bg-red-500",
    barWidth: "w-4/4",
  },
};

const TrafficIndicator = ({ traffic, compact = false }) => {
  if (!traffic) return null;

  const config = levels[traffic.level] || levels.smooth;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-black ${config.bg} ${config.text}`}>
        {config.dot} {config.label}
      </span>
    );
  }

  return (
    <div className={`rounded-xl p-3 ${config.bg}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-black ${config.text}`}>
          {config.dot} {config.label}
        </span>
        <span className={`text-[10px] font-bold ${config.text}`}>
          {traffic.currentSpeed} / {traffic.freeFlowSpeed} km/h
        </span>
      </div>
      {/* Congestion bar */}
      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className={`h-full rounded-full ${config.bar} ${config.barWidth} transition-all`} />
      </div>
      {traffic.delayPercent > 5 && (
        <p className={`mt-1.5 text-[10px] font-bold ${config.text}`}>
          ~{traffic.delayPercent}% slower than usual
        </p>
      )}
    </div>
  );
};

export default TrafficIndicator;