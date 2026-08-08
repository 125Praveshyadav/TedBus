import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  Bus,
  Camera,
  Check,
  Clock3,
  Droplets,
  IndianRupee,
  Plug,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Star,
  Wifi,
  X,
} from "lucide-react";

const DEFAULT_FILTERS = {
  busType: [],
  departureTime: [],
  arrivalTime: [],
  amenities: [],
  priceRange: [0, 3000],
  rating: 0,
};

const DEFAULT_BUS_TYPES = [
  "AC Sleeper",
  "Non AC Seater",
  "AC Seater",
  "Sleeper",
];

const TIME_SLOTS = [
  { label: "Before 6 AM", value: "before-6" },
  { label: "6 AM - 12 PM", value: "6-12" },
  { label: "12 PM - 6 PM", value: "12-18" },
  { label: "After 6 PM", value: "after-18" },
];

const AMENITIES = [
  {
    label: "WiFi",
    value: "wifi",
    icon: Wifi,
  },
  {
    label: "Charging Point",
    value: "charging",
    icon: Plug,
  },
  {
    label: "CCTV",
    value: "cctv",
    icon: Camera,
  },
  {
    label: "Water Bottle",
    value: "water",
    icon: Droplets,
  },
  {
    label: "Blanket",
    value: "blanket",
    icon: Sparkles,
  },
];

const RATING_OPTIONS = [4.5, 4, 3.5, 3];

const toggleValue = (items = [], value) => {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
};

export const getActiveFilterCount = (
  filters = DEFAULT_FILTERS,
  maxPrice = 3000,
) => {
  return (
    (filters.busType?.length || 0) +
    (filters.departureTime?.length || 0) +
    (filters.arrivalTime?.length || 0) +
    (filters.amenities?.length || 0) +
    (filters.rating ? 1 : 0) +
    (Number(filters.priceRange?.[1] ?? maxPrice) <
    Number(maxPrice)
      ? 1
      : 0)
  );
};

