import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeftRight,
  Bus,
  CalendarDays,
  Loader2,
  MapPin,
  RefreshCcw,
  Route,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import BusFilters from "../../components/bus/BusFilters";
import SortBar from "../../components/bus/SortBar";
import BusList from "../../components/bus/BusList";
import { busService } from "../../services/busService";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createDefaultFilters = (maxPrice = 3000) => ({
  busType: [],
  departureTime: [],
  arrivalTime: [],
  amenities: [],
  priceRange: [0, maxPrice],
  rating: 0,
});

const getMaxPriceFromBuses = (buses = []) => {
  if (!buses.length) return 3000;

  const highestPrice = Math.max(
    ...buses.map((bus) => Number(bus.price || 0))
  );

  return Math.max(highestPrice, 3000);
};

const getHourFromTime = (time = "") => {
  const value = String(time).trim();

  if (!value) return null;

  // 24 hour format: 21:30
  const match24 = value.match(/^(\d{1,2}):(\d{2})$/);

  if (match24) {
    return Number(match24[1]);
  }

  // 12 hour format: 08:00 PM
  const match12 = value.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);

  if (match12) {
    let hour = Number(match12[1]);
    const period = match12[3].toUpperCase();

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour;
  }

  return null;
};

const matchesTimeSlot = (time, selectedSlots = []) => {
  if (!selectedSlots.length) return true;

  const hour = getHourFromTime(time);

  if (hour === null) return true;

  return selectedSlots.some((slot) => {
    if (slot === "before-6") return hour < 6;
    if (slot === "6-12") return hour >= 6 && hour < 12;
    if (slot === "12-18") return hour >= 12 && hour < 18;
    if (slot === "after-18") return hour >= 18;

    return true;
  });
};

const normalizeAmenity = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();
};

