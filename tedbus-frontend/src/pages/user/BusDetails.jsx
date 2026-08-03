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
  Star,
  Ticket,
  Wifi,
} from "lucide-react";
import ReviewList from "../../components/review/ReviewList";

import { busService } from "../../services/busService";

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Journey date not selected";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    const fallbackDate = new Date(date);

    if (Number.isNaN(fallbackDate.getTime())) {
      return date;
    }

    return fallbackDate.toLocaleDateString("en-IN", {
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

const getAmenityIcon = (amenity) => {
  const text = String(amenity).toLowerCase();

  if (text.includes("wifi")) return Wifi;
  if (text.includes("charging") || text.includes("plug")) return Plug;
  if (text.includes("cctv") || text.includes("camera")) return Camera;
  if (text.includes("water")) return Droplets;

  return CheckCircle2;
};

const normalizeBus = (bus) => {
  if (!bus) return null;

  const price =
    bus.price ||
    bus.fare ||
    bus.ticketPrice ||
    bus.baseFare ||
    bus.seatPrice ||
    0;

  const departure = bus.departure || bus.departureTime || bus.startTime || "";

  const arrival = bus.arrival || bus.arrivalTime || bus.endTime || "";

  const type = bus.type || bus.busType || bus.category || "Standard Bus";

  const name = bus.name || bus.busName || bus.operatorName || "TedBus Partner";

  const seats =
    bus.seatsAvailable ??
    bus.availableSeats ??
    bus.totalAvailableSeats ??
    bus.availableSeatCount ??
    bus.seats ??
    bus.totalSeats ??
    0;

  const amenities = Array.isArray(bus.amenities) ? bus.amenities : [];

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

const BusDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();


  

  const stateBus = location.state?.bus || null;
  const stateJourneyDate = location.state?.journeyDate || "";

  const queryJourneyDate = searchParams.get("date") || "";
    const reviewBookingId = searchParams.get("reviewBooking") || null;
  const [bus, setBus] = useState(() => normalizeBus(stateBus));
  const [loading, setLoading] = useState(!stateBus);
  const [error, setError] = useState("");

  const journeyDate =
    queryJourneyDate || stateJourneyDate || bus?.journeyDate || "";

  const busId = bus?._id || bus?.id || id;

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

      if (!normalized) {
        throw new Error("Bus details not found");
      }

      setBus(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load bus details");
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

    return ["Verified Bus", "Free Cancellation", "Secure Booking"];
  }, [bus]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 h-40 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:rounded-[2rem]" />

          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <div className="h-56 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:rounded-[2rem]" />
              <div className="h-48 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:rounded-[2rem]" />
              <div className="h-48 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:rounded-[2rem]" />
            </div>

            <div className="h-80 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:rounded-[2rem]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-6 text-center sm:rounded-[2rem] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="mt-4 text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
            Bus details unavailable
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-400">
            {error || "We could not find this bus. Please try again."}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={fetchBusDetails}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 active:scale-[0.98]"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </button>

            <Link
              to="/search-bus"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-8 text-white dark:from-red-700 dark:via-red-600 dark:to-orange-600 sm:px-6 sm:py-10 lg:px-8">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur sm:text-sm">
            <BusFront className="h-4 w-4" />
            TedBus Assured
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                {bus.name}
              </h1>

              <p className="mt-2 text-sm font-semibold text-red-50 sm:text-base">
                {bus.type}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{bus.source}</span>
                </span>

                <ArrowRight className="h-4 w-4 shrink-0 text-red-100" />

                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{bus.destination}</span>
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur sm:px-4 sm:py-2">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  {formatJourneyDate(journeyDate)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1 rounded-2xl bg-green-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                <Star className="h-4 w-4 fill-white" />
                {Number(bus.rating || 0).toFixed(1)}
              </div>

              <span className="rounded-2xl bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur sm:text-sm">
                {bus.reviewsCount > 0
                  ? `${bus.reviewsCount}+ Reviews`
                  : "Verified Operator"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-5 sm:gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left Content */}
          <div className="space-y-5 sm:space-y-6">
            {/* Journey Details */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                    Journey Details
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Timings and route information
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
                  <Clock3 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-5">
                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 sm:p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Departure
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                    {bus.departure || "—"}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    {bus.source}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  {/* horizontal divider on mobile, vertical layout on desktop */}
                  <div className="flex w-full flex-row items-center justify-center gap-3 md:flex-col md:gap-0">
                    <div className="h-px w-16 bg-slate-300 dark:bg-slate-700 md:hidden" />
                    <div className="flex flex-col items-center">
                      <Clock3 className="hidden h-5 w-5 text-slate-400 md:block" />
                      <div className="my-0 hidden h-px w-20 bg-slate-300 dark:bg-slate-700 md:my-3 md:block lg:w-28" />
                      <span className="whitespace-nowrap rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 dark:bg-red-950/40 dark:text-red-400">
                        {bus.duration}
                      </span>
                    </div>
                    <div className="h-px w-16 bg-slate-300 dark:bg-slate-700 md:hidden" />
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950 sm:p-5 md:text-right">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Arrival
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                    {bus.arrival || "—"}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                    {bus.destination}
                  </p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                Amenities
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                Facilities available in this bus
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {amenitiesToRender.map((amenity) => {
                  const Icon = getAmenityIcon(amenity);

                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-red-100 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:border-red-900/40 dark:hover:bg-slate-800/60 sm:p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm dark:bg-slate-900 dark:text-red-400">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Boarding and Dropping */}
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
                <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                  Boarding Points
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Choose while selecting seats
                </p>

                <div className="mt-5 space-y-3">
                  {bus.boardingPoints.length > 0 ? (
                    bus.boardingPoints.map((point, index) => (
                      <div
                        key={`${point}-${index}`}
                        className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950 sm:p-4"
                      >
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                            {point}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                            Boarding point {index + 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                      Boarding points will be available during seat selection.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
                <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                  Dropping Points
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Select your preferred drop location
                </p>

                <div className="mt-5 space-y-3">
                  {bus.droppingPoints.length > 0 ? (
                    bus.droppingPoints.map((point, index) => (
                      <div
                        key={`${point}-${index}`}
                        className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950 sm:p-4"
                      >
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-100">
                            {point}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                            Dropping point {index + 1}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                      Dropping points will be available during seat selection.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem] sm:p-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                Travel Policies
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-950/30">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Safe Travel
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Verified bus operator and secure booking.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Instant Ticket
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Ticket confirmation after payment.
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-950/30 sm:col-span-2 md:col-span-1">
                  <CreditCard className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  <h3 className="mt-3 text-sm font-black text-slate-800 dark:text-slate-100">
                    Secure Payment
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Pay securely using trusted payment options.
                  </p>
                </div>
              </div>
            </div>
                <div className="w-full">
              <ReviewList busId={busId} bookingId={reviewBookingId} />
            </div>
          </div>

          {/* Right Booking Summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[2rem]">
              <div className="bg-slate-900 p-6 text-white dark:bg-slate-950">
                <p className="text-sm font-bold text-slate-300">
                  Starting from
                </p>

                <h2 className="mt-1 text-3xl font-black sm:text-4xl">
                  ₹{formatCurrency(bus.price)}
                </h2>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Per seat fare may vary based on selected seat.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Seats Available
                    </p>

                    <p
                      className={`mt-1 text-lg font-black ${
                        Number(bus.seatsAvailable) <= 5
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {bus.seatsAvailable || "Updating"}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-900">
                    <Armchair className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Journey Date
                  </p>

                  <p className="mt-1 text-sm font-black text-slate-800 dark:text-slate-100">
                    {formatJourneyDate(journeyDate)}
                  </p>
                </div>

                <Link
                  to={seatSelectionUrl}
                  state={{
                    bus,
                    journeyDate,
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98] dark:shadow-red-900/30"
                >
                  Select Seats
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Safe & secure booking by TedBus
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Mobile sticky booking bar */}
      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Starting from
            </p>
            <p className="text-xl font-black text-slate-900 dark:text-white">
              ₹{formatCurrency(bus.price)}
            </p>
          </div>

          <Link
            to={seatSelectionUrl}
            state={{ bus, journeyDate }}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98]"
          >
            Select Seats
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BusDetails;