const FilterSection = ({
  icon: Icon,
  title,
  subtitle,
  iconBackground,
  iconColor,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconColor}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">
            {title}
          </h4>

          {subtitle && (
            <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

const FilterOption = ({
  label,
  active,
  onClick,
  activeClass,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] font-bold transition-all duration-200 active:scale-[0.98] ${
        active
          ? activeClass
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2">
        {Icon && (
          <Icon
            className={`h-3.5 w-3.5 shrink-0 ${
              active
                ? "text-current"
                : "text-slate-400 dark:text-slate-500"
            }`}
          />
        )}

        <span className="truncate">{label}</span>
      </span>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition ${
          active
            ? "border-white/20 bg-white/20 text-white"
            : "border-slate-200 bg-slate-50 text-transparent dark:border-slate-700 dark:bg-slate-800"
        }`}
      >
        <Check className="h-3 w-3 stroke-[3]" />
      </span>
    </button>
  );
};

const BusFilters = ({
  busTypes = [],
  filters: controlledFilters,
  setFilters: setControlledFilters,

  selectedBusTypes,
  setSelectedBusTypes,

  onFilterChange,
  maxPrice = 3000,

  variant = "desktop",
  onClose,
  resultCount = 0,
}) => {
  const isMobile = variant === "mobile";

  const [localFilters, setLocalFilters] = useState({
    ...DEFAULT_FILTERS,
    priceRange: [0, maxPrice],
  });

  useEffect(() => {
    if (controlledFilters) {
      return;
    }

    setLocalFilters((current) => ({
      ...current,
      priceRange: [
        0,
        Math.min(
          Number(current.priceRange?.[1] ?? maxPrice),
          Number(maxPrice),
        ),
      ],
    }));
  }, [maxPrice, controlledFilters]);

  const availableBusTypes = useMemo(() => {
    return busTypes.length > 0
      ? busTypes
      : DEFAULT_BUS_TYPES;
  }, [busTypes]);

  const baseFilters = controlledFilters ?? localFilters;

  const filters = {
    ...baseFilters,
    busType:
      selectedBusTypes ?? baseFilters.busType ?? [],
    departureTime: baseFilters.departureTime ?? [],
    arrivalTime: baseFilters.arrivalTime ?? [],
    amenities: baseFilters.amenities ?? [],
    priceRange:
      baseFilters.priceRange ?? [0, maxPrice],
    rating: Number(baseFilters.rating || 0),
  };

  const activeFilterCount = getActiveFilterCount(
    filters,
    maxPrice,
  );

  const updateFilters = (nextFilters) => {
    const normalizedFilters = {
      ...nextFilters,
      busType: nextFilters.busType ?? [],
      departureTime:
        nextFilters.departureTime ?? [],
      arrivalTime: nextFilters.arrivalTime ?? [],
      amenities: nextFilters.amenities ?? [],
      priceRange:
        nextFilters.priceRange ?? [0, maxPrice],
      rating: Number(nextFilters.rating || 0),
    };

    if (setControlledFilters) {
      setControlledFilters(normalizedFilters);
    } else {
      setLocalFilters(normalizedFilters);
    }

    setSelectedBusTypes?.(
      normalizedFilters.busType,
    );

    onFilterChange?.(normalizedFilters);
  };

  const handleToggle = (field, value) => {
    updateFilters({
      ...filters,
      [field]: toggleValue(
        filters[field],
        value,
      ),
    });
  };

  const handleRatingChange = (rating) => {
    updateFilters({
      ...filters,
      rating:
        Number(filters.rating) === Number(rating)
          ? 0
          : Number(rating),
    });
  };

  const handlePriceChange = (value) => {
    updateFilters({
      ...filters,
      priceRange: [0, Number(value)],
    });
  };

  const handleReset = () => {
    updateFilters({
      ...DEFAULT_FILTERS,
      priceRange: [0, maxPrice],
    });
  };

  const selectedMaxPrice = Number(
    filters.priceRange?.[1] ?? maxPrice,
  );

  return (
    <div
      className={`flex flex-col overflow-hidden bg-white dark:bg-slate-900 ${
        isMobile
          ? "max-h-[92dvh] w-full rounded-t-[2rem]"
          : "sticky top-24 max-h-[calc(100vh-7rem)] rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:shadow-black/20"
      }`}
    >
      {/* Header */}
      <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-4 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-cyan-500/10 blur-2xl" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur">
              <SlidersHorizontal className="h-4 w-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black">
                  Smart Filters
                </h3>

                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-1.5 text-[9px] font-black text-white">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <p className="text-[9px] font-medium text-slate-400">
                Refine buses according to your trip
              </p>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable filter content */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3.5 [scrollbar-width:thin]">
        {/* Bus type */}
        <FilterSection
          icon={Bus}
          title="Bus Type"
          subtitle="Choose preferred coach"
          iconBackground="bg-violet-100 dark:bg-violet-900/40"
          iconColor="text-violet-600 dark:text-violet-400"
        >
          <div className="space-y-2">
            {availableBusTypes.map((type) => (
              <FilterOption
                key={type}
                label={type}
                active={filters.busType.includes(type)}
                onClick={() =>
                  handleToggle("busType", type)
                }
                activeClass="border-violet-500 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20"
              />
            ))}
          </div>
        </FilterSection>

        {/* Departure */}
        <FilterSection
          icon={Clock3}
          title="Departure Time"
          subtitle="When should the bus leave?"
          iconBackground="bg-cyan-100 dark:bg-cyan-900/40"
          iconColor="text-cyan-600 dark:text-cyan-400"
        >
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => (
              <FilterOption
                key={slot.value}
                label={slot.label}
                active={filters.departureTime.includes(
                  slot.value,
                )}
                onClick={() =>
                  handleToggle(
                    "departureTime",
                    slot.value,
                  )
                }
                activeClass="border-cyan-500 bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-md shadow-cyan-500/20"
              />
            ))}
          </div>
        </FilterSection>

        {/* Arrival */}
        <FilterSection
          icon={Clock3}
          title="Arrival Time"
          subtitle="Preferred arrival window"
          iconBackground="bg-teal-100 dark:bg-teal-900/40"
          iconColor="text-teal-600 dark:text-teal-400"
        >
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((slot) => (
              <FilterOption
                key={slot.value}
                label={slot.label}
                active={filters.arrivalTime.includes(
                  slot.value,
                )}
                onClick={() =>
                  handleToggle(
                    "arrivalTime",
                    slot.value,
                  )
                }
                activeClass="border-teal-500 bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
              />
            ))}
          </div>
        </FilterSection>

        {/* Price */}
        <FilterSection
          icon={IndianRupee}
          title="Maximum Fare"
          subtitle="Set your budget limit"
          iconBackground="bg-amber-100 dark:bg-amber-900/40"
          iconColor="text-amber-600 dark:text-amber-400"
        >
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-3.5 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Up to
              </span>

              <span className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-amber-500/20">
                ₹{selectedMaxPrice}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={maxPrice}
              step={50}
              value={selectedMaxPrice}
              onChange={(event) =>
                handlePriceChange(event.target.value)
              }
              aria-label="Maximum price"
              className="w-full cursor-pointer accent-amber-500"
            />

            <div className="mt-2 flex justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500">
              <span>₹0</span>
              <span>₹{maxPrice}</span>
            </div>
          </div>
        </FilterSection>

        {/* Amenities */}
        <FilterSection
          icon={Sparkles}
          title="Amenities"
          subtitle="Facilities you need"
          iconBackground="bg-indigo-100 dark:bg-indigo-900/40"
          iconColor="text-indigo-600 dark:text-indigo-400"
        >
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map((amenity) => (
              <FilterOption
                key={amenity.value}
                label={amenity.label}
                icon={amenity.icon}
                active={filters.amenities.includes(
                  amenity.value,
                )}
                onClick={() =>
                  handleToggle(
                    "amenities",
                    amenity.value,
                  )
                }
                activeClass="border-indigo-500 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20"
              />
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection
          icon={Star}
          title="Minimum Rating"
          subtitle="Show traveller-approved buses"
          iconBackground="bg-emerald-100 dark:bg-emerald-900/40"
          iconColor="text-emerald-600 dark:text-emerald-400"
        >
          <div className="grid grid-cols-2 gap-2">
            {RATING_OPTIONS.map((rating) => {
              const active =
                Number(filters.rating) ===
                Number(rating);

              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleRatingChange(rating)
                  }
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[11px] font-black transition-all active:scale-[0.98] ${
                    active
                      ? "border-emerald-500 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                  }`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${
                      active
                        ? "fill-white text-white"
                        : "fill-amber-400 text-amber-400"
                    }`}
                  />

                  {rating}+
                </button>
              );
            })}
          </div>
        </FilterSection>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
        <div
          className={`grid gap-2 ${
            isMobile ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <button
            type="button"
            onClick={handleReset}
            disabled={activeFilterCount === 0}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 px-4 py-3 text-xs font-black text-white shadow-lg shadow-indigo-500/20 transition active:scale-[0.98]"
            >
              Show {resultCount}{" "}
              {resultCount === 1 ? "Bus" : "Buses"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusFilters;