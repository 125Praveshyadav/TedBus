import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  BusFront,
  Clock3,
  Coffee,
  Compass,
  MapPin,
  Mountain,
  MoonStar,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  SunMedium,
  Ticket,
  TrendingUp,
  Users,
  Waves,
} from "lucide-react";

const popularRoutes = [
  {
    id: 1,
    from: "Delhi",
    fromCode: "DEL",
    to: "Jaipur",
    toCode: "JAI",
    price: 499,
    duration: "4h 30m",
    popularity: "Very Popular",
    badge: "Weekend Favourite",
    tripType: "Royal Weekend Escape",
    bestFor: "Friends & Families",
    story:
      "Leave Delhi’s rush behind and enter Jaipur’s royal world of forts, colourful bazaars and unforgettable food.",
    highlights: ["Royal forts", "Food trails", "Quick escape"],
    icon: SunMedium,
    gradient: "from-red-700 via-red-600 to-orange-500",
    glow: "bg-orange-300/30",
    accentText: "text-red-600 dark:text-red-400",
    softBackground: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
  },
  {
    id: 2,
    from: "Chennai",
    fromCode: "MAA",
    to: "Bangalore",
    toCode: "BLR",
    price: 549,
    duration: "6h 20m",
    popularity: "Trending",
    badge: "City Connector",
    tripType: "Two-City Experience",
    bestFor: "Professionals",
    story:
      "From Chennai’s coastal energy to Bangalore’s cool urban vibe, this route keeps two iconic cities closely connected.",
    highlights: ["Business trips", "Night options", "City life"],
    icon: Briefcase,
    gradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    glow: "bg-fuchsia-300/30",
    accentText: "text-violet-600 dark:text-violet-400",
    softBackground: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
  },
  {
    id: 3,
    from: "Kolkata",
    fromCode: "CCU",
    to: "Patna",
    toCode: "PAT",
    price: 449,
    duration: "9h 10m",
    popularity: "Traveller Pick",
    badge: "Overnight Favourite",
    tripType: "Sleep, Travel, Arrive",
    bestFor: "Sleeper Travellers",
    story:
      "Board at night, relax through eastern India and wake up ready to explore Patna’s history and culture.",
    highlights: ["Overnight ride", "Sleeper comfort", "Time saver"],
    icon: MoonStar,
    gradient: "from-slate-950 via-indigo-900 to-blue-700",
    glow: "bg-blue-400/30",
    accentText: "text-blue-600 dark:text-blue-400",
    softBackground: "bg-blue-50 dark:bg-blue-950/40",
    softBorder: "border-blue-100 dark:border-blue-900/50",
  },
  {
    id: 4,
    from: "Ahmedabad",
    fromCode: "AMD",
    to: "Surat",
    toCode: "STV",
    price: 249,
    duration: "4h 00m",
    popularity: "High Demand",
    badge: "Smart Budget Ride",
    tripType: "Quick City Journey",
    bestFor: "Business Travellers",
    story:
      "A practical and budget-friendly connection between two energetic cities, perfect for work and same-day plans.",
    highlights: ["Budget ride", "Quick travel", "Same-day trip"],
    icon: TrendingUp,
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    glow: "bg-cyan-300/30",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBackground: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
  },
  {
    id: 5,
    from: "Mumbai",
    fromCode: "BOM",
    to: "Pune",
    toCode: "PNQ",
    price: 399,
    duration: "3h 30m",
    popularity: "Always Busy",
    badge: "Monsoon Favourite",
    tripType: "Scenic Express Ride",
    bestFor: "Weekend Travellers",
    story:
      "A short highway escape with beautiful ghats, refreshing views and the perfect excuse for a quick weekend break.",
    highlights: ["Scenic ghats", "Short journey", "Weekend mood"],
    icon: Coffee,
    gradient: "from-cyan-800 via-sky-700 to-blue-500",
    glow: "bg-cyan-300/30",
    accentText: "text-sky-600 dark:text-sky-400",
    softBackground: "bg-sky-50 dark:bg-sky-950/40",
    softBorder: "border-sky-100 dark:border-sky-900/50",
  },
  {
    id: 6,
    from: "Delhi",
    fromCode: "DEL",
    to: "Manali",
    toCode: "MNL",
    price: 899,
    duration: "12h 30m",
    popularity: "Adventure Pick",
    badge: "Mountain Escape",
    tripType: "Journey Into The Hills",
    bestFor: "Adventure Lovers",
    story:
      "Watch city lights disappear as the road climbs towards cool mountain air, valleys and unforgettable Manali mornings.",
    highlights: ["Mountain views", "Night journey", "Adventure"],
    icon: Mountain,
    gradient: "from-slate-800 via-teal-800 to-emerald-600",
    glow: "bg-emerald-300/30",
    accentText: "text-teal-600 dark:text-teal-400",
    softBackground: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
  },
  {
    id: 7,
    from: "Hyderabad",
    fromCode: "HYD",
    to: "Vijayawada",
    toCode: "VGA",
    price: 499,
    duration: "5h 30m",
    popularity: "Comfort Pick",
    badge: "Popular Corridor",
    tripType: "Smooth Highway Travel",
    bestFor: "Regular Travellers",
    story:
      "A smooth and dependable route loved by students, professionals and families travelling between two vibrant cities.",
    highlights: ["Smooth highway", "Frequent rides", "Comfort"],
    icon: BusFront,
    gradient: "from-orange-700 via-amber-600 to-yellow-500",
    glow: "bg-yellow-300/30",
    accentText: "text-orange-600 dark:text-orange-400",
    softBackground: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
  },
  {
    id: 8,
    from: "Bangalore",
    fromCode: "BLR",
    to: "Goa",
    toCode: "GOI",
    price: 799,
    duration: "10h 30m",
    popularity: "Holiday Pick",
    badge: "Beach Break",
    tripType: "Wake Up Near The Sea",
    bestFor: "Friends & Couples",
    story:
      "Leave Bangalore at night and wake up closer to beaches, cafés, sea breeze and the relaxed rhythm of Goa.",
    highlights: ["Beach escape", "Night ride", "Holiday vibe"],
    icon: Waves,
    gradient: "from-blue-800 via-cyan-700 to-teal-500",
    glow: "bg-cyan-300/30",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBackground: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
  },
];

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const PopularRoutes = () => {
  const scrollContainerRef = useRef(null);

  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(container.scrollLeft < maximumScroll - 5);

    const firstCard = container.querySelector("[data-route-card]");

    if (!firstCard) {
      setCurrentRouteIndex(0);
      return;
    }

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap) || 16;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const scrollStep = cardWidth + gap;

    const newIndex = Math.round(container.scrollLeft / scrollStep);

    setCurrentRouteIndex(
      Math.max(0, Math.min(newIndex, popularRoutes.length - 1)),
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return undefined;

    const animationFrame = window.requestAnimationFrame(updateScrollState);

    container.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollState);

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);

      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);

      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const getScrollStep = () => {
    const container = scrollContainerRef.current;

    if (!container) return 0;

    const firstCard = container.querySelector("[data-route-card]");

    if (!firstCard) return 0;

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap) || 16;
    const cardWidth = firstCard.getBoundingClientRect().width;

    return cardWidth + gap;
  };

  const scrollRoutes = (direction) => {
    const container = scrollContainerRef.current;
    const scrollStep = getScrollStep();

    if (!container || !scrollStep) return;

    container.scrollBy({
      left: direction * scrollStep,
      behavior: "smooth",
    });
  };

  const scrollToRoute = (index) => {
    const container = scrollContainerRef.current;
    const scrollStep = getScrollStep();

    if (!container || !scrollStep) return;

    container.scrollTo({
      left: index * scrollStep,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative isolate overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/70 via-white to-orange-50/60 dark:from-red-950/10 dark:via-slate-950 dark:to-orange-950/10" />

      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-red-300/20 blur-3xl dark:bg-red-600/10" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] [background-size:30px_30px] dark:bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-11 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400">
              <TrendingUp className="h-4 w-4" />
              Most loved journeys
            </div>

            <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              Popular routes with
              <span className="ml-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                unforgettable stories
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Discover journeys loved for mountain escapes, beach breaks,
              overnight comfort, business travel and memorable highway views.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <Route className="h-4 w-4" />
              </div>

              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  {popularRoutes.length}
                </p>

                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Popular routes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRoutes(-1)}
                disabled={!canScrollLeft}
                aria-label="Show previous popular route"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollRoutes(1)}
                disabled={!canScrollRight}
                aria-label="Show next popular route"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal route cards */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Popular TedBus routes"
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-7 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:px-1"
        >
          {popularRoutes.map((route, index) => {
            const RouteIcon = route.icon;

            return (
              <article
                key={route.id}
                data-route-card
                className="group relative flex w-[calc(100vw-2.5rem)] max-w-[330px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-2xl hover:shadow-red-500/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-red-900/60 sm:w-[320px]"
              >
                {/* Card top */}
                <div
                  className={`relative overflow-hidden bg-gradient-to-br ${route.gradient} p-4 text-white`}
                >
                  <div
                    className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full ${route.glow} blur-3xl`}
                  />

                  <div className="pointer-events-none absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.07)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.07)_50%,rgba(255,255,255,0.07)_75%,transparent_75%,transparent)] [background-size:38px_38px] opacity-20" />

                  {/* Badge */}
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] backdrop-blur-xl">
                      <Sparkles className="h-3 w-3" />
                      {route.badge}
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[10px] font-black backdrop-blur-xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
                        {route.fromCode}
                      </p>

                      <h3 className="mt-1 truncate text-xl font-black tracking-tight">
                        {route.from}
                      </h3>
                    </div>

                    <div className="flex items-center">
                      <span className="w-4 border-t border-dashed border-white/40" />

                      <span className="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white text-slate-900 shadow-lg transition-transform duration-500 group-hover:translate-x-1">
                        <BusFront className="h-4 w-4" />
                      </span>

                      <span className="w-4 border-t border-dashed border-white/40" />

                      <ArrowRight className="-ml-1 h-3 w-3 text-white/50" />
                    </div>

                    <div className="min-w-0 text-right">
                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/60">
                        {route.toCode}
                      </p>

                      <h3 className="mt-1 truncate text-xl font-black tracking-tight">
                        {route.to}
                      </h3>
                    </div>
                  </div>

                  {/* Journey information */}
                  <div className="relative mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-black/10 backdrop-blur-xl">
                    <div className="p-2.5 text-center">
                      <Clock3 className="mx-auto h-3.5 w-3.5 text-white/70" />

                      <p className="mt-1 text-xs font-black">
                        {route.duration}
                      </p>

                      <p className="text-[7px] font-black uppercase tracking-wider text-white/50">
                        Duration
                      </p>
                    </div>

                    <div className="border-x border-white/10 p-2.5 text-center">
                      <Ticket className="mx-auto h-3.5 w-3.5 text-white/70" />

                      <p className="mt-1 text-xs font-black">
                        ₹{formatCurrency(route.price)}
                      </p>

                      <p className="text-[7px] font-black uppercase tracking-wider text-white/50">
                        Starting
                      </p>
                    </div>

                    <div className="p-2.5 text-center">
                      <TrendingUp className="mx-auto h-3.5 w-3.5 text-white/70" />

                      <p className="mt-1 truncate text-xs font-black">
                        {route.popularity}
                      </p>

                      <p className="text-[7px] font-black uppercase tracking-wider text-white/50">
                        Demand
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ticket cut */}
                <div className="relative z-10">
                  <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />

                  <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Route personality */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${route.softBackground} ${route.softBorder} ${route.accentText}`}
                    >
                      <RouteIcon className="h-4.5 w-4.5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Route personality
                      </p>

                      <h4 className="mt-0.5 truncate text-sm font-black text-slate-900 dark:text-white">
                        {route.tripType}
                      </h4>
                    </div>
                  </div>

                  {/* Story */}
                  <p className="mt-3 min-h-[60px] text-xs font-medium leading-5 text-slate-600 dark:text-slate-400">
                    {route.story}
                  </p>

                  {/* Highlights */}
                  <div className="mt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <Compass className={`h-3.5 w-3.5 ${route.accentText}`} />
                      Journey highlights
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {route.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className={`rounded-lg border px-2 py-1 text-[8px] font-black ${route.softBackground} ${route.softBorder} ${route.accentText}`}
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Best for */}
                  <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                    <div className="flex min-w-0 items-center gap-2">
                      <Users
                        className={`h-4 w-4 shrink-0 ${route.accentText}`}
                      />

                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                          Best for
                        </p>

                        <p className="truncate text-[11px] font-black text-slate-800 dark:text-slate-200">
                          {route.bestFor}
                        </p>
                      </div>
                    </div>

                    <Star
                      className={`h-4 w-4 shrink-0 fill-current ${route.accentText}`}
                    />
                  </div>

                  {/* Trust */}
                  <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="inline-flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      TedBus traveller pick
                    </span>

                    <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-wider text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      Popular
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Scroll indicators */}
        <div className="mt-2 flex flex-col items-center justify-center gap-3">
          <div className="flex max-w-full items-center gap-1.5 overflow-hidden">
            {popularRoutes.map((route, index) => (
              <button
                key={route.id}
                type="button"
                onClick={() => scrollToRoute(index)}
                aria-label={`Show ${route.from} to ${route.to} route`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentRouteIndex === index
                    ? "w-7 bg-gradient-to-r from-red-600 to-orange-500"
                    : "w-2 bg-slate-300 hover:bg-red-300 dark:bg-slate-700 dark:hover:bg-red-800"
                }`}
              />
            ))}
          </div>

          <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:hidden">
            <ArrowLeft className="h-3.5 w-3.5" />
            Swipe to explore popular routes
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>

        {/* Bottom quote */}
        <div className="relative mt-8 overflow-hidden rounded-3xl bg-slate-950 px-5 py-5 text-white shadow-xl dark:border dark:border-slate-800 sm:px-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-500/25 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-orange-400">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                Every route has a story
              </p>

              <h3 className="mt-1 text-base font-black sm:text-lg">
                A window seat, your favourite playlist and the open road.
              </h3>

              <p className="mt-1 text-xs font-medium leading-5 text-slate-400">
                Sometimes the journey becomes the most memorable part of the
                trip.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;