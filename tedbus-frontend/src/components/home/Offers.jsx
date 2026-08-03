import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Gift,
  Loader2,
  ShieldCheck,
  Sparkles,
  TicketPercent,
} from "lucide-react";

import couponService from "../../services/couponService";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

/*
 * 10 unique premium color themes.
 * Cards cycle through these using (index % OFFER_THEMES.length).
 */
const OFFER_THEMES = [
  {
    id: "crimson",
    gradient: "from-red-700 via-red-600 to-orange-500",
    glow: "bg-red-400/25",
    accentText: "text-red-600 dark:text-red-400",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    hoverBorder:
      "hover:border-red-200 dark:hover:border-red-900/60",
    hoverShadow: "hover:shadow-red-500/10",
    dotColor: "bg-red-500",
    copyBg: "bg-white text-red-700 hover:bg-red-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Hot Deal",
    countdownActive:
      "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-red-600 dark:text-red-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-red-100 bg-white dark:border-red-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "violet",
    gradient: "from-violet-700 via-purple-600 to-fuchsia-500",
    glow: "bg-violet-400/25",
    accentText: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    hoverBorder:
      "hover:border-violet-200 dark:hover:border-violet-900/60",
    hoverShadow: "hover:shadow-violet-500/10",
    dotColor: "bg-violet-500",
    copyBg:
      "bg-white text-violet-700 hover:bg-violet-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Exclusive",
    countdownActive:
      "border-violet-100 bg-violet-50/60 dark:border-violet-900/40 dark:bg-violet-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-violet-600 dark:text-violet-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-violet-100 bg-white dark:border-violet-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "emerald",
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    glow: "bg-emerald-400/25",
    accentText: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    hoverBorder:
      "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    hoverShadow: "hover:shadow-emerald-500/10",
    dotColor: "bg-emerald-500",
    copyBg:
      "bg-white text-emerald-700 hover:bg-emerald-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Super Saver",
    countdownActive:
      "border-emerald-100 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-emerald-600 dark:text-emerald-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-emerald-100 bg-white dark:border-emerald-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "amber",
    gradient: "from-amber-700 via-orange-600 to-yellow-500",
    glow: "bg-amber-400/25",
    accentText: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    hoverBorder:
      "hover:border-amber-200 dark:hover:border-amber-900/60",
    hoverShadow: "hover:shadow-amber-500/10",
    dotColor: "bg-amber-500",
    copyBg:
      "bg-white text-amber-700 hover:bg-amber-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Flash Sale",
    countdownActive:
      "border-amber-100 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20",
    countdownUrgent:
      "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/25",
    countdownText: "text-amber-600 dark:text-amber-400",
    countdownUrgentText: "text-red-700 dark:text-red-400",
    unitBorder:
      "border-amber-100 bg-white dark:border-amber-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-red-100 bg-white dark:border-red-900/40 dark:bg-slate-900",
  },
  {
    id: "cyan",
    gradient: "from-cyan-700 via-sky-600 to-blue-500",
    glow: "bg-cyan-400/25",
    accentText: "text-cyan-600 dark:text-cyan-400",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    hoverBorder:
      "hover:border-cyan-200 dark:hover:border-cyan-900/60",
    hoverShadow: "hover:shadow-cyan-500/10",
    dotColor: "bg-cyan-500",
    copyBg:
      "bg-white text-cyan-700 hover:bg-cyan-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Limited Time",
    countdownActive:
      "border-cyan-100 bg-cyan-50/60 dark:border-cyan-900/40 dark:bg-cyan-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-cyan-600 dark:text-cyan-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-cyan-100 bg-white dark:border-cyan-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "pink",
    gradient: "from-pink-700 via-rose-600 to-red-500",
    glow: "bg-pink-400/25",
    accentText: "text-pink-600 dark:text-pink-400",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    hoverBorder:
      "hover:border-pink-200 dark:hover:border-pink-900/60",
    hoverShadow: "hover:shadow-pink-500/10",
    dotColor: "bg-pink-500",
    copyBg:
      "bg-white text-pink-700 hover:bg-pink-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Special",
    countdownActive:
      "border-pink-100 bg-pink-50/60 dark:border-pink-900/40 dark:bg-pink-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-pink-600 dark:text-pink-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-pink-100 bg-white dark:border-pink-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "indigo",
    gradient: "from-indigo-700 via-blue-600 to-violet-500",
    glow: "bg-indigo-400/25",
    accentText: "text-indigo-600 dark:text-indigo-400",
    softBg: "bg-indigo-50 dark:bg-indigo-950/40",
    softBorder: "border-indigo-100 dark:border-indigo-900/50",
    hoverBorder:
      "hover:border-indigo-200 dark:hover:border-indigo-900/60",
    hoverShadow: "hover:shadow-indigo-500/10",
    dotColor: "bg-indigo-500",
    copyBg:
      "bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Premium",
    countdownActive:
      "border-indigo-100 bg-indigo-50/60 dark:border-indigo-900/40 dark:bg-indigo-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-indigo-600 dark:text-indigo-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-indigo-100 bg-white dark:border-indigo-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "teal",
    gradient: "from-teal-700 via-emerald-600 to-green-500",
    glow: "bg-teal-400/25",
    accentText: "text-teal-600 dark:text-teal-400",
    softBg: "bg-teal-50 dark:bg-teal-950/40",
    softBorder: "border-teal-100 dark:border-teal-900/50",
    hoverBorder:
      "hover:border-teal-200 dark:hover:border-teal-900/60",
    hoverShadow: "hover:shadow-teal-500/10",
    dotColor: "bg-teal-500",
    copyBg:
      "bg-white text-teal-700 hover:bg-teal-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Trending",
    countdownActive:
      "border-teal-100 bg-teal-50/60 dark:border-teal-900/40 dark:bg-teal-950/20",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-teal-600 dark:text-teal-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-teal-100 bg-white dark:border-teal-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
  {
    id: "orange",
    gradient: "from-orange-700 via-amber-600 to-yellow-500",
    glow: "bg-orange-400/25",
    accentText: "text-orange-600 dark:text-orange-400",
    softBg: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
    hoverBorder:
      "hover:border-orange-200 dark:hover:border-orange-900/60",
    hoverShadow: "hover:shadow-orange-500/10",
    dotColor: "bg-orange-500",
    copyBg:
      "bg-white text-orange-700 hover:bg-orange-600 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Popular",
    countdownActive:
      "border-orange-100 bg-orange-50/60 dark:border-orange-900/40 dark:bg-orange-950/20",
    countdownUrgent:
      "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/25",
    countdownText: "text-orange-600 dark:text-orange-400",
    countdownUrgentText: "text-red-700 dark:text-red-400",
    unitBorder:
      "border-orange-100 bg-white dark:border-orange-900/30 dark:bg-slate-900",
    unitUrgentBorder:
      "border-red-100 bg-white dark:border-red-900/40 dark:bg-slate-900",
  },
  {
    id: "slate",
    gradient: "from-slate-800 via-slate-700 to-zinc-600",
    glow: "bg-slate-400/25",
    accentText: "text-slate-600 dark:text-slate-400",
    softBg: "bg-slate-100 dark:bg-slate-800/60",
    softBorder: "border-slate-200 dark:border-slate-700",
    hoverBorder:
      "hover:border-slate-300 dark:hover:border-slate-600",
    hoverShadow: "hover:shadow-slate-500/10",
    dotColor: "bg-slate-500",
    copyBg:
      "bg-white text-slate-700 hover:bg-slate-700 hover:text-white",
    copiedBg: "bg-emerald-500 text-white",
    tagLabel: "Classic",
    countdownActive:
      "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60",
    countdownUrgent:
      "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/25",
    countdownText: "text-slate-600 dark:text-slate-400",
    countdownUrgentText: "text-amber-700 dark:text-amber-400",
    unitBorder:
      "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900",
    unitUrgentBorder:
      "border-amber-100 bg-white dark:border-amber-900/40 dark:bg-slate-900",
  },
];

const getTheme = (index) => {
  return OFFER_THEMES[index % OFFER_THEMES.length];
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const getExpiryTimestamp = (expiryDate) => {
  if (!expiryDate) return null;

  if (
    typeof expiryDate === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(expiryDate)
  ) {
    const [year, month, day] = expiryDate
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999,
    ).getTime();
  }

  const timestamp = new Date(expiryDate).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getOfferExpiryDate = (offer) => {
  return (
    offer?.expiryDate ||
    offer?.expiresAt ||
    offer?.validTill ||
    offer?.endDate ||
    null
  );
};

const formatExpiryDate = (expiryDate) => {
  const ts = getExpiryTimestamp(expiryDate);
  if (!ts) return "No fixed expiry";

  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getCountdownData = (expiryDate, currentTime) => {
  const ts = getExpiryTimestamp(expiryDate);

  if (!ts) {
    return {
      status: "no-expiry",
      isExpired: false,
      isUrgent: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const diff = ts - currentTime;

  if (diff <= 0) {
    return {
      status: "expired",
      isExpired: true,
      isUrgent: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSec = Math.floor(diff / 1000);

  return {
    status: "active",
    isExpired: false,
    isUrgent: diff <= DAY_IN_MILLISECONDS,
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
};

const normalizeDiscountType = (type) => {
  return String(type || "")
    .trim()
    .toLowerCase();
};

const getDiscountText = (offer) => {
  const type = normalizeDiscountType(offer?.discountType);

  if (type === "percentage")
    return `${formatCurrency(offer?.discountValue)}% OFF`;

  if (type === "flat" || type === "fixed")
    return `₹${formatCurrency(offer?.discountValue)} OFF`;

  return "Special Offer";
};

const getCouponTitle = (offer) => {
  if (offer?.title) return offer.title;

  const type = normalizeDiscountType(offer?.discountType);

  if (type === "percentage")
    return `Save ${formatCurrency(offer?.discountValue)}% on your next TedBus booking`;

  if (type === "flat" || type === "fixed")
    return `Get flat ₹${formatCurrency(offer?.discountValue)} off on your booking`;

  return "Save more on your next journey";
};

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText =
    "position:fixed;left:-9999px;opacity:0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("Copy failed");
};

const ExpiryCountdown = ({
  expiryDate,
  currentTime,
  theme,
}) => {
  const countdown = getCountdownData(
    expiryDate,
    currentTime,
  );

  if (countdown.status === "no-expiry") {
    return (
      <div
        className={`rounded-2xl border p-3.5 ${theme.softBorder} ${theme.softBg}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.softBg} ${theme.accentText}`}
          >
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <p
              className={`text-[10px] font-black uppercase tracking-wider ${theme.accentText}`}
            >
              Offer validity
            </p>

            <p className="mt-0.5 text-sm font-black text-slate-800 dark:text-slate-200">
              Available for a limited period
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (countdown.isExpired) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 dark:border-red-900/50 dark:bg-red-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-red-500">
              Offer status
            </p>

            <p className="mt-0.5 text-sm font-black text-red-700 dark:text-red-300">
              This coupon has expired
            </p>
          </div>
        </div>
      </div>
    );
  }

  const units = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Mins", value: countdown.minutes },
    { label: "Secs", value: countdown.seconds },
  ];

  return (
    <div
      className={`rounded-2xl border p-3.5 transition-colors ${
        countdown.isUrgent
          ? theme.countdownUrgent
          : theme.countdownActive
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock3
            className={`h-4 w-4 ${
              countdown.isUrgent
                ? theme.countdownUrgentText
                : theme.countdownText
            }`}
          />

          <p
            className={`text-[10px] font-black uppercase tracking-[0.15em] ${
              countdown.isUrgent
                ? theme.countdownUrgentText
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {countdown.isUrgent
              ? "Ending soon"
              : "Offer ends in"}
          </p>
        </div>

        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
          {formatExpiryDate(expiryDate)}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {units.map((u) => (
          <div
            key={u.label}
            className={`rounded-xl border px-1 py-2 text-center shadow-sm ${
              countdown.isUrgent
                ? theme.unitUrgentBorder
                : theme.unitBorder
            }`}
          >
            <p
              className={`text-base font-black tabular-nums sm:text-lg ${
                countdown.isUrgent
                  ? theme.countdownUrgentText
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {String(u.value).padStart(2, "0")}
            </p>

            <p className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {u.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const OfferSkeleton = ({ index }) => {
  const theme = getTheme(index);

  return (
    <div className="w-[86vw] max-w-[410px] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:w-[390px] lg:w-[410px]">
      <div
        className={`h-56 animate-pulse bg-gradient-to-br ${theme.gradient} opacity-40`}
      />

      <div className="space-y-4 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");
  const [copyError, setCopyError] = useState("");
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const carouselRef = useRef(null);
  const copyTimerRef = useRef(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await couponService.getActiveCoupons();

      let coupons = [];

      if (Array.isArray(response)) coupons = response;
      else if (Array.isArray(response?.coupons))
        coupons = response.coupons;
      else if (Array.isArray(response?.data))
        coupons = response.data;
      else if (Array.isArray(response?.data?.coupons))
        coupons = response.data.coupons;
      else if (Array.isArray(response?.data?.data?.coupons))
        coupons = response.data.data.coupons;

      setOffers(coupons);
      setCurrentOfferIndex(0);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load offers",
      );
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current)
        window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const updateCarouselState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < max - 5);

    const cards = Array.from(
      el.querySelectorAll("[data-offer-card]"),
    );

    if (cards.length === 0) {
      setCurrentOfferIndex(0);
      return;
    }

    const containerLeft = el.getBoundingClientRect().left;
    let nearest = 0;
    let smallest = Infinity;

    cards.forEach((card, i) => {
      const d = Math.abs(
        card.getBoundingClientRect().left - containerLeft,
      );

      if (d < smallest) {
        smallest = d;
        nearest = i;
      }
    });

    setCurrentOfferIndex(nearest);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || loading || offers.length === 0)
      return undefined;

    const frame = window.requestAnimationFrame(
      updateCarouselState,
    );

    el.addEventListener("scroll", updateCarouselState, {
      passive: true,
    });

    window.addEventListener("resize", updateCarouselState);

    return () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", updateCarouselState);
      window.removeEventListener("resize", updateCarouselState);
    };
  }, [loading, offers.length, updateCarouselState]);

  const activeOfferCount = useMemo(() => {
    return offers.filter((offer) => {
      const cd = getCountdownData(
        getOfferExpiryDate(offer),
        currentTime,
      );
      return !cd.isExpired;
    }).length;
  }, [offers, currentTime]);

  const scrollToOffer = (index) => {
    const el = carouselRef.current;
    if (!el) return;

    const cards = Array.from(
      el.querySelectorAll("[data-offer-card]"),
    );

    const safe = Math.max(
      0,
      Math.min(index, cards.length - 1),
    );

    const card = cards[safe];
    if (!card) return;

    el.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });
  };

  const handleCopyCode = async (code) => {
    const normalized = String(code || "").trim();
    if (!normalized) {
      setCopyError("Coupon code is unavailable.");
      return;
    }

    try {
      await copyTextToClipboard(normalized);
      setCopyError("");
      setCopiedCode(normalized);

      if (copyTimerRef.current)
        window.clearTimeout(copyTimerRef.current);

      copyTimerRef.current = window.setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch {
      setCopiedCode("");
      setCopyError(
        "Unable to copy. Please copy it manually.",
      );

      if (copyTimerRef.current)
        window.clearTimeout(copyTimerRef.current);

      copyTimerRef.current = window.setTimeout(() => {
        setCopyError("");
      }, 3000);
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/80 via-transparent to-orange-50/80 dark:from-red-950/20 dark:via-transparent dark:to-orange-950/10" />

      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-red-300/25 blur-3xl dark:bg-red-600/10" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-orange-300/25 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] [background-size:28px_28px] dark:bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400">
              <Sparkles className="h-3.5 w-3.5" />
              Limited-time travel deals
            </div>

            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25 sm:flex">
                <Gift className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
                  Exclusive TedBus
                  <span className="ml-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                    Offers
                  </span>
                </h2>

                <p className="mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                  Unlock verified coupons and save more on
                  your next bus journey.
                </p>
              </div>
            </div>
          </div>

          {!loading && !error && offers.length > 0 && (
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 dark:border-emerald-900/40 dark:bg-emerald-950/25">
                <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Live deals
                </p>

                <p className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {activeOfferCount}
                </p>
              </div>

              {offers.length > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      scrollToOffer(currentOfferIndex - 1)
                    }
                    disabled={!canScrollLeft}
                    aria-label="Previous offer"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      scrollToOffer(currentOfferIndex + 1)
                    }
                    disabled={!canScrollRight}
                    aria-label="Next offer"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-hidden px-4 pb-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {[0, 1, 2].map((i) => (
              <OfferSkeleton key={i} index={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-red-100 bg-white p-7 text-center shadow-xl shadow-red-500/5 dark:border-red-900/40 dark:bg-slate-900 sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <AlertCircle className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
                Offers unavailable
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchOffers}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              >
                <Loader2 className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && offers.length === 0 && (
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-orange-200/30 blur-3xl dark:bg-orange-900/10" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                <TicketPercent className="h-8 w-8" />
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                No active offers right now
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                New coupons and travel deals will appear
                here when available.
              </p>
            </div>
          </div>
        )}

        {/* Offer carousel */}
        {!loading && !error && offers.length > 0 && (
          <>
            <div
              ref={carouselRef}
              className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-4 pb-7 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 lg:mx-0 lg:px-1"
              role="list"
              aria-label="Active coupon offers"
              tabIndex={0}
            >
              {offers.map((offer, index) => {
                const theme = getTheme(index);
                const expiryDate = getOfferExpiryDate(offer);
                const countdown = getCountdownData(
                  expiryDate,
                  currentTime,
                );
                const couponCode = String(offer?.code || "")
                  .trim()
                  .toUpperCase();
                const minPurchase = Number(
                  offer?.minPurchase ||
                    offer?.minimumPurchase ||
                    0,
                );
                const maxDiscount = Number(
                  offer?.maxDiscount ||
                    offer?.maximumDiscount ||
                    0,
                );
                const isCopied = copiedCode === couponCode;

                return (
                  <article
                    key={
                      offer?._id ||
                      offer?.id ||
                      offer?.code ||
                      index
                    }
                    data-offer-card
                    role="listitem"
                    className={`group relative flex w-[86vw] max-w-[410px] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] border bg-white shadow-lg shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:bg-slate-900 dark:shadow-black/20 sm:w-[390px] lg:w-[410px] ${
                      countdown.isExpired
                        ? "border-slate-200 opacity-80 dark:border-slate-800"
                        : `border-slate-200 dark:border-slate-800 ${theme.hoverBorder} ${theme.hoverShadow}`
                    }`}
                  >
                    {/* Colored top section */}
                    <div
                      className={`relative min-h-[230px] overflow-hidden bg-gradient-to-br ${theme.gradient} p-5 text-white sm:p-6`}
                    >
                      <div
                        className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[24px] border-white/10`}
                      />

                      <div
                        className={`pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full ${theme.glow} blur-2xl`}
                      />

                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] [background-size:40px_40px] opacity-20" />

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl">
                          <Sparkles className="h-3.5 w-3.5" />
                          {theme.tagLabel}
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl">
                          <BadgePercent className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="relative mt-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                          {theme.tagLabel}
                        </p>

                        <h3 className="mt-1 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                          {getDiscountText(offer)}
                        </h3>

                        <p className="mt-3 min-h-[48px] max-w-sm text-sm font-semibold leading-6 text-white/90">
                          {getCouponTitle(offer)}
                        </p>
                      </div>

                      {countdown.isExpired && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px]">
                          <div className="-rotate-6 rounded-2xl border-2 border-white/80 px-6 py-3 text-xl font-black uppercase tracking-[0.2em] text-white">
                            Expired
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ticket notch */}
                    <div className="relative z-10">
                      <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />

                      <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                      <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                    </div>

                    {/* Card body */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      {(minPurchase > 0 ||
                        maxDiscount > 0) && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {minPurchase > 0 && (
                            <span
                              className={`rounded-xl border px-3 py-1.5 text-[10px] font-black ${theme.softBorder} ${theme.softBg} text-slate-600 dark:text-slate-300`}
                            >
                              Min. booking ₹
                              {formatCurrency(minPurchase)}
                            </span>
                          )}

                          {maxDiscount > 0 && (
                            <span
                              className={`rounded-xl border px-3 py-1.5 text-[10px] font-black ${theme.softBorder} ${theme.softBg} ${theme.accentText}`}
                            >
                              Max. saving ₹
                              {formatCurrency(maxDiscount)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Themed countdown */}
                      <ExpiryCountdown
                        expiryDate={expiryDate}
                        currentTime={currentTime}
                        theme={theme}
                      />

                      {/* Coupon code */}
                      <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-1 shadow-lg shadow-slate-900/10">
                        <div className="flex items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-white/5 p-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                              Coupon code
                            </p>

                            <p className="mt-1 truncate text-lg font-black uppercase tracking-[0.12em] text-white">
                              {couponCode || "N/A"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyCode(couponCode)
                            }
                            disabled={
                              countdown.isExpired ||
                              !couponCode
                            }
                            title={
                              isCopied
                                ? "Copied"
                                : "Copy code"
                            }
                            aria-label={
                              isCopied
                                ? "Copied"
                                : `Copy ${couponCode}`
                            }
                            className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition active:scale-95 ${
                              countdown.isExpired ||
                              !couponCode
                                ? "cursor-not-allowed bg-slate-700 text-slate-500"
                                : isCopied
                                  ? theme.copiedBg
                                  : theme.copyBg
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="hidden min-[370px]:inline">
                                  Copied
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                <span className="hidden min-[370px]:inline">
                                  Copy
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Trust footer */}
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <span className="inline-flex items-center gap-1.5 text-[8px] font-bold text-slate-400 dark:text-slate-500">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          Verified TedBus offer
                        </span>

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
                  </article>
                );
              })}
            </div>

            {/* Dots */}
            {offers.length > 1 && (
              <div className="mt-1 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-1.5">
                  {offers.map((offer, index) => {
                    const theme = getTheme(index);

                    return (
                      <button
                        key={
                          offer?._id ||
                          offer?.id ||
                          offer?.code ||
                          index
                        }
                        type="button"
                        onClick={() => scrollToOffer(index)}
                        aria-label={`Go to offer ${index + 1}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentOfferIndex === index
                            ? `w-7 bg-gradient-to-r ${theme.gradient}`
                            : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600"
                        }`}
                      />
                    );
                  })}
                </div>

                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:hidden">
                  Swipe to explore more offers
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Copy error toast */}
      {copyError && (
        <div
          role="alert"
          className="fixed bottom-5 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 shadow-2xl dark:border-red-900/50 dark:bg-slate-900"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
          </div>

          <p className="pt-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
            {copyError}
          </p>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {copiedCode
          ? `Coupon code ${copiedCode} copied`
          : ""}
      </span>
    </section>
  );
};

export default Offers;