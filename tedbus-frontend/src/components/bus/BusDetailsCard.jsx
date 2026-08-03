import {
  Armchair,
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  Plug,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Users,
  Wifi,
  Zap,
} from "lucide-react";

const DETAIL_THEMES = [
  {
    id: "crimson",
    gradient: "from-red-700 via-red-600 to-orange-500",
    glow: "bg-red-400/25",
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    dotColor: "bg-red-500",
    tagLabel: "Top Rated",
    ratingBg: "bg-red-600",
    amenityIcon: "text-red-500 dark:text-red-400",
  },
  {
    id: "violet",
    gradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    glow: "bg-violet-400/25",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    dotColor: "bg-violet-500",
    tagLabel: "Premium",
    ratingBg: "bg-violet-600",
    amenityIcon: "text-violet-500 dark:text-violet-400",
  },
  {
    id: "emerald",
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    glow: "bg-emerald-400/25",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    dotColor: "bg-emerald-500",
    tagLabel: "Eco Friendly",
    ratingBg: "bg-emerald-600",
    amenityIcon: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: "amber",
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    glow: "bg-amber-400/25",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    dotColor: "bg-amber-500",
    tagLabel: "Best Value",
    ratingBg: "bg-amber-600",
    amenityIcon: "text-amber-500 dark:text-amber-400",
  },
  {
    id: "cyan",
    gradient: "from-cyan-700 via-sky-600 to-blue-500",
    glow: "bg-cyan-400/25",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    dotColor: "bg-cyan-500",
    tagLabel: "Comfort Plus",
    ratingBg: "bg-cyan-600",
    amenityIcon: "text-cyan-500 dark:text-cyan-400",
  },
  {
    id: "pink",
    gradient: "from-pink-700 via-rose-600 to-red-500",
    glow: "bg-pink-400/25",
    accentText: "text-pink-600 dark:text-pink-400",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    dotColor: "bg-pink-500",
    tagLabel: "Popular",
    ratingBg: "bg-pink-600",
    amenityIcon: "text-pink-500 dark:text-pink-400",
  },
  {
    id: "indigo",
    gradient: "from-indigo-700 via-blue-600 to-violet-500",
    glow: "bg-indigo-400/25",
    accentText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-50 dark:bg-indigo-950/40",
    softBorder: "border-indigo-100 dark:border-indigo-900/50",
    dotColor: "bg-indigo-500",
    tagLabel: "Luxury",
    ratingBg: "bg-indigo-600",
    amenityIcon: "text-indigo-500 dark:text-indigo-400",
  },
  {
    id: "teal",
    gradient: "from-teal-700 via-emerald-600 to-green-500",
    glow: "bg-teal-400/25",
    accentText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
    dotColor: "bg-teal-500",
    tagLabel: "Trending",
    ratingBg: "bg-teal-600",
    amenityIcon: "text-teal-500 dark:text-teal-400",
  },
  {
    id: "orange",
    gradient: "from-orange-700 via-amber-600 to-yellow-500",
    glow: "bg-orange-400/25",
    accentText: "text-orange-600 dark:text-orange-400",
    softBg: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
    dotColor: "bg-orange-500",
    tagLabel: "Express",
    ratingBg: "bg-orange-600",
    amenityIcon: "text-orange-500 dark:text-orange-400",
  },
  {
    id: "slate",
    gradient: "from-slate-800 via-slate-700 to-zinc-600",
    glow: "bg-slate-400/25",
    accentText: "text-slate-600 dark:text-slate-400",
    softBg: "bg-slate-100 dark:bg-slate-800/60",
    softBorder: "border-slate-200 dark:border-slate-700",
    dotColor: "bg-slate-500",
    tagLabel: "Classic",
    ratingBg: "bg-slate-700",
    amenityIcon: "text-slate-500 dark:text-slate-400",
  },
];

