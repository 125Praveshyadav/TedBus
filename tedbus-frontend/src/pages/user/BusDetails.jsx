import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  Armchair,
  ArrowLeft,
  ArrowRight,
  BusFront,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  CreditCard,
  Droplets,
  MapPin,
  Plug,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Wifi,
  Zap,
} from "lucide-react";

import ReviewList from "../../components/review/ReviewList";
import { busService } from "../../services/busService";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Journey date not selected";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    const fallback = new Date(date);

    if (Number.isNaN(fallback.getTime())) return date;

    return fallback.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value._id || value.id || "";
  }
  return "";
};

const getActualBusId = (busData, fallbackId = "") => {
  const possibleIds = [
    busData?.bus?._id,
    busData?.bus?.id,
    busData?.busId?._id,
    busData?.busId?.id,
    busData?.vehicle?._id,
    busData?.vehicle?.id,
    busData?.actualBusId,
    busData?.busRef,
    busData?.bus,
    busData?.busId,
    busData?._id,
    busData?.id,
    fallbackId,
  ];

  for (const item of possibleIds) {
    const normalized = normalizeId(item) || item;
    if (typeof normalized === "string" && normalized.trim()) {
      return normalized;
    }
  }

  return "";
};

const getAmenityIcon = (amenity) => {
  const text = String(amenity).toLowerCase();

  if (text.includes("wifi")) return Wifi;
  if (text.includes("charg") || text.includes("plug")) return Plug;
  if (text.includes("cctv") || text.includes("camera")) return Camera;
  if (text.includes("water")) return Droplets;

  return CheckCircle2;
};

