import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  Bus,
  ChevronDown,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const SORT_OPTIONS = [
  {
    label: "Recommended",
    value: "recommended",
  },
  {
    label: "Price: Low to High",
    value: "price-low",
  },
  {
    label: "Price: High to Low",
    value: "price-high",
  },
  {
    label: "Highest Rating",
    value: "rating-high",
  },
  {
    label: "More Seats Available",
    value: "seats-high",
  },
  {
    label: "Early Departure",
    value: "departure-early",
  },
];

const getSortTheme = (sortValue) => {
  if (sortValue === "price-low") {
    return {
      badge:
        "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
      icon: "text-emerald-600 dark:text-emerald-400",
      selectFocus: "focus:border-emerald-500 focus:ring-emerald-500/10",
    };
  }

  if (sortValue === "price-high") {
    return {
      badge:
        "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
      icon: "text-rose-600 dark:text-rose-400",
      selectFocus: "focus:border-rose-500 focus:ring-rose-500/10",
    };
  }

  if (sortValue === "rating-high") {
    return {
      badge:
        "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
      icon: "text-amber-600 dark:text-amber-400",
      selectFocus: "focus:border-amber-500 focus:ring-amber-500/10",
    };
  }

  if (sortValue === "seats-high") {
    return {
      badge:
        "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/50",
      icon: "text-cyan-600 dark:text-cyan-400",
      selectFocus: "focus:border-cyan-500 focus:ring-cyan-500/10",
    };
  }

  if (sortValue === "departure-early") {
    return {
      badge:
        "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/50",
      icon: "text-violet-600 dark:text-violet-400",
      selectFocus: "focus:border-violet-500 focus:ring-violet-500/10",
    };
  }

  return {
    badge:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    icon: "text-red-600 dark:text-red-400",
    selectFocus: "focus:border-red-500 focus:ring-red-500/10",
  };
};

const SortBar = ({
  count = 0,
  sortBy: controlledSortBy,
  setSortBy: setControlledSortBy,
  onSortChange,
}) => {
  const [localSortBy, setLocalSortBy] = useState("recommended");

  const sortBy = controlledSortBy || localSortBy;

  const selectedOption = useMemo(() => {
    return (
      SORT_OPTIONS.find((option) => option.value === sortBy) || SORT_OPTIONS[0]
    );
  }, [sortBy]);

  const theme = getSortTheme(sortBy);

  const handleSort = (value) => {
    if (setControlledSortBy) {
      setControlledSortBy(value);
    } else {
      setLocalSortBy(value);
    }

    onSortChange?.(value);
  };

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20">
            <Bus className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Search Results
            </p>

            <h3 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
              {count} bus{count === 1 ? "" : "es"} found
            </h3>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-3 sm:min-w-[300px] sm:items-end">
          {/* Selected sort badge */}
          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${theme.badge}`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {selectedOption.label}
          </div>

          {/* Sort select */}
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <label
              className={`hidden items-center gap-2 text-sm font-black sm:flex ${theme.icon}`}
            >
              <TrendingUp className="h-4 w-4" />
              Sort by
            </label>

            <div className="relative w-full sm:w-64">
              <div
                className={`pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${theme.icon}`}
              >
                <ArrowDownUp className="h-4 w-4" />
              </div>

              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className={`w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:bg-white focus:ring-4 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:focus:bg-slate-900 ${theme.selectFocus}`}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortBar;
