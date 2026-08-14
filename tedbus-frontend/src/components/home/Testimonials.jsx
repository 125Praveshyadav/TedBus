import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  MessageSquareQuote,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rakshit Sharma",
    role: "Business Traveller",
    location: "Meerut",
    initial: "R",
    rating: 5,
    review:
      "TedBus made my monthly Delhi-Jaipur commute so effortless. Booking is lightning fast, seats are always confirmed, and I never worry about last-minute cancellations anymore.",
    highlight: "Lightning fast booking",
    travelCount: "40+ trips",
    gradient: "from-red-600 to-orange-500",
    glow: "bg-red-400/25",
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    quoteColor: "text-red-100 dark:text-red-900/30",
  },
  {
    id: 2,
    name: "Saumya Singh",
    role: "Student",
    location: "Lucknow",
    initial: "S",
    rating: 5,
    review:
      "As a student on a budget, TedBus always shows the most affordable options. The seat selection feature is super smooth and I love the instant e-ticket confirmation.",
    highlight: "Budget-friendly options",
    travelCount: "25+ trips",
    gradient: "from-violet-600 to-purple-500",
    glow: "bg-violet-400/25",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    quoteColor: "text-violet-100 dark:text-violet-900/30",
  },
  {
    id: 3,
    name: "Pravesh Yadav",
    role: "Freelancer",
    location: "Pune",
    initial: "P",
    rating: 5,
    review:
      "Best bus booking platform I have ever used. The customer support team helped me reschedule my trip at midnight. They genuinely care about their travellers.",
    highlight: "Outstanding support",
    travelCount: "30+ trips",
    gradient: "from-emerald-600 to-teal-500",
    glow: "bg-emerald-400/25",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    quoteColor: "text-emerald-100 dark:text-emerald-900/30",
  },
  {
    id: 4,
    name: "Vijay Patel",
    role: "Marketing Manager",
    location: "Ahmedabad",
    initial: "V",
    rating: 5,
    review:
      "I travel Ahmedabad to Surat every week and TedBus has never disappointed me. The app is clean, payments are secure, and buses always depart on time.",
    highlight: "Always on time",
    travelCount: "50+ trips",
    gradient: "from-cyan-600 to-blue-500",
    glow: "bg-cyan-400/25",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    quoteColor: "text-cyan-100 dark:text-cyan-900/30",
  },
  {
    id: 5,
    name: "Rocky Bhai",
    role: "Software Engineer",
    location: "Bangalore",
    initial: "R",
    rating: 5,
    review:
      "From Bangalore to Hyderabad overnight — I just book on TedBus, sleep comfortably, and arrive fresh. The seat layout view helps me pick the perfect window seat every time.",
    highlight: "Perfect seat selection",
    travelCount: "35+ trips",
    gradient: "from-amber-600 to-yellow-500",
    glow: "bg-amber-400/25",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    quoteColor: "text-amber-100 dark:text-amber-900/30",
  },
  {
    id: 6,
    name: "Sanjana Yadav",
    role: "Travel Blogger",
    location: "Mumbai",
    initial: "S",
    rating: 5,
    review:
      "I have tried many bus apps, but TedBus is on another level. The UI is beautiful, filters are helpful, and I found coupon codes that saved me hundreds on my Goa trip.",
    highlight: "Great savings with coupons",
    travelCount: "20+ trips",
    gradient: "from-pink-600 to-rose-500",
    glow: "bg-pink-400/25",
    accentText: "text-pink-600 dark:text-pink-400",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    quoteColor: "text-pink-100 dark:text-pink-900/30",
  },
  {
    id: 7,
    name: "Karan Joshi",
    role: "Chartered Accountant",
    location: "Jaipur",
    initial: "K",
    rating: 5,
    review:
      "What I love about TedBus is transparency. No hidden charges, clear cancellation policies and the fare breakup is shown before payment. Truly trustworthy platform.",
    highlight: "Complete transparency",
    travelCount: "28+ trips",
    gradient: "from-indigo-600 to-blue-500",
    glow: "bg-indigo-400/25",
    accentText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-50 dark:bg-indigo-950/40",
    softBorder: "border-indigo-100 dark:border-indigo-900/50",
    quoteColor: "text-indigo-100 dark:text-indigo-900/30",
  },
  {
    id: 8,
    name: "Akshit Yadav",
    role: "Doctor",
    location: "Chennai",
    initial: "A",
    rating: 5,
    review:
      "After a long hospital shift, I need a stress-free way to book my travel. TedBus lets me book in under a minute. The confirmed ticket arrives instantly — no calls, no waiting.",
    highlight: "Book in under a minute",
    travelCount: "18+ trips",
    gradient: "from-teal-600 to-green-500",
    glow: "bg-teal-400/25",
    accentText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
    quoteColor: "text-teal-100 dark:text-teal-900/30",
  },
];

