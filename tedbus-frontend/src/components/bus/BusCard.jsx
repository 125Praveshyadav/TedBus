import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Armchair,
  ArrowRight,
  BusFront,
  Camera,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  Plug,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
} from "lucide-react";


const BUS_THEMES = [
  {
    gradient: "from-red-600 to-orange-500",
    text: "text-red-600 dark:text-red-400",
    bgSoft: "bg-red-50 dark:bg-red-950/30",
    borderSoft: "border-red-100 dark:border-red-900/50",
    hoverGlow: "hover:shadow-red-500/15 hover:border-red-200 dark:hover:border-red-900/60",
    btnPrimary: "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-red-500/25",
    btnSecondaryHover: "hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-400 dark:hover:border-red-900/50",
  },
  {
    gradient: "from-violet-600 to-purple-500",
    text: "text-violet-600 dark:text-violet-400",
    bgSoft: "bg-violet-50 dark:bg-violet-950/30",
    borderSoft: "border-violet-100 dark:border-violet-900/50",
    hoverGlow: "hover:shadow-violet-500/15 hover:border-violet-200 dark:hover:border-violet-900/60",
    btnPrimary: "bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-violet-500/25",
    btnSecondaryHover: "hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 dark:hover:border-violet-900/50",
  },
  {
    gradient: "from-emerald-600 to-teal-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bgSoft: "bg-emerald-50 dark:bg-emerald-950/30",
    borderSoft: "border-emerald-100 dark:border-emerald-900/50",
    hoverGlow: "hover:shadow-emerald-500/15 hover:border-emerald-200 dark:hover:border-emerald-900/60",
    btnPrimary: "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-500/25",
    btnSecondaryHover: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 dark:hover:border-emerald-900/50",
  },
  {
    gradient: "from-blue-600 to-cyan-500",
    text: "text-blue-600 dark:text-blue-400",
    bgSoft: "bg-blue-50 dark:bg-blue-950/30",
    borderSoft: "border-blue-100 dark:border-blue-900/50",
    hoverGlow: "hover:shadow-blue-500/15 hover:border-blue-200 dark:hover:border-blue-900/60",
    btnPrimary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/25",
    btnSecondaryHover: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/30 dark:hover:text-blue-400 dark:hover:border-blue-900/50",
  },
  {
    gradient: "from-amber-500 to-orange-400",
    text: "text-amber-600 dark:text-amber-400",
    bgSoft: "bg-amber-50 dark:bg-amber-950/30",
    borderSoft: "border-amber-100 dark:border-amber-900/50",
    hoverGlow: "hover:shadow-amber-500/15 hover:border-amber-200 dark:hover:border-amber-900/60",
    btnPrimary: "bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-amber-500/25",
    btnSecondaryHover: "hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 dark:hover:bg-amber-950/30 dark:hover:text-amber-400 dark:hover:border-amber-900/50",
  },
  {
    gradient: "from-pink-600 to-rose-500",
    text: "text-pink-600 dark:text-pink-400",
    bgSoft: "bg-pink-50 dark:bg-pink-950/30",
    borderSoft: "border-pink-100 dark:border-pink-900/50",
    hoverGlow: "hover:shadow-pink-500/15 hover:border-pink-200 dark:hover:border-pink-900/60",
    btnPrimary: "bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-pink-500/25",
    btnSecondaryHover: "hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-950/30 dark:hover:text-pink-400 dark:hover:border-pink-900/50",
  },
  {
    gradient: "from-indigo-600 to-blue-500",
    text: "text-indigo-600 dark:text-indigo-400",
    bgSoft: "bg-indigo-50 dark:bg-indigo-950/30",
    borderSoft: "border-indigo-100 dark:border-indigo-900/50",
    hoverGlow: "hover:shadow-indigo-500/15 hover:border-indigo-200 dark:hover:border-indigo-900/60",
    btnPrimary: "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-indigo-500/25",
    btnSecondaryHover: "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400 dark:hover:border-indigo-900/50",
  },
  {
    gradient: "from-teal-600 to-emerald-500",
    text: "text-teal-600 dark:text-teal-400",
    bgSoft: "bg-teal-50 dark:bg-teal-950/30",
    borderSoft: "border-teal-100 dark:border-teal-900/50",
    hoverGlow: "hover:shadow-teal-500/15 hover:border-teal-200 dark:hover:border-teal-900/60",
    btnPrimary: "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-teal-500/25",
    btnSecondaryHover: "hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 dark:hover:bg-teal-950/30 dark:hover:text-teal-400 dark:hover:border-teal-900/50",
  },
  {
    gradient: "from-cyan-600 to-blue-400",
    text: "text-cyan-600 dark:text-cyan-400",
    bgSoft: "bg-cyan-50 dark:bg-cyan-950/30",
    borderSoft: "border-cyan-100 dark:border-cyan-900/50",
    hoverGlow: "hover:shadow-cyan-500/15 hover:border-cyan-200 dark:hover:border-cyan-900/60",
    btnPrimary: "bg-gradient-to-r from-cyan-600 to-blue-400 text-white shadow-cyan-500/25",
    btnSecondaryHover: "hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200 dark:hover:bg-cyan-950/30 dark:hover:text-cyan-400 dark:hover:border-cyan-900/50",
  },
  {
    gradient: "from-slate-800 to-slate-600",
    text: "text-slate-700 dark:text-slate-300",
    bgSoft: "bg-slate-100 dark:bg-slate-800/60",
    borderSoft: "border-slate-200 dark:border-slate-700",
    hoverGlow: "hover:shadow-slate-500/15 hover:border-slate-300 dark:hover:border-slate-600",
    btnPrimary: "bg-gradient-to-r from-slate-800 to-slate-600 text-white shadow-slate-500/25",
    btnSecondaryHover: "hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-600",
  },
];

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatDate = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";
  return parsedDate.toLocaleDateString("en-IN", {
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

// Main Component (Accepts index for Theme Cycling)
const BusCard = ({ bus, journeyDate, index = 0 }) => {
  const location = useLocation();

  // Pick Theme Dynamically
  const theme = useMemo(() => {
    // If index is passed from map, use it. Otherwise create a hash from Bus ID.
    if (typeof index === "number") return BUS_THEMES[index % BUS_THEMES.length];
    
    const id = bus?._id || bus?.id || "fallback";
    const hash = String(id).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return BUS_THEMES[hash % BUS_THEMES.length];
  }, [bus, index]);

  const busId = bus?._id || bus?.id;
  const name = bus?.name || bus?.busName || bus?.operatorName || "TedBus Partner";
  const type = bus?.type || bus?.busType || bus?.category || "Premium Sleeper";
  const departure = bus?.departure || bus?.departureTime || bus?.startTime || "—";
  const arrival = bus?.arrival || bus?.arrivalTime || bus?.endTime || "—";
  const source = bus?.source || "Source";
  const destination = bus?.destination || "Destination";
  const duration = bus?.duration || "—";
  const rating = bus?.rating || bus?.averageRating || 4.5;
  const reviews = bus?.reviewsCount || bus?.totalReviews || 0;

  const price = bus?.price || bus?.fare || bus?.ticketPrice || bus?.baseFare || bus?.seatPrice || 0;
  const seatsLeft = bus?.seatsAvailable ?? bus?.availableSeats ?? bus?.totalAvailableSeats ?? bus?.seats ?? 0;
  const amenities = Array.isArray(bus?.amenities) ? bus.amenities : [];

  const finalJourneyDate = journeyDate || bus?.journeyDate || new URLSearchParams(location.search).get("date");

  const seatSelectionLink = busId ? `/seat-selection/${busId}${finalJourneyDate ? `?date=${finalJourneyDate}` : ""}` : "#";
  const detailLink = busId ? `/bus/${busId}${finalJourneyDate ? `?date=${finalJourneyDate}` : ""}` : "#";

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${theme.hoverGlow}`}
    >
      {/* Top Accent Gradient Bar */}
      <div className={`absolute inset-x-0 top-0 h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />

      {/* Main Content Area */}
      <div className="p-5 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          
          {/* Left Side: Bus Info & Amenities */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] ${theme.bgSoft} ${theme.borderSoft} ${theme.text}`}>
                  <Sparkles className="h-3.5 w-3.5" />
                  TedBus Verified
                </div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {name}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <BusFront className="h-4 w-4" />
                  {type}
                </p>
              </div>

              {/* Mobile Rating */}
              <div className="flex flex-col items-end lg:hidden">
                <div className="inline-flex items-center gap-1 rounded-xl bg-green-500 px-2.5 py-1 text-sm font-black text-white shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {Number(rating).toFixed(1)}
                </div>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {reviews > 0 ? `${reviews}+ Ratings` : "New Bus"}
                </span>
              </div>
            </div>

            {/* Amenities Pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {amenities.length > 0 ? (
                amenities.slice(0, 5).map((amenity) => {
                  const Icon = getAmenityIcon(amenity);
                  return (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300"
                    >
                      <Icon className={`h-3.5 w-3.5 ${theme.text}`} />
                      {amenity}
                    </span>
                  );
                })
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Checked & Sanitized
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Instant Booking
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Side: Journey Timeline */}
          <div className="w-full shrink-0 lg:w-[380px]">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
              {/* Subtle background glow */}
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${theme.bgSoft} blur-3xl`} />

              <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                {/* Source */}
                <div className="text-left">
                  <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {departure}
                  </h4>
                  <p className="mt-1 truncate text-sm font-bold text-slate-500 dark:text-slate-400">
                    {source}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {formatDate(finalJourneyDate) || "Departure"}
                  </p>
                </div>

                {/* Duration Line */}
                <div className="flex flex-col items-center px-2">
                  <p className="mb-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {duration}
                  </p>
                  <div className="flex w-16 items-center sm:w-24">
                    <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                    <BusFront className={`mx-2 h-5 w-5 ${theme.text}`} />
                    <div className="h-[2px] flex-1 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                  </div>
                  <p className="mt-1 text-[10px] font-bold text-slate-400">Non-Stop</p>
                </div>

                {/* Destination */}
                <div className="text-right">
                  <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {arrival}
                  </h4>
                  <p className="mt-1 truncate text-sm font-bold text-slate-500 dark:text-slate-400">
                    {destination}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Arrival
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:px-6 lg:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Seats Info */}
          <div className="flex items-center gap-4">
            {/* Desktop Rating */}
            <div className="hidden flex-col lg:flex">
              <div className="inline-flex items-center gap-1 rounded-xl bg-green-500 px-3 py-1.5 text-sm font-black text-white shadow-sm">
                <Star className="h-4 w-4 fill-current" />
                {Number(rating).toFixed(1)}
              </div>
              <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                {reviews > 0 ? `${reviews}+` : "Verified"}
              </span>
            </div>

            <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-700 lg:block" />

            <div>
              <p
                className={`flex items-center gap-2 text-sm font-black ${
                  Number(seatsLeft) <= 5 && Number(seatsLeft) > 0 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                <Armchair className="h-4 w-4" />
                {Number(seatsLeft) > 0
                  ? Number(seatsLeft) <= 5 
                    ? `Only ${seatsLeft} seats left!` 
                    : `${seatsLeft} seats available`
                  : "Checking availability..."}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Live seat layout • Select your spot
              </p>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Starting Fare
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                ₹{formatCurrency(price)}
              </h2>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              <Link
                to={detailLink}
                state={{ bus, journeyDate: finalJourneyDate }}
                className={`group flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 shadow-sm transition-all duration-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:flex-none ${theme.btnSecondaryHover} ${!busId ? "pointer-events-none opacity-50" : ""}`}
              >
                View Details
              </Link>

              <Link
                to={seatSelectionLink}
                state={{ bus, journeyDate: finalJourneyDate }}
                className={`group flex flex-1 items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-black shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 sm:flex-none ${theme.btnPrimary} ${!busId ? "pointer-events-none opacity-50" : ""}`}
              >
                Select Seats
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default BusCard;