const formatDisplayDate = (date) => {
  if (!date) return "Select travel date";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeBus = (bus) => {
  const price =
    bus.price ||
    bus.fare ||
    bus.ticketPrice ||
    bus.baseFare ||
    bus.seatPrice ||
    0;

  const departure =
    bus.departure ||
    bus.departureTime ||
    bus.startTime ||
    "";

  const arrival =
    bus.arrival ||
    bus.arrivalTime ||
    bus.endTime ||
    "";

  const type =
    bus.type ||
    bus.busType ||
    bus.category ||
    "Standard";

  const name =
    bus.name ||
    bus.busName ||
    bus.operatorName ||
    "TedBus Partner";

  const seats =
    bus.seatsAvailable ||
    bus.availableSeats ||
    bus.totalAvailableSeats ||
    bus.availableSeatCount ||
    bus.seats ||
    bus.totalSeats ||
    0;

  const amenities = Array.isArray(bus.amenities)
    ? bus.amenities
    : [];

  return {
    ...bus,

    // Compatibility with BusList / BusCard
    id: bus._id || bus.id,
    _id: bus._id || bus.id,

    name,
    type,
    departure,
    arrival,
    duration: bus.duration || "—",
    seats,
    seatsAvailable: seats,
    rating: bus.rating || bus.averageRating || 4.2,
    price,
    source: bus.source || "",
    destination: bus.destination || "",
    journeyDate: bus.journeyDate || bus.date || "",
    amenities,
  };
};

const SearchBus = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const today = useMemo(() => getTodayDate(), []);

  const initialSource = searchParams.get("source") || "";
  const initialDestination = searchParams.get("destination") || "";
  const initialDate = searchParams.get("date") || today;

  const [formData, setFormData] = useState({
    source: initialSource,
    destination: initialDestination,
    date: initialDate,
  });

  const [buses, setBuses] = useState([]);
  const [filters, setFilters] = useState(createDefaultFilters());
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(
    Boolean(initialSource && initialDestination && initialDate)
  );
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const maxPrice = useMemo(() => {
    return getMaxPriceFromBuses(buses);
  }, [buses]);

  const fetchBuses = async ({ source, destination, date }) => {
    try {
      setLoading(true);
      setError("");

      const response = await busService.searchBuses({
        source,
        destination,
        date,
      });

      const apiBuses = busService.extractBuses(response);
      const normalized = apiBuses.map(normalizeBus);
      const resultMaxPrice = getMaxPriceFromBuses(normalized);

      setBuses(normalized);
      setFilters(createDefaultFilters(resultMaxPrice));
      setSortBy("recommended");
      setHasSearched(true);
      setShowMobileFilters(false);
    } catch (err) {
      setBuses([]);
      setFilters(createDefaultFilters());
      setHasSearched(true);
      setError(err?.message || "Unable to fetch buses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = searchParams.get("source") || "";
    const destination = searchParams.get("destination") || "";
    const date = searchParams.get("date") || "";

    setFormData({
      source,
      destination,
      date: date || today,
    });

    if (source && destination && date) {
      fetchBuses({
        source,
        destination,
        date,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validateSearch = () => {
    const errors = {};

    if (!formData.source.trim()) {
      errors.source = "Source city is required";
    }

    if (!formData.destination.trim()) {
      errors.destination = "Destination city is required";
    }

    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() ===
        formData.destination.trim().toLowerCase()
    ) {
      errors.destination = "Source and destination cannot be same";
    }

    if (!formData.date) {
      errors.date = "Journey date is required";
    }

    if (formData.date && formData.date < today) {
      errors.date = "Journey date cannot be in the past";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSwapCities = () => {
    setFormData((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));

    setValidationErrors({});
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateSearch()) return;

    const nextSearch = {
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      date: formData.date,
    };

    const currentSource = searchParams.get("source") || "";
    const currentDestination = searchParams.get("destination") || "";
    const currentDate = searchParams.get("date") || "";

    const isSameSearch =
      currentSource === nextSearch.source &&
      currentDestination === nextSearch.destination &&
      currentDate === nextSearch.date;

    setFilters(createDefaultFilters(maxPrice));
    setSortBy("recommended");

    if (isSameSearch) {
      fetchBuses(nextSearch);
      return;
    }

    setSearchParams(nextSearch);
  };

  const handleRetry = () => {
    if (!formData.source || !formData.destination || !formData.date) return;

    fetchBuses({
      source: formData.source,
      destination: formData.destination,
      date: formData.date,
    });
  };

  const busTypes = useMemo(() => {
    const types = buses.map((bus) => bus.type).filter(Boolean);
    return [...new Set(types)];
  }, [buses]);

  const filteredAndSortedBuses = useMemo(() => {
    let result = [...buses];

    // Bus Type Filter
    if (filters.busType.length > 0) {
      result = result.filter((bus) =>
        filters.busType.includes(bus.type)
      );
    }

    // Price Filter
    if (filters.priceRange?.[1]) {
      result = result.filter(
        (bus) => Number(bus.price || 0) <= Number(filters.priceRange[1])
      );
    }

    // Rating Filter
    if (filters.rating) {
      result = result.filter(
        (bus) => Number(bus.rating || 0) >= Number(filters.rating)
      );
    }

    // Departure Time Filter
    if (filters.departureTime.length > 0) {
      result = result.filter((bus) =>
        matchesTimeSlot(bus.departure, filters.departureTime)
      );
    }

    // Arrival Time Filter
    if (filters.arrivalTime.length > 0) {
      result = result.filter((bus) =>
        matchesTimeSlot(bus.arrival, filters.arrivalTime)
      );
    }

    // Amenities Filter
    if (filters.amenities.length > 0) {
      result = result.filter((bus) => {
        const busAmenities = Array.isArray(bus.amenities)
          ? bus.amenities.map(normalizeAmenity)
          : [];

        if (!busAmenities.length) return false;

        return filters.amenities.every((amenity) =>
          busAmenities.some((item) => item.includes(amenity))
        );
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortBy === "rating-high") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    if (sortBy === "seats-high") {
      result.sort((a, b) => Number(b.seats || 0) - Number(a.seats || 0));
    }

    if (sortBy === "departure-early") {
      result.sort(
        (a, b) =>
          (getHourFromTime(a.departure) ?? 99) -
          (getHourFromTime(b.departure) ?? 99)
      );
    }

    return result;
  }, [buses, filters, sortBy]);

  const routeTitle = `${formData.source || "From"} → ${
    formData.destination || "To"
  }`;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Background */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              <Bus className="h-4 w-4" />
              TedBus Search
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Find Your Perfect Bus
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-red-50 sm:text-base">
              Compare buses, fares, timings, seats and ratings in one place.
            </p>
          </div>

          {/* Search Card */}
          <form
            onSubmit={handleSearch}
            className="rounded-[2rem] border border-white/20 bg-white p-4 text-slate-900 shadow-2xl shadow-red-900/20 sm:p-5"
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr_1fr_auto] lg:items-start">
              {/* Source */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  From
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    validationErrors.source
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                >
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="Source city"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold outline-none placeholder:text-slate-400"
                  />
                </div>

                {validationErrors.source && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationErrors.source}
                  </p>
                )}
              </div>

              {/* Swap */}
              <div className="flex justify-center pt-0 lg:pt-8">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                  title="Swap cities"
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </button>
              </div>

              {/* Destination */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  To
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    validationErrors.destination
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                >
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="Destination city"
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold outline-none placeholder:text-slate-400"
                  />
                </div>

                {validationErrors.destination && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationErrors.destination}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
                  Journey Date
                </label>

                <div
                  className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                    validationErrors.date
                      ? "border-red-300"
                      : "border-slate-200"
                  }`}
                >
                  <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    name="date"
                    min={today}
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold outline-none"
                  />
                </div>

                {validationErrors.date && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {validationErrors.date}
                  </p>
                )}
              </div>

              {/* Search Button */}
              <div className="pt-0 lg:pt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-7 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 lg:w-auto"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Route Header */}
          <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                  <Route className="h-4 w-4" />
                  Search Results
                </div>

                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {routeTitle}
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {formatDisplayDate(formData.date)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
                {loading
                  ? "Searching..."
                  : `${filteredAndSortedBuses.length} bus${
                      filteredAndSortedBuses.length === 1 ? "" : "es"
                    } found`}
              </div>
            </div>
          </div>

          {/* Initial State */}
          {!hasSearched && !loading && (
            <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                <Search className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900">
                Start your bus search
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Enter source, destination and journey date to find available
                buses.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="hidden h-96 animate-pulse rounded-[2rem] bg-slate-200 lg:block" />

              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-48 animate-pulse rounded-[2rem] border border-slate-100 bg-white"
                  >
                    <div className="h-full rounded-[2rem] bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!loading && hasSearched && error && (
            <div className="rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-600" />

              <h3 className="mt-4 text-xl font-black text-slate-900">
                Something went wrong
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry Search
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && hasSearched && !error && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              {/* Desktop Filters */}
              <aside className="hidden lg:block">
                <BusFilters
                  busTypes={busTypes}
                  filters={filters}
                  setFilters={setFilters}
                  maxPrice={maxPrice}
                />
              </aside>

              {/* Results */}
              <div>
                {/* Mobile Filter Toggle */}
                <div className="mb-4 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters((prev) => !prev)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-red-600" />
                    {showMobileFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {showMobileFilters && (
                    <div className="mt-4">
                      <BusFilters
                        busTypes={busTypes}
                        filters={filters}
                        setFilters={setFilters}
                        maxPrice={maxPrice}
                      />
                    </div>
                  )}
                </div>

                <SortBar
                  count={filteredAndSortedBuses.length}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                <div className="mt-5">
                  {filteredAndSortedBuses.length > 0 ? (
                    <BusList
                      buses={filteredAndSortedBuses}
                      journeyDate={formData.date}
                    />
                  ) : (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
                        <Bus className="h-8 w-8" />
                      </div>

                      <h3 className="mt-5 text-xl font-black text-slate-900">
                        No buses found
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Try changing your route, date or filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SearchBus;