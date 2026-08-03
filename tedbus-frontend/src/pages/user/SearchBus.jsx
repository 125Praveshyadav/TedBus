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
  Sparkles,
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
  const highestPrice = Math.max(...buses.map((bus) => Number(bus.price || 0)));
  return Math.max(highestPrice, 3000);
};

const getHourFromTime = (time = "") => {
  const value = String(time).trim();
  if (!value) return null;

  const match24 = value.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) return Number(match24[1]);

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

const normalizeAmenity = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

const formatDisplayDate = (date) => {
  if (!date) return "All dates";
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
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

  const departure = bus.departure || bus.departureTime || bus.startTime || "";
  const arrival = bus.arrival || bus.arrivalTime || bus.endTime || "";
  const type = bus.type || bus.busType || bus.category || "Standard";
  const name = bus.name || bus.busName || bus.operatorName || "TedBus Partner";

  const seats =
    bus.seatsAvailable ||
    bus.availableSeats ||
    bus.totalAvailableSeats ||
    bus.availableSeatCount ||
    bus.seats ||
    bus.totalSeats ||
    0;

  const amenities = Array.isArray(bus.amenities) ? bus.amenities : [];

  return {
    ...bus,
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

  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(true);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const maxPrice = useMemo(() => getMaxPriceFromBuses(buses), [buses]);

  const fetchBuses = async ({ source = "", destination = "", date = "" } = {}) => {
    try {
      setLoading(true);
      setError("");

      const src = source.trim();
      const dest = destination.trim();
      const hasRoute = Boolean(src && dest);

      let response;

      if (hasRoute) {
        response = await busService.searchBuses({
          source: src,
          destination: dest,
          date: date || today,
        });
      } else if (typeof busService.getAllBuses === "function") {
        response = await busService.getAllBuses();
      } else if (typeof busService.getBuses === "function") {
        response = await busService.getBuses();
      } else {
        response = await busService.searchBuses({});
      }

      const apiBuses = busService.extractBuses
        ? busService.extractBuses(response)
        : response?.buses ||
          response?.data?.buses ||
          (Array.isArray(response?.data) ? response.data : null) ||
          (Array.isArray(response) ? response : []);

      const list = Array.isArray(apiBuses) ? apiBuses : [];
      const normalized = list.map(normalizeBus);
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

    fetchBuses({
      source,
      destination,
      date: date || today,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const validateSearch = () => {
    const errors = {};
    const src = formData.source.trim();
    const dest = formData.destination.trim();

    if (src && !dest) errors.destination = "Destination city is required";
    if (dest && !src) errors.source = "Source city is required";

    if (src && dest && src.toLowerCase() === dest.toLowerCase()) {
      errors.destination = "Source and destination cannot be same";
    }

    if (src && dest) {
      if (!formData.date) {
        errors.date = "Journey date is required";
      } else if (formData.date < today) {
        errors.date = "Journey date cannot be in the past";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSwapCities = () => {
    setFormData((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));
    setValidationErrors({});
  };

  const handleShowAll = () => {
    setFormData({ source: "", destination: "", date: today });
    setValidationErrors({});
    setSearchParams({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!validateSearch()) return;

    const src = formData.source.trim();
    const dest = formData.destination.trim();

    if (!src && !dest) {
      handleShowAll();
      return;
    }

    const nextSearch = { source: src, destination: dest, date: formData.date || today };
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

    if (filters.busType.length > 0) {
      result = result.filter((bus) => filters.busType.includes(bus.type));
    }
    if (filters.priceRange?.[1]) {
      result = result.filter((bus) => Number(bus.price || 0) <= Number(filters.priceRange[1]));
    }
    if (filters.rating) {
      result = result.filter((bus) => Number(bus.rating || 0) >= Number(filters.rating));
    }
    if (filters.departureTime.length > 0) {
      result = result.filter((bus) => matchesTimeSlot(bus.departure, filters.departureTime));
    }
    if (filters.arrivalTime.length > 0) {
      result = result.filter((bus) => matchesTimeSlot(bus.arrival, filters.arrivalTime));
    }
    if (filters.amenities.length > 0) {
      result = result.filter((bus) => {
        const busAmenities = Array.isArray(bus.amenities) ? bus.amenities.map(normalizeAmenity) : [];
        if (!busAmenities.length) return false;
        return filters.amenities.every((amenity) =>
          busAmenities.some((item) => item.includes(amenity))
        );
      });
    }

    if (sortBy === "price-low") result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortBy === "price-high") result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortBy === "rating-high") result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    if (sortBy === "seats-high") result.sort((a, b) => Number(b.seats || 0) - Number(a.seats || 0));
    if (sortBy === "departure-early") {
      result.sort((a, b) => (getHourFromTime(a.departure) ?? 99) - (getHourFromTime(b.departure) ?? 99));
    }

    return result;
  }, [buses, filters, sortBy]);

  const hasRouteFilter = Boolean(formData.source.trim() && formData.destination.trim());
  const routeTitle = hasRouteFilter ? `${formData.source} → ${formData.destination}` : "All Available Buses";

  return (
    <main className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      
      {/* Premium Dark Glassmorphic Search Header */}
      <section className="relative overflow-visible bg-slate-950 px-4 pt-10 pb-28 sm:px-6 lg:px-8">
        {/* Subtle Background Elements */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_50%)]" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-600/20 blur-[80px]" />
        
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-red-500" /> Premium Bus Search
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Where do you want to <span className="text-red-500">travel?</span>
          </h1>
        </div>
      </section>

      {/* Floating Search Bar */}
      <section className="relative z-20 mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40 sm:p-6"
        >
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_1.2fr_auto]">
            
            {/* Source */}
            <div className="relative">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">From</label>
              <div className={`flex items-center rounded-2xl border bg-slate-50 px-4 transition-all focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:bg-slate-800/50 dark:focus-within:bg-slate-900 ${validationErrors.source ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}>
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  placeholder="Leaving from..."
                  className="h-14 w-full bg-transparent pl-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center lg:pt-5">
              <button
                type="button"
                onClick={handleSwapCities}
                className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-slate-700"
              >
                <ArrowLeftRight className="h-5 w-5 transition-transform group-hover:rotate-180" />
              </button>
            </div>

            {/* Destination */}
            <div className="relative">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">To</label>
              <div className={`flex items-center rounded-2xl border bg-slate-50 px-4 transition-all focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:bg-slate-800/50 dark:focus-within:bg-slate-900 ${validationErrors.destination ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}>
                <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  placeholder="Going to..."
                  className="h-14 w-full bg-transparent pl-3 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />
              </div>
            </div>

            {/* Date */}
            <div className="relative">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Date of Journey</label>
              <div className={`flex items-center rounded-2xl border bg-slate-50 px-4 transition-all focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:bg-slate-800/50 dark:focus-within:bg-slate-900 ${validationErrors.date ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}>
                <CalendarDays className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <input
                  type="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleInputChange}
                  className="h-14 w-full cursor-pointer bg-transparent pl-3 text-sm font-bold text-slate-900 outline-none dark:text-white dark:[color-scheme:dark]"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:pt-5">
              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-8 text-sm font-black text-white shadow-lg shadow-red-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-70 lg:w-auto"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                {hasRouteFilter ? "Search" : "Show All"}
              </button>
            </div>
          </div>

          {/* Validation Errors */}
          {(validationErrors.source || validationErrors.destination || validationErrors.date) && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" /> Please fix the highlighted fields to continue.
            </div>
          )}

          {/* Clear Filter Option */}
          {hasRouteFilter && (
            <div className="mt-4 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={handleShowAll}
                className="text-[11px] font-black uppercase tracking-wider text-red-500 transition hover:text-red-600"
              >
                Clear Filters & Show All Buses
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Main Content */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Results Info Header */}
          <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                <Route className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {routeTitle}
                </h2>
                <p className="mt-0.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                  {hasRouteFilter ? formatDisplayDate(formData.date) : "Explore all available routes"}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 dark:bg-red-950/30">
              <Bus className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-black text-red-600 dark:text-red-400">
                {loading ? "..." : `${filteredAndSortedBuses.length} Buses Found`}
              </span>
            </div>
          </div>

          {/* Loader */}
          {loading && (
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="hidden h-[600px] animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800 lg:block" />
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-48 animate-pulse rounded-[2rem] bg-slate-200 dark:bg-slate-800" />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-[2rem] border border-red-200 bg-red-50 p-10 text-center dark:border-red-900/50 dark:bg-slate-900">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">Unable to fetch buses</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white transition hover:bg-red-700"
              >
                <RefreshCcw className="h-4 w-4" /> Retry Search
              </button>
            </div>
          )}

          {/* Bus Listing */}
          {!loading && !error && (
            <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
              
              {/* Sidebar Filters */}
              <aside className="hidden lg:sticky lg:top-24 lg:block">
                <BusFilters
                  busTypes={busTypes}
                  filters={filters}
                  setFilters={setFilters}
                  maxPrice={maxPrice}
                />
              </aside>

              <div>
                {/* Mobile Filter Toggle */}
                <div className="mb-5 lg:hidden">
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters((prev) => !prev)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-red-500" />
                    {showMobileFilters ? "Hide Filters" : "Filter Buses"}
                  </button>
                  {showMobileFilters && (
                    <div className="mt-4 animate-in slide-in-from-top-2">
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

                <div className="mt-6">
                  {filteredAndSortedBuses.length > 0 ? (
                    <BusList
                      buses={filteredAndSortedBuses}
                      journeyDate={formData.date || today}
                    />
                  ) : (
                    <div className="rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
                        <Bus className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">No buses found</h3>
                      <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-slate-500 dark:text-slate-400">
                        We couldn't find any buses for this route. Try changing the date or clearing filters.
                      </p>
                      {hasRouteFilter && (
                        <button
                          type="button"
                          onClick={handleShowAll}
                          className="mt-6 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white hover:bg-red-700"
                        >
                          View All Available Buses
                        </button>
                      )}
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