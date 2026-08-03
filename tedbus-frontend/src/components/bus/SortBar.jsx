// SortBar.jsx
import { useState } from "react";
import { ArrowDownUp, Bus, ChevronDown } from "lucide-react";

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

const SortBar = ({
  count = 0,
  sortBy: controlledSortBy,
  setSortBy: setControlledSortBy,
  onSortChange,
}) => {
  const [localSortBy, setLocalSortBy] = useState("recommended");

  const sortBy = controlledSortBy || localSortBy;

  const handleSort = (value) => {
    if (setControlledSortBy) {
      setControlledSortBy(value);
    } else {
      setLocalSortBy(value);
    }

    onSortChange?.(value);
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Count */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <Bus className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Available Buses
            </p>

            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {count} bus{count === 1 ? "" : "es"} found
            </h3>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <label className="hidden items-center gap-2 text-sm font-black text-slate-600 dark:text-slate-400 sm:flex">
            <ArrowDownUp className="h-4 w-4 text-red-600 dark:text-red-400" />
            Sort by
          </label>

          <div className="relative w-full sm:w-56">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 pr-10 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-red-500/10"
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
  );
};

export default SortBar;