const AMENITY_THEMES = [
  {
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-100 dark:border-violet-900/50",
    icon: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
  },
  {
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    border: "border-cyan-100 dark:border-cyan-900/50",
    icon: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
  },
  {
    bg: "bg-rose-50 dark:bg-rose-950/40",
    border: "border-rose-100 dark:border-rose-900/50",
    icon: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
  },
  {
    bg: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-100 dark:border-amber-900/50",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
  },
  {
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-100 dark:border-emerald-900/50",
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  {
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    border: "border-indigo-100 dark:border-indigo-900/50",
    icon: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
  },
];

const normalizeBus = (bus) => {
  if (!bus) return null;

  const price =
    bus.price ||
    bus.fare ||
    bus.ticketPrice ||
    bus.baseFare ||
    bus.seatPrice ||
    0;

  const departure =
    bus.departure || bus.departureTime || bus.startTime || "";
  const arrival =
    bus.arrival || bus.arrivalTime || bus.endTime || "";
  const type =
    bus.type || bus.busType || bus.category || "Standard Bus";
  const name =
    bus.name ||
    bus.busName ||
    bus.operatorName ||
    "TedBus Partner";

  const seats =
    bus.seatsAvailable ??
    bus.availableSeats ??
    bus.totalAvailableSeats ??
    bus.availableSeatCount ??
    bus.seats ??
    bus.totalSeats ??
    0;

  const amenities = Array.isArray(bus.amenities)
    ? bus.amenities
    : [];

  const boardingPoints = Array.isArray(bus.boardingPoints)
    ? bus.boardingPoints
    : Array.isArray(bus.boarding)
      ? bus.boarding
      : [];

  const droppingPoints = Array.isArray(bus.droppingPoints)
    ? bus.droppingPoints
    : Array.isArray(bus.dropping)
      ? bus.dropping
      : [];

  return {
    ...bus,
    id: bus._id || bus.id,
    _id: bus._id || bus.id,
    name,
    type,
    departure,
    arrival,
    duration: bus.duration || "—",
    price,
    seatsAvailable: seats,
    seats,
    rating: bus.rating || bus.averageRating || 4.2,
    reviewsCount: bus.reviewsCount || bus.totalReviews || 0,
    source: bus.source || "Source",
    destination: bus.destination || "Destination",
    journeyDate: bus.journeyDate || bus.date || "",
    amenities,
    boardingPoints,
    droppingPoints,
  };
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  iconGradient = "from-violet-600 to-indigo-600",
  iconShadow = "shadow-violet-500/25",
  children,
}) => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
    <div className="flex items-center gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:p-5">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconGradient} text-white shadow-lg ${iconShadow}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <h2 className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const BusDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateBus = location.state?.bus || null;
  const stateJourneyDate =
    location.state?.journeyDate || "";
  const queryJourneyDate =
    searchParams.get("date") || "";
  const reviewBookingId =
    searchParams.get("reviewBooking") || null;

  const [bus, setBus] = useState(() =>
    normalizeBus(stateBus),
  );
  const [loading, setLoading] = useState(!stateBus);
  const [error, setError] = useState("");

  const journeyDate =
    queryJourneyDate ||
    stateJourneyDate ||
    bus?.journeyDate ||
    "";

  const busId = bus?._id || bus?.id || id;

  const reviewBusId = useMemo(() => {
    return getActualBusId(bus, id);
  }, [bus, id]);

  const seatSelectionUrl = `/seat-selection/${busId}${
    journeyDate ? `?date=${journeyDate}` : ""
  }`;

  const fetchBusDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await busService.getBusById(id);
      const apiBus = busService.extractBus(response);
      const normalized = normalizeBus(apiBus);

      if (!normalized) throw new Error("Bus details not found");

      setBus(normalized);
    } catch (err) {
      setError(
        err?.message || "Unable to load bus details",
      );
      setBus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchBusDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const amenitiesToRender = useMemo(() => {
    if (bus?.amenities?.length) return bus.amenities;
    return [
      "Verified Bus",
      "Free Cancellation",
      "Secure Booking",
    ];
  }, [bus]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-950 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 h-24 animate-pulse rounded-[1.75rem] bg-gradient-to-br from-violet-200 via-cyan-100 to-rose-100 dark:from-violet-950 dark:via-slate-900 dark:to-rose-950" />

          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                />
              ))}
            </div>

            <div className="h-80 animate-pulse rounded-[1.75rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 transition-colors duration-300 dark:bg-slate-950">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-2xl shadow-red-500/10 dark:border-red-900/50 dark:bg-slate-900 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
              Bus details unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {error ||
                "We could not find this bus. Please try again."}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchBusDetails}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              >
                <RefreshCcw className="h-4 w-4" />
                Retry
              </button>

              <Link
                to="/search-bus"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Back to Search
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isLowSeats =
    Number(bus.seatsAvailable) > 0 &&
    Number(bus.seatsAvailable) <= 5;

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact premium top hero */}
      <section className="border-b border-slate-200/60 bg-white/70 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          {/* back button */}
          <div className="mb-4">
            <Link
              to="/search-bus"
              className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </Link>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-50 to-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-rose-600 shadow-sm dark:from-rose-950/40 dark:to-violet-950/40 dark:text-rose-400">
                <Sparkles className="h-3.5 w-3.5" />
                TedBus Assured
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                {bus.name}
              </h1>

              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                {bus.type}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold sm:text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/30 dark:text-violet-400">
                  <BusFront className="h-3.5 w-3.5" />
                  {bus.source}
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />

                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-cyan-700 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-400">
                  <MapPin className="h-3.5 w-3.5" />
                  {bus.destination}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatJourneyDate(journeyDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-emerald-500/25">
                <Star className="h-4 w-4 fill-white" />
                {Number(bus.rating || 0).toFixed(1)}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Starting from
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  ₹{formatCurrency(bus.price)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-5">
            <SectionCard
              title="Journey Details"
              subtitle="Timings and route information"
              icon={Clock3}
              iconGradient="from-violet-600 to-indigo-600"
              iconShadow="shadow-violet-500/25"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="rounded-2xl bg-violet-50 p-4 dark:bg-violet-950/30 sm:p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-violet-500 dark:text-violet-400">
                    Departure
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    {bus.departure || "—"}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    {bus.source}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex flex-row items-center gap-2 md:flex-col md:gap-0">
                    <div className="h-px w-12 bg-slate-200 dark:bg-slate-700 md:hidden" />

                    <div className="flex flex-col items-center gap-2">
                      <Clock3 className="hidden h-4 w-4 text-slate-400 dark:text-slate-500 md:block" />
                      <div className="my-1 hidden h-px w-16 border-t border-dashed border-slate-300 dark:border-slate-600 md:block lg:w-24" />
                      <span className="whitespace-nowrap rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[10px] font-black text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                        {bus.duration}
                      </span>
                      <div className="my-1 hidden h-px w-16 border-t border-dashed border-slate-300 dark:border-slate-600 md:block lg:w-24" />
                    </div>

                    <div className="h-px w-12 bg-slate-200 dark:bg-slate-700 md:hidden" />
                  </div>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4 dark:bg-cyan-950/30 sm:p-5 md:text-right">
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-cyan-500 dark:text-cyan-400">
                    Arrival
                  </p>

                  <h3 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
                    {bus.arrival || "—"}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-400 md:justify-end">
                    <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    {bus.destination}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Amenities"
              subtitle="Facilities available in this bus"
              icon={Zap}
              iconGradient="from-amber-500 to-orange-500"
              iconShadow="shadow-amber-500/25"
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenitiesToRender.map((amenity, index) => {
                  const Icon = getAmenityIcon(amenity);
                  const theme =
                    AMENITY_THEMES[index % AMENITY_THEMES.length];

                  return (
                    <div
                      key={amenity}
                      className={`flex items-center gap-3 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md sm:p-4 ${theme.bg} ${theme.border}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.iconBg}`}
                      >
                        <Icon className={`h-5 w-5 ${theme.icon}`} />
                      </div>

                      <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <div className="grid gap-5 md:grid-cols-2">
              <SectionCard
                title="Boarding Points"
                subtitle="Choose while selecting seats"
                icon={MapPin}
                iconGradient="from-emerald-600 to-teal-500"
                iconShadow="shadow-emerald-500/25"
              >
                <div className="space-y-3">
                  {bus.boardingPoints.length > 0 ? (
                    bus.boardingPoints.map((point, index) => (
                      <div
                        key={`${point}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/30 sm:p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {point}
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            Stop {index + 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      Available during seat selection.
                    </p>
                  )}
                </div>
              </SectionCard>

              <SectionCard
                title="Dropping Points"
                subtitle="Select your preferred drop location"
                icon={MapPin}
                iconGradient="from-cyan-600 to-sky-500"
                iconShadow="shadow-cyan-500/25"
              >
                <div className="space-y-3">
                  {bus.droppingPoints.length > 0 ? (
                    bus.droppingPoints.map((point, index) => (
                      <div
                        key={`${point}-${index}`}
                        className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-3 dark:border-cyan-900/50 dark:bg-cyan-950/30 sm:p-4"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            {point}
                          </p>

                          <p className="mt-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            Stop {index + 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                      Available during seat selection.
                    </p>
                  )}
                </div>
              </SectionCard>
            </div>

            <SectionCard
              title="Travel Policies"
              subtitle="What you can expect on board"
              icon={ShieldCheck}
              iconGradient="from-emerald-600 to-green-500"
              iconShadow="shadow-emerald-500/25"
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-4 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-green-950/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Safe Travel
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                    Verified bus operator and secure booking.
                  </p>
                </div>

                <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 dark:border-violet-900/50 dark:from-violet-950/40 dark:to-indigo-950/30">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                    <Ticket className="h-5 w-5" />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Instant Ticket
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                    Ticket confirmation right after payment.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-900/50 dark:from-amber-950/40 dark:to-orange-950/30 sm:col-span-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <CreditCard className="h-5 w-5" />
                  </div>

                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Secure Payment
                  </h3>

                  <p className="mt-1 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
                    Pay via UPI, cards or wallets.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right sidebar */}
          <aside className="lg:sticky lg:top-6 lg:h-fit">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />

                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Starting from
                  </p>

                  <h2 className="mt-1 text-3xl font-black sm:text-4xl">
                    ₹{formatCurrency(bus.price)}
                  </h2>

                  <p className="mt-1 text-[10px] font-semibold text-slate-500">
                    Per seat · Taxes calculated at checkout
                  </p>
                </div>
              </div>

              <div className="relative z-10">
                <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
                <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <div
                  className={`flex items-center justify-between rounded-2xl border p-4 ${
                    isLowSeats
                      ? "border-rose-100 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/30"
                      : "border-emerald-100 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30"
                  }`}
                >
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Seats available
                    </p>

                    <p
                      className={`mt-1 text-xl font-black ${
                        isLowSeats
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {bus.seatsAvailable || "—"}
                    </p>

                    {isLowSeats && (
                      <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">
                        Filling fast!
                      </p>
                    )}
                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      isLowSeats
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
                        : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                    }`}
                  >
                    <Armchair className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4 dark:border-violet-900/50 dark:bg-violet-950/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                    <CalendarDays className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Journey date
                    </p>

                    <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">
                      {formatJourneyDate(journeyDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                      Rating
                    </p>

                    <p className="mt-0.5 text-sm font-black text-slate-900 dark:text-white">
                      {Number(bus.rating || 0).toFixed(1)} ·{" "}
                      {bus.reviewsCount > 0
                        ? `${bus.reviewsCount}+ reviews`
                        : "Verified operator"}
                    </p>
                  </div>
                </div>

                <Link
                  to={seatSelectionUrl}
                  state={{ bus, journeyDate }}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-rose-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-rose-500/30 active:translate-y-0 active:scale-[0.98]"
                >
                  Select Seats
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Safe & secure booking by TedBus
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  {[
                    {
                      icon: TrendingUp,
                      text: "Best price guaranteed",
                      color: "text-violet-500",
                    },
                    {
                      icon: Zap,
                      text: "Instant confirmation",
                      color: "text-amber-500",
                    },
                    {
                      icon: CheckCircle2,
                      text: "Free cancellation available",
                      color: "text-emerald-500",
                    },
                  ].map((info) => {
                    const InfoIcon = info.icon;

                    return (
                      <div
                        key={info.text}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400"
                      >
                        <InfoIcon className={`h-3.5 w-3.5 ${info.color}`} />
                        {info.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ✅ Full width premium reviews section — better placement */}
        <div className="mx-auto mt-6 max-w-6xl">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-amber-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25">
                  <Star className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Traveller Reviews
                  </h2>

                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Real experiences from verified TedBus passengers
                  </p>
                </div>
              </div>
            </div>

            <ReviewList
              busId={reviewBusId}
              bookingId={reviewBookingId}
            />
          </div>
        </div>
      </section>

      {/* Mobile sticky bar */}
      <div className="sticky bottom-0 z-20 border-t border-slate-200/60 bg-white/90 px-4 py-3 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/90 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Starting from
            </p>

            <p className="text-xl font-black text-slate-900 dark:text-white">
              ₹{formatCurrency(bus.price)}
            </p>
          </div>

          <Link
            to={seatSelectionUrl}
            state={{ bus, journeyDate }}
            className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
          >
            Select Seats
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BusDetails;