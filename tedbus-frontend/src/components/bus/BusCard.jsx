import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Armchair,
  ArrowRight,
  BusFront,
  Camera,
  CheckCircle2,
  Droplets,
  MapPin,
  Plug,
  ShieldCheck,
  Star,
  Wifi,
} from "lucide-react";

/**
 * Accent palette per bus — kept intentionally restrained:
 * one solid color used for the top hairline, the icon ring,
 * and the primary button. No heavy gradients on content.
 */
const BUS_THEMES = [
  { solid: "#DC2626", text: "text-red-600 dark:text-red-400", ring: "ring-red-100 dark:ring-red-900/40", chip: "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40" },
  { solid: "#7C3AED", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-100 dark:ring-violet-900/40", chip: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/40" },
  { solid: "#059669", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-100 dark:ring-emerald-900/40", chip: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40" },
  { solid: "#2563EB", text: "text-blue-600 dark:text-blue-400", ring: "ring-blue-100 dark:ring-blue-900/40", chip: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40" },
  { solid: "#D97706", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-100 dark:ring-amber-900/40", chip: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40" },
  { solid: "#DB2777", text: "text-pink-600 dark:text-pink-400", ring: "ring-pink-100 dark:ring-pink-900/40", chip: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/40" },
  { solid: "#4F46E5", text: "text-indigo-600 dark:text-indigo-400", ring: "ring-indigo-100 dark:ring-indigo-900/40", chip: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40" },
  { solid: "#0D9488", text: "text-teal-600 dark:text-teal-400", ring: "ring-teal-100 dark:ring-teal-900/40", chip: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/40" },
  { solid: "#0891B2", text: "text-cyan-600 dark:text-cyan-400", ring: "ring-cyan-100 dark:ring-cyan-900/40", chip: "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/40" },
  { solid: "#334155", text: "text-slate-700 dark:text-slate-300", ring: "ring-slate-200 dark:ring-slate-700", chip: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
];

const extractImageUrl = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return String(value.url || value.secure_url || value.imageUrl || value.src || "").trim();
};

const getBusImageUrl = (bus) => {
  const candidates = [
    bus?.busImage,
    bus?.image,
    bus?.imageUrl,
    bus?.thumbnail,
    bus?.coverImage,
    bus?.photos?.[0],
    bus?.images?.[0],
    bus?.busImages?.[0],
  ];
  for (const image of candidates) {
    const url = extractImageUrl(image);
    if (url) return url;
  }
  return "";
};

const getStableThemeIndex = (busId, index, totalThemes) => {
  if (Number.isInteger(index) && index >= 0) return index % totalThemes;
  const id = String(busId || "tedbus");
  const hash = Array.from(id).reduce((r, c) => (r * 31 + c.charCodeAt(0)) % 100000, 0);
  return hash % totalThemes;
};

/** Compact fallback illustration — used only when no real photo is available. */
const BusFallbackVisual = ({ busId, color }) => {
  const safeId = String(busId || "default").replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `busgrad-${safeId}`;
  return (
    <svg viewBox="0 0 220 160" className="h-full w-full" role="img" aria-label="Bus placeholder">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <rect width="220" height="160" fill="#0f172a" />
      <rect x="0" y="118" width="220" height="42" fill="#020617" />
      <path d="M0 140 H220" stroke="#475569" strokeWidth="1.5" strokeDasharray="10 7" opacity="0.5" />
      <rect x="28" y="44" width="164" height="66" rx="14" fill={`url(#${gradId})`} />
      <rect x="36" y="52" width="148" height="30" rx="8" fill="#111827" opacity="0.85" />
      <rect x="42" y="57" width="24" height="20" rx="4" fill="#94a3b8" />
      <rect x="72" y="57" width="24" height="20" rx="4" fill="#94a3b8" />
      <rect x="102" y="57" width="24" height="20" rx="4" fill="#94a3b8" />
      <rect x="132" y="57" width="24" height="20" rx="4" fill="#94a3b8" />
      <circle cx="60" cy="118" r="14" fill="#020617" />
      <circle cx="60" cy="118" r="7" fill="#64748b" />
      <circle cx="158" cy="118" r="14" fill="#020617" />
      <circle cx="158" cy="118" r="7" fill="#64748b" />
      <text x="110" y="100" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="800" fontFamily="Arial, sans-serif" letterSpacing="1">
        TedBus
      </text>
    </svg>
  );
};

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const getAmenityIcon = (amenity) => {
  const text = String(amenity).toLowerCase();
  if (text.includes("wifi")) return Wifi;
  if (text.includes("charging") || text.includes("plug")) return Plug;
  if (text.includes("cctv") || text.includes("camera")) return Camera;
  if (text.includes("water")) return Droplets;
  return CheckCircle2;
};

const BusCard = ({ bus, journeyDate, index }) => {
  const location = useLocation();
  const busId = bus?._id || bus?.id || "";
  const stableBusId = String(busId || "tedbus");

  const themeIndex = useMemo(
    () => getStableThemeIndex(stableBusId, index, BUS_THEMES.length),
    [stableBusId, index],
  );
  const theme = BUS_THEMES[themeIndex];

  const busImage = useMemo(() => getBusImageUrl(bus), [bus]);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [busImage]);

  const name = bus?.name || bus?.busName || bus?.operatorName || "TedBus Partner";
  const type = bus?.type || bus?.busType || bus?.category || "Premium Coach";
  const departure = bus?.departure || bus?.departureTime || bus?.startTime || "—";
  const arrival = bus?.arrival || bus?.arrivalTime || bus?.endTime || "—";
  const source = bus?.source || "Source";
  const destination = bus?.destination || "Destination";
  const duration = bus?.duration || "—";
  const rating = Number(bus?.rating ?? bus?.averageRating ?? 0);
  const reviews = Number(bus?.reviewsCount ?? bus?.totalReviews ?? 0);
  const hasRating = rating > 0;

  const price = Number(
    bus?.price ?? bus?.fare ?? bus?.ticketPrice ?? bus?.baseFare ?? bus?.seatPrice ?? 0,
  );
  const seatsLeft = Number(
    bus?.seatsAvailable ??
      bus?.availableSeats ??
      bus?.totalAvailableSeats ??
      bus?.availableSeatCount ??
      bus?.seats ??
      0,
  );
  const amenities = Array.isArray(bus?.amenities) ? bus.amenities : [];

  const queryDate = new URLSearchParams(location.search).get("date");
  const finalJourneyDate = journeyDate || bus?.journeyDate || queryDate || "";

  const seatSelectionLink = busId
    ? `/seat-selection/${busId}${finalJourneyDate ? `?date=${encodeURIComponent(finalJourneyDate)}` : ""}`
    : "#";
  const detailLink = busId
    ? `/bus/${busId}${finalJourneyDate ? `?date=${encodeURIComponent(finalJourneyDate)}` : ""}`
    : "#";

  const lowSeatAvailability = seatsLeft > 0 && seatsLeft <= 5;

  return (
    <article
      className="bus-card-anim group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-transparent hover:shadow-[0_2px_4px_rgba(15,23,42,0.08),0_24px_48px_-14px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-900"
      style={{ "--accent": theme.solid }}
    >
      <style>{`
        @keyframes busCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .bus-card-anim { animation: busCardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes shimmerSweep {
          from { transform: translateX(-120%) skewX(-12deg); }
          to { transform: translateX(220%) skewX(-12deg); }
        }
        .bus-card-anim:hover .shimmer-sweep { animation: shimmerSweep 1.1s ease; }
        @keyframes accentPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .bus-card-anim:hover .accent-bar { animation: accentPulse 1.6s ease-in-out infinite; }
      `}</style>

      {/* Hairline accent */}
      <div
        className="accent-bar absolute inset-x-0 top-0 h-[3px] transition-all duration-300 group-hover:h-[4px]"
        style={{ backgroundColor: theme.solid }}
      />

      <div className="flex flex-col sm:flex-row">
        {/* Small, real bus photo */}
        <div className="relative h-36 w-full shrink-0 overflow-hidden bg-slate-950 sm:h-auto sm:w-40 md:w-48">
          {busImage && !imageFailed ? (
            <img
              src={busImage}
              alt={`${name} bus`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <BusFallbackVisual busId={`${stableBusId}-${themeIndex}`} color={theme.solid} />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          {/* Shine sweep on hover */}
          <div className="shimmer-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-0.5">
            <BusFront className="h-3 w-3" />
            {type}
          </span>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 px-4 py-3.5 sm:px-5 sm:py-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-xl font-extrabold leading-tight tracking-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-2xl group-hover:[color:var(--accent)]">
                    {name}
                  </h3>
                  <ShieldCheck
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${theme.text}`}
                    aria-label="Verified operator"
                  />
                </div>
                <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Operated by TedBus &middot; Verified partner
                </p>
              </div>

              <div className="shrink-0 text-right">
                {hasRating ? (
                  <div className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${theme.chip}`}>
                    <Star className="h-3 w-3 fill-current" />
                    {rating.toFixed(1)}
                    {reviews > 0 && (
                      <span className="ml-0.5 font-medium opacity-70">({reviews})</span>
                    )}
                  </div>
                ) : (
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    New
                  </span>
                )}
              </div>
            </div>

            {/* Route timeline */}
            <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="min-w-0">
                <p className="text-lg font-bold leading-none text-slate-900 dark:text-white">{departure}</p>
                <p className="mt-1 max-w-[8rem] truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {source}
                </p>
              </div>

              <div className="flex flex-col items-center px-1">
                <span className="text-[10px] font-semibold text-slate-400">{duration}</span>
                <div className="mt-1 flex w-full items-center">
                  <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
                  <span
                    className={`mx-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white ring-1 transition-transform duration-500 group-hover:translate-x-0.5 dark:bg-slate-900 ${theme.ring}`}
                  >
                    <BusFront className={`h-3 w-3 ${theme.text}`} />
                  </span>
                  <span className="h-px flex-1 bg-slate-300 dark:bg-slate-600" />
                </div>
              </div>

              <div className="min-w-0 text-right">
                <p className="text-lg font-bold leading-none text-slate-900 dark:text-white">{arrival}</p>
                <p className="mt-1 max-w-[8rem] truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {destination}
                </p>
              </div>
            </div>

            {formatDate(finalJourneyDate) && (
              <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-400">
                <MapPin className="h-3 w-3" />
                {formatDate(finalJourneyDate)}
              </p>
            )}

            {/* Amenities */}
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {(amenities.length > 0
                ? amenities.slice(0, 4)
                : ["Sanitized", "Instant booking"]
              ).map((amenity, i) => {
                const Icon = amenities.length > 0 ? getAmenityIcon(amenity) : CheckCircle2;
                return (
                  <span
                    key={`${amenity}-${i}`}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400"
                  >
                    <Icon className="h-3 w-3 text-slate-400" />
                    {amenity}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
            <div>
              <p
                className={`flex items-center gap-1.5 text-xs font-semibold ${
                  lowSeatAvailability
                    ? "animate-pulse text-rose-600 dark:text-rose-400"
                    : seatsLeft > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Armchair className="h-3.5 w-3.5" />
                {seatsLeft > 0
                  ? lowSeatAvailability
                    ? `${seatsLeft} seats left`
                    : `${seatsLeft} seats available`
                  : "Checking availability"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right transition-transform duration-300 group-hover:-translate-y-0.5">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">Starting at</p>
                <p className="text-lg font-extrabold leading-none text-slate-900 dark:text-white">
                  &#8377;{formatCurrency(price)}
                </p>
              </div>

              <Link
                to={detailLink}
                state={{ bus, journeyDate: finalJourneyDate }}
                className={`hidden items-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex ${
                  !busId ? "pointer-events-none opacity-50" : ""
                }`}
              >
                Details
              </Link>

              <Link
                to={seatSelectionLink}
                state={{ bus, journeyDate: finalJourneyDate }}
                className={`group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg px-4 py-2 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97] ${
                  !busId ? "pointer-events-none opacity-50" : ""
                }`}
                style={{ backgroundColor: theme.solid, boxShadow: `0 4px 14px -4px ${theme.solid}66` }}
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover/btn:left-full group-hover/btn:opacity-100" />
                Select seats
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BusCard;