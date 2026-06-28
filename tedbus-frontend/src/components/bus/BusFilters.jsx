import { useMemo, useState } from "react";
import {
  Bus,
  Clock3,
  IndianRupee,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Star,
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
  {
    label: "Before 6 AM",
    value: "before-6",
  },
  {
    label: "6 AM - 12 PM",
    value: "6-12",
  },
  {
    label: "12 PM - 6 PM",
    value: "12-18",
  },
  {
    label: "After 6 PM",
    value: "after-18",
  },
];

const AMENITIES = [
  {
    label: "WiFi",
    value: "wifi",
  },
  {
    label: "Charging Point",
    value: "charging",
  },
  {
    label: "CCTV",
    value: "cctv",
  },
  {
    label: "Water Bottle",
    value: "water",
  },
  {
    label: "Blanket",
    value: "blanket",
  },
];

const RATING_OPTIONS = [4.5, 4, 3.5, 3];

const BusFilters = ({
  busTypes = [],
  filters: controlledFilters,
  setFilters: setControlledFilters,

  // Backward compatibility with your previous SearchBus props
  selectedBusTypes,
  setSelectedBusTypes,

  onFilterChange,
  maxPrice = 3000,
}) => {
  const [localFilters, setLocalFilters] = useState({
    ...DEFAULT_FILTERS,
    priceRange: [0, maxPrice],
  });

  const filters = controlledFilters || {
    ...localFilters,
    busType: selectedBusTypes || localFilters.busType,
  };

  const availableBusTypes = useMemo(() => {
    return busTypes?.length ? busTypes : DEFAULT_BUS_TYPES;
  }, [busTypes]);

  const updateFilters = (nextFilters) => {
    if (setControlledFilters) {
      setControlledFilters(nextFilters);
    } else {
      setLocalFilters(nextFilters);
    }

    if (setSelectedBusTypes) {
      setSelectedBusTypes(nextFilters.busType || []);
    }

    onFilterChange?.(nextFilters);
  };

  const handleCheckboxChange = (field, value) => {
    const currentValues = filters[field] || [];

    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    updateFilters({
      ...filters,
      [field]: updatedValues,
    });
  };

  const handleRatingChange = (rating) => {
    updateFilters({
      ...filters,
      rating: filters.rating === rating ? 0 : rating,
    });
  };

  const handlePriceChange = (value) => {
    updateFilters({
      ...filters,
      priceRange: [0, Number(value)],
    });
  };

  const handleReset = () => {
    const resetFilters = {
      ...DEFAULT_FILTERS,
      priceRange: [0, maxPrice],
    };

    updateFilters(resetFilters);
  };

  const activeFilterCount =
    (filters.busType?.length || 0) +
    (filters.departureTime?.length || 0) +
    (filters.arrivalTime?.length || 0) +
    (filters.amenities?.length || 0) +
    (filters.rating ? 1 : 0) +
    (filters.priceRange?.[1] < maxPrice ? 1 : 0);

  return (
    <aside className="sticky top-24 h-fit rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
            <SlidersHorizontal className="h-5 w-5 text-red-600" />
            Filters
          </h3>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Refine your bus search
          </p>
        </div>

        {activeFilterCount > 0 && (
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
            {activeFilterCount}
          </span>
        )}
      </div>

      <div className="space-y-7">
        {/* Bus Type */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <Bus className="h-4 w-4 text-red-600" />
            Bus Type
          </h4>

          <div className="space-y-2">
            {availableBusTypes.map((type) => (
              <label
                key={type}
                className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-600">
                  {type}
                </span>

                <input
                  type="checkbox"
                  checked={filters.busType?.includes(type)}
                  onChange={() => handleCheckboxChange("busType", type)}
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Departure Time */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <Clock3 className="h-4 w-4 text-red-600" />
            Departure Time
          </h4>

          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot.value}
                className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-600">
                  {slot.label}
                </span>

                <input
                  type="checkbox"
                  checked={filters.departureTime?.includes(slot.value)}
                  onChange={() =>
                    handleCheckboxChange("departureTime", slot.value)
                  }
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Arrival Time */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <Clock3 className="h-4 w-4 text-red-600" />
            Arrival Time
          </h4>

          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => (
              <label
                key={slot.value}
                className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-600">
                  {slot.label}
                </span>

                <input
                  type="checkbox"
                  checked={filters.arrivalTime?.includes(slot.value)}
                  onChange={() =>
                    handleCheckboxChange("arrivalTime", slot.value)
                  }
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <IndianRupee className="h-4 w-4 text-red-600" />
            Price Range
          </h4>

          <input
            type="range"
            min="0"
            max={maxPrice}
            step="50"
            value={filters.priceRange?.[1] || maxPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full cursor-pointer accent-red-600"
          />

          <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>₹0</span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-600">
              ₹{filters.priceRange?.[1] || maxPrice}
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <Sparkles className="h-4 w-4 text-red-600" />
            Amenities
          </h4>

          <div className="space-y-2">
            {AMENITIES.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-600">
                  {item.label}
                </span>

                <input
                  type="checkbox"
                  checked={filters.amenities?.includes(item.value)}
                  onChange={() =>
                    handleCheckboxChange("amenities", item.value)
                  }
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-red-600"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">
            <Star className="h-4 w-4 text-red-600" />
            Rating
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {RATING_OPTIONS.map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className={`rounded-2xl border px-3 py-2 text-sm font-black transition ${
                  filters.rating === rating
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                ⭐ {rating}+
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={handleReset}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-red-600 active:scale-[0.98]"
      >
        <RotateCcw className="h-4 w-4" />
        Reset Filters
      </button>
    </aside>
  );
};

export default BusFilters;