const getTheme = (index) => {
  return DETAIL_THEMES[
    (Number(index) || 0) % DETAIL_THEMES.length
  ];
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const getAmenityData = (amenity) => {
  const text = String(amenity).toLowerCase();

  if (text.includes("wifi"))
    return { icon: Wifi, label: amenity };

  if (text.includes("charg") || text.includes("plug"))
    return { icon: Plug, label: amenity };

  if (text.includes("ac") || text.includes("cool") || text.includes("snow"))
    return { icon: Snowflake, label: amenity };

  if (text.includes("cctv") || text.includes("camera"))
    return { icon: Camera, label: amenity };

  if (text.includes("water"))
    return { icon: Droplets, label: amenity };

  return { icon: CheckCircle2, label: amenity };
};

const defaultAmenities = [
  { icon: Wifi, label: "WiFi" },
  { icon: Plug, label: "Charging Point" },
  { icon: Snowflake, label: "AC" },
  { icon: Camera, label: "CCTV" },
];

const BusDetailsCard = ({ bus, index = 0 }) => {
  const theme = getTheme(index);

  const name =
    bus?.name ||
    bus?.busName ||
    bus?.operatorName ||
    "TedBus Partner";

  const type =
    bus?.type ||
    bus?.busType ||
    bus?.category ||
    "Standard Bus";

  const departure =
    bus?.departure ||
    bus?.departureTime ||
    bus?.startTime ||
    "—";

  const arrival =
    bus?.arrival ||
    bus?.arrivalTime ||
    bus?.endTime ||
    "—";

  const source =
    bus?.source || bus?.from || "Source";

  const destination =
    bus?.destination || bus?.to || "Destination";

  const duration = bus?.duration || "—";

  const rating =
    bus?.rating || bus?.averageRating || 4.2;

  const reviews =
    bus?.reviewsCount || bus?.totalReviews || 0;

  const price =
    bus?.price ||
    bus?.fare ||
    bus?.ticketPrice ||
    bus?.baseFare ||
    bus?.seatPrice ||
    0;

  const seatsLeft =
    bus?.seatsAvailable ??
    bus?.availableSeats ??
    bus?.totalAvailableSeats ??
    bus?.seats ??
    0;

  const rawAmenities = Array.isArray(bus?.amenities)
    ? bus.amenities
    : [];

  const amenities =
    rawAmenities.length > 0
      ? rawAmenities.map(getAmenityData)
      : defaultAmenities;

  const seatsNumber = Number(seatsLeft);
  const isLowSeats = seatsNumber > 0 && seatsNumber <= 5;
  const hasSeats = seatsNumber > 0;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 transition-all duration-500 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
      {/* Top gradient banner */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} p-5 text-white sm:p-6`}
      >
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full ${theme.glow} blur-3xl`}
        />

        <div className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:40px_40px] opacity-20" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          {/* Left info */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] backdrop-blur-xl">
                <Sparkles className="h-3 w-3" />
                {theme.tagLabel}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] backdrop-blur-xl">
                <ShieldCheck className="h-3 w-3" />
                TedBus Assured
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              {name}
            </h2>

            <p className="mt-1 text-sm font-bold text-white/80">
              {type}
            </p>
          </div>

          {/* Right info */}
          <div className="flex shrink-0 items-start gap-3 sm:flex-col sm:items-end">
            {/* Rating */}
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-sm font-black backdrop-blur-xl">
                <Star className="h-4 w-4 fill-white" />
                {Number(rating).toFixed(1)}
              </div>

              <span className="mt-1 text-[10px] font-bold text-white/60">
                {reviews > 0
                  ? `${reviews}+ reviews`
                  : "Verified"}
              </span>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-center backdrop-blur-xl">
              <p className="text-[9px] font-black uppercase tracking-wider text-white/60">
                Starting from
              </p>

              <p className="mt-0.5 text-2xl font-black sm:text-3xl">
                ₹{formatCurrency(price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket notch */}
      <div className="relative z-10">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />

        <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

        <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        {/* Route timeline */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 ${theme.softBorder} ${theme.softBg}`}
        >
          <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            <MapPin className={`h-3.5 w-3.5 ${theme.accentText}`} />
            Journey details
          </p>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                {departure}
              </h4>

              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                {source}
              </p>

              <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                Departure
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Clock3
                className={`h-4 w-4 ${theme.accentText}`}
              />

              <div className="relative my-2">
                <div className="h-px w-12 bg-slate-300 dark:bg-slate-600 sm:w-20" />

                <div
                  className={`absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${theme.dotColor}`}
                />
              </div>

              <p
                className={`text-xs font-black ${theme.accentText}`}
              >
                {duration}
              </p>

              <ArrowRight className="mt-1 h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            </div>

            <div className="text-right">
              <h4 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
                {arrival}
              </h4>

              <p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                {destination}
              </p>

              <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
                Arrival
              </p>
            </div>
          </div>
        </div>

        {/* Seats info */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-black ${
              isLowSeats
                ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
                : hasSeats
                  ? `${theme.softBorder} ${theme.softBg} ${theme.accentText}`
                  : "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-400"
            }`}
          >
            <Armchair className="h-4 w-4" />

            {hasSeats
              ? isLowSeats
                ? `Only ${seatsLeft} seats left!`
                : `${seatsLeft} seats available`
              : "Updating availability"}
          </div>

          {hasSeats && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <Zap className="h-3.5 w-3.5" />
              Live seat selection
            </span>
          )}
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-black text-slate-800 dark:text-slate-200">
            <CheckCircle2
              className={`h-4 w-4 ${theme.accentText}`}
            />
            Amenities & facilities
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {amenities.slice(0, 8).map((item, amenityIndex) => {
              const AmenityIcon = item.icon;

              return (
                <div
                  key={`${item.label}-${amenityIndex}`}
                  className={`flex items-center gap-2.5 rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${theme.softBorder} bg-white dark:bg-slate-900`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${theme.softBg}`}
                  >
                    <AmenityIcon
                      className={`h-4 w-4 ${theme.amenityIcon}`}
                    />
                  </div>

                  <span className="truncate text-xs font-bold text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              TedBus verified partner
            </span>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              Trusted by travellers
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider">
            <span
              className={`h-1.5 w-1.5 rounded-full ${theme.dotColor}`}
            />

            <span className={theme.accentText}>
              {theme.tagLabel}
            </span>
          </span>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className={`pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${theme.gradient} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]`}
      />
    </div>
  );
};

export default BusDetailsCard;