const Testimonials = () => {
  const scrollContainerRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const maximumScroll =
      container.scrollWidth - container.clientWidth;

    setCanScrollLeft(container.scrollLeft > 5);
    setCanScrollRight(container.scrollLeft < maximumScroll - 5);

    const firstCard = container.querySelector(
      "[data-testimonial-card]",
    );

    if (!firstCard) {
      setCurrentIndex(0);
      return;
    }

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap) || 16;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const scrollStep = cardWidth + gap;

    const newIndex = Math.round(
      container.scrollLeft / scrollStep,
    );

    setCurrentIndex(
      Math.max(
        0,
        Math.min(newIndex, testimonials.length - 1),
      ),
    );
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return undefined;

    const frame =
      window.requestAnimationFrame(updateScrollState);

    container.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true },
    );

    window.addEventListener("resize", updateScrollState);

    let resizeObserver;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener(
        "scroll",
        updateScrollState,
      );
      window.removeEventListener(
        "resize",
        updateScrollState,
      );
      resizeObserver?.disconnect();
    };
  }, [updateScrollState]);

  const getScrollStep = () => {
    const container = scrollContainerRef.current;

    if (!container) return 0;

    const firstCard = container.querySelector(
      "[data-testimonial-card]",
    );

    if (!firstCard) return 0;

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap) || 16;

    return firstCard.getBoundingClientRect().width + gap;
  };

  const scrollCards = (direction) => {
    const container = scrollContainerRef.current;
    const step = getScrollStep();

    if (!container || !step) return;

    container.scrollBy({
      left: direction * step,
      behavior: "smooth",
    });
  };

  const scrollToCard = (index) => {
    const container = scrollContainerRef.current;
    const step = getScrollStep();

    if (!container || !step) return;

    container.scrollTo({
      left: index * step,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/70 via-slate-50 to-orange-50/60 dark:from-red-950/10 dark:via-slate-950 dark:to-orange-950/10" />

      <div className="pointer-events-none absolute -left-32 top-16 h-96 w-96 rounded-full bg-red-300/20 blur-3xl dark:bg-red-600/10" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] [background-size:30px_30px] dark:bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-9 flex flex-col gap-6 sm:mb-11 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400 sm:text-xs">
              <Users className="h-4 w-4" />
              Trusted by 10,000+ travellers
            </div>

            <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              Real stories from
              <span className="ml-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                happy travellers
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
              Thousands of travellers share their experience of booking
              comfortable, reliable and affordable bus journeys with TedBus.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 sm:justify-start">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950/40">
                <Star className="h-4 w-4 fill-current" />
              </div>

              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  4.8
                </p>

                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Average rating
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCards(-1)}
                disabled={!canScrollLeft}
                aria-label="Show previous review"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => scrollCards(1)}
                disabled={!canScrollRight}
                aria-label="Show next review"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scrolling cards */}
        <div
          ref={scrollContainerRef}
          role="region"
          aria-label="Traveller reviews"
          tabIndex={0}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-7 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:px-1"
        >
          {testimonials.map((item, index) => (
            <article
              key={item.id}
              data-testimonial-card
              className="group relative flex w-[calc(100vw-2.5rem)] max-w-[340px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:w-[330px]"
            >
              {/* Top gradient strip */}
              <div
                className={`relative overflow-hidden bg-gradient-to-r ${item.gradient} px-5 pb-5 pt-5`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${item.glow} blur-2xl`}
                />

                <div className="relative flex items-start justify-between gap-3">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map(
                      (_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-white text-white"
                        />
                      ),
                    )}
                  </div>

                  {/* Quote */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl">
                    <MessageSquareQuote className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="relative mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white/90 backdrop-blur-xl">
                    <Sparkles className="h-3 w-3" />
                    {item.highlight}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                {/* Quote icon */}
                <div className="relative">
                  <Quote
                    className={`absolute -left-1 -top-2 h-8 w-8 ${item.quoteColor}`}
                  />

                  <p className="relative min-h-[80px] pl-1 text-[13px] font-medium italic leading-6 text-slate-600 dark:text-slate-400">
                    &ldquo;{item.review}&rdquo;
                  </p>
                </div>

                {/* Travel count tag */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${item.softBg} ${item.softBorder} ${item.accentText}`}
                  >
                    {item.travelCount}
                  </span>

                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                    {item.location}
                  </span>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-slate-100 dark:border-slate-800" />

                {/* Author */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-base font-black text-white shadow-lg transition-transform duration-500 group-hover:scale-110`}
                    >
                      {item.initial}
                    </div>

                    <div className="min-w-0">
                      <h4 className="flex items-center gap-1.5 truncate text-sm font-black text-slate-900 dark:text-white">
                        {item.name}

                        <BadgeCheck
                          className={`h-4 w-4 shrink-0 ${item.accentText}`}
                        />
                      </h4>

                      <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="mt-2 flex flex-col items-center justify-center gap-3">
          <div className="flex max-w-full items-center gap-1.5 overflow-hidden">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToCard(index)}
                aria-label={`Show review from ${item.name}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-7 bg-gradient-to-r from-red-600 to-orange-500"
                    : "w-2 bg-slate-300 hover:bg-red-300 dark:bg-slate-700 dark:hover:bg-red-800"
                }`}
              />
            ))}
          </div>

          <p className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:hidden">
            <ArrowLeft className="h-3.5 w-3.5" />
            Swipe to read more reviews
            <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>

        {/* Bottom trust banner */}
        <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-slate-950 px-5 py-5 text-white shadow-xl dark:border dark:border-slate-800 sm:px-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-amber-400 backdrop-blur">
                <Star className="h-5 w-5 fill-current" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                  Traveller verified
                </p>

                <h3 className="mt-1 text-base font-black sm:text-lg">
                  Every review comes from a real TedBus traveller.
                </h3>

                <p className="mt-1 max-w-lg text-xs font-medium leading-5 text-slate-400">
                  We only display reviews from verified bookings to ensure
                  complete trust and transparency.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                <div>
                  <p className="text-xs font-black">Verified</p>

                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                    All reviews
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur">
                <Users className="h-4 w-4 text-cyan-400" />

                <div>
                  <p className="text-xs font-black">10K+</p>

                  <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500">
                    Travellers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;