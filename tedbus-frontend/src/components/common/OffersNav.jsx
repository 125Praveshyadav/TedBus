import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BadgePercent,
  Calendar,
  CheckCircle2,
  Clock3,
  Copy,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  TicketPercent,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import couponService from "../../services/couponService";

const categories = [
  { key: "all", label: "All Offers", icon: Tag },
  { key: "percentage", label: "Percentage", icon: BadgePercent },
  { key: "flat", label: "Flat Discount", icon: BadgePercent },
  { key: "expiring", label: "Expiring Soon", icon: Timer },
];

const THEMES = [
  {
    gradient: "from-rose-600 via-red-500 to-orange-500",
    text: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-950/30",
    borderLight: "border-rose-200 dark:border-rose-900/40",
    hoverBorder: "hover:border-rose-200 dark:hover:border-rose-900/60",
    hoverShadow: "hover:shadow-rose-500/10",
    dotColor: "bg-rose-500",
    tagLabel: "Hot Deal",
    copyBg: "bg-rose-600 hover:bg-rose-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-blue-600 via-blue-500 to-cyan-500",
    text: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-950/30",
    borderLight: "border-blue-200 dark:border-blue-900/40",
    hoverBorder: "hover:border-blue-200 dark:hover:border-blue-900/60",
    hoverShadow: "hover:shadow-blue-500/10",
    dotColor: "bg-blue-500",
    tagLabel: "Exclusive",
    copyBg: "bg-blue-600 hover:bg-blue-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-emerald-600 via-emerald-500 to-teal-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    borderLight: "border-emerald-200 dark:border-emerald-900/40",
    hoverBorder: "hover:border-emerald-200 dark:hover:border-emerald-900/60",
    hoverShadow: "hover:shadow-emerald-500/10",
    dotColor: "bg-emerald-500",
    tagLabel: "Super Saver",
    copyBg: "bg-emerald-600 hover:bg-emerald-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-purple-600 via-purple-500 to-fuchsia-500",
    text: "text-purple-600 dark:text-purple-400",
    bgLight: "bg-purple-50 dark:bg-purple-950/30",
    borderLight: "border-purple-200 dark:border-purple-900/40",
    hoverBorder: "hover:border-purple-200 dark:hover:border-purple-900/60",
    hoverShadow: "hover:shadow-purple-500/10",
    dotColor: "bg-purple-500",
    tagLabel: "Premium",
    copyBg: "bg-purple-600 hover:bg-purple-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-amber-500 via-amber-400 to-orange-400",
    text: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    borderLight: "border-amber-200 dark:border-amber-900/40",
    hoverBorder: "hover:border-amber-200 dark:hover:border-amber-900/60",
    hoverShadow: "hover:shadow-amber-500/10",
    dotColor: "bg-amber-500",
    tagLabel: "Flash Sale",
    copyBg: "bg-amber-500 hover:bg-amber-600",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-indigo-600 via-indigo-500 to-violet-500",
    text: "text-indigo-600 dark:text-indigo-400",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
    borderLight: "border-indigo-200 dark:border-indigo-900/40",
    hoverBorder: "hover:border-indigo-200 dark:hover:border-indigo-900/60",
    hoverShadow: "hover:shadow-indigo-500/10",
    dotColor: "bg-indigo-500",
    tagLabel: "Top Pick",
    copyBg: "bg-indigo-600 hover:bg-indigo-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-pink-600 via-pink-500 to-rose-500",
    text: "text-pink-600 dark:text-pink-400",
    bgLight: "bg-pink-50 dark:bg-pink-950/30",
    borderLight: "border-pink-200 dark:border-pink-900/40",
    hoverBorder: "hover:border-pink-200 dark:hover:border-pink-900/60",
    hoverShadow: "hover:shadow-pink-500/10",
    dotColor: "bg-pink-500",
    tagLabel: "Special",
    copyBg: "bg-pink-600 hover:bg-pink-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-cyan-600 via-cyan-500 to-blue-500",
    text: "text-cyan-600 dark:text-cyan-400",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
    borderLight: "border-cyan-200 dark:border-cyan-900/40",
    hoverBorder: "hover:border-cyan-200 dark:hover:border-cyan-900/60",
    hoverShadow: "hover:shadow-cyan-500/10",
    dotColor: "bg-cyan-500",
    tagLabel: "Limited Time",
    copyBg: "bg-cyan-600 hover:bg-cyan-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-teal-600 via-teal-500 to-emerald-500",
    text: "text-teal-600 dark:text-teal-400",
    bgLight: "bg-teal-50 dark:bg-teal-950/30",
    borderLight: "border-teal-200 dark:border-teal-900/40",
    hoverBorder: "hover:border-teal-200 dark:hover:border-teal-900/60",
    hoverShadow: "hover:shadow-teal-500/10",
    dotColor: "bg-teal-500",
    tagLabel: "Trending",
    copyBg: "bg-teal-600 hover:bg-teal-700",
    copiedBg: "bg-emerald-600",
  },
  {
    gradient: "from-fuchsia-600 via-fuchsia-500 to-pink-500",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    bgLight: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    borderLight: "border-fuchsia-200 dark:border-fuchsia-900/40",
    hoverBorder: "hover:border-fuchsia-200 dark:hover:border-fuchsia-900/60",
    hoverShadow: "hover:shadow-fuchsia-500/10",
    dotColor: "bg-fuchsia-500",
    tagLabel: "Classic",
    copyBg: "bg-fuchsia-600 hover:bg-fuchsia-700",
    copiedBg: "bg-emerald-600",
  },
];

const getTheme = (index) => {
  return THEMES[index % THEMES.length];
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
    const [year, month, day] = expiryDate.split("-").map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999).getTime();
  }

  const timestamp = new Date(expiryDate).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const getDaysLeft = (expiryDate) => {
  const expiryTimestamp = getExpiryTimestamp(expiryDate);
  if (!expiryTimestamp) return null;

  const difference = expiryTimestamp - Date.now();
  if (difference <= 0) return 0;

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const isExpired = (expiryDate) => {
  const days = getDaysLeft(expiryDate);
  return days !== null && days <= 0;
};

const isExpiringSoon = (expiryDate) => {
  const days = getDaysLeft(expiryDate);
  return days !== null && days > 0 && days <= 7;
};

const formatExpiryDate = (expiryDate) => {
  const expiryTimestamp = getExpiryTimestamp(expiryDate);
  if (!expiryTimestamp) return null;

  return new Date(expiryTimestamp).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDiscountText = (offer) => {
  const type = String(offer?.discountType || "").toLowerCase();

  if (type === "percentage") {
    return `${formatCurrency(offer?.discountValue)}% OFF`;
  }

  if (type === "flat" || type === "fixed") {
    return `₹${formatCurrency(offer?.discountValue)} OFF`;
  }

  return "Special Offer";
};

const getOfferDescription = (offer) => {
  if (offer?.title) return offer.title;
  if (offer?.description) return offer.description;

  const type = String(offer?.discountType || "").toLowerCase();

  if (type === "percentage") {
    return `Save ${formatCurrency(
      offer?.discountValue,
    )}% on your next TedBus booking`;
  }

  if (type === "flat" || type === "fixed") {
    return `Get flat ₹${formatCurrency(
      offer?.discountValue,
    )} off on your booking`;
  }

  return "Save more on your next bus journey";
};

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textArea);

  if (!copied) throw new Error("Copy failed");
};

const OfferSkeleton = ({ index }) => {
  const theme = getTheme(index);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`h-40 animate-pulse bg-gradient-to-br ${theme.gradient} opacity-40`}
      />

      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    </div>
  );
};

const OffersNav = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const copyTimerRef = useRef(null);

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await couponService.getActiveCoupons();

      let coupons = [];

      if (Array.isArray(response)) {
        coupons = response;
      } else if (Array.isArray(response?.coupons)) {
        coupons = response.coupons;
      } else if (Array.isArray(response?.data)) {
        coupons = response.data;
      } else if (Array.isArray(response?.data?.coupons)) {
        coupons = response.data.coupons;
      } else if (Array.isArray(response?.data?.data?.coupons)) {
        coupons = response.data.data.coupons;
      }

      setOffers(coupons);
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
    return () => {
      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const filteredOffers = useMemo(() => {
    let result = [...offers];

    if (activeCategory === "percentage") {
      result = result.filter(
        (offer) =>
          String(offer.discountType || "").toLowerCase() === "percentage",
      );
    } else if (activeCategory === "flat") {
      result = result.filter((offer) => {
        const type = String(offer.discountType || "").toLowerCase();
        return type === "flat" || type === "fixed";
      });
    } else if (activeCategory === "expiring") {
      result = result.filter((offer) => {
        const expiryDate =
          offer.expiryDate || offer.expiresAt || offer.validTill;
        return isExpiringSoon(expiryDate);
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (offer) =>
          offer.code?.toLowerCase().includes(query) ||
          offer.title?.toLowerCase().includes(query) ||
          offer.description?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [offers, activeCategory, searchQuery]);

  const stats = useMemo(() => {
    const activeOffers = offers.filter((offer) => {
      const expiryDate =
        offer.expiryDate || offer.expiresAt || offer.validTill;
      return !isExpired(expiryDate);
    });

    const expiringSoon = offers.filter((offer) => {
      const expiryDate =
        offer.expiryDate || offer.expiresAt || offer.validTill;
      return isExpiringSoon(expiryDate);
    });

    return {
      total: offers.length,
      active: activeOffers.length,
      expiring: expiringSoon.length,
    };
  }, [offers]);

  const handleCopyCode = async (code) => {
    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!normalizedCode) return;

    try {
      await copyTextToClipboard(normalizedCode);
      setCopiedCode(normalizedCode);

      if (copyTimerRef.current) {
        window.clearTimeout(copyTimerRef.current);
      }

      copyTimerRef.current = window.setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch {
      setCopiedCode("");
      alert("Unable to copy code. Please copy it manually.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      
      {/* Reduced Height Premium Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-500/20" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-red-600/30 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-orange-500/30 blur-[80px]" />
        
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-orange-400" />
            Verified Deals
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Unlock premium savings
            <span className="mt-1 block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              on every journey.
            </span>
          </h1>

          {!loading && !error && offers.length > 0 && (
            <div className="mx-auto mt-6 grid max-w-md grid-cols-3 gap-3">
              {[
                { icon: Tag, value: stats.total, label: "Total offers" },
                { icon: Zap, value: stats.active, label: "Active now" },
                { icon: Timer, value: stats.expiring, label: "Expiring soon" },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/10 p-2.5 backdrop-blur-xl"
                  >
                    <StatIcon className="mx-auto h-3.5 w-3.5 text-white/80" />
                    <p className="mt-1 text-lg font-black text-white">{stat.value}</p>
                    <p className="text-[8px] font-black uppercase tracking-wider text-white/60">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Filter bar */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-200/30 blur-3xl dark:bg-red-900/10" />

          <div className="relative grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            {/* Search */}
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <Search className="h-4 w-4" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search coupon code or offer..."
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-14 pr-4 text-sm font-bold text-slate-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900"
              />
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={fetchOffers}
              disabled={loading}
              className="group flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            >
              <RefreshCcw
                className={`h-4 w-4 transition-transform ${
                  loading ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
              Refresh
            </button>

            {/* Results count */}
            {!loading && !error && (
              <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-800/70 lg:flex">
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">
                    {filteredOffers.length}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                    Results
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Category tabs */}
          <div className="relative mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const CategoryIcon = category.icon;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategory(category.key)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition sm:text-sm ${
                    activeCategory === category.key
                      ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  }`}
                >
                  <CategoryIcon className="h-3.5 w-3.5" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <OfferSkeleton key={index} index={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-500/5 dark:border-red-900/50 dark:bg-slate-900">
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
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredOffers.length === 0 && (
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                  <TicketPercent className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
                  No offers found
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Try a different category or search, or check back later for new deals.
                </p>
                {activeCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    Show all offers
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Offer cards grid */}
        {!loading && !error && filteredOffers.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pb-20">
            {filteredOffers.map((offer, index) => {
              const theme = getTheme(index);
              const expiryDate = offer.expiryDate || offer.expiresAt || offer.validTill;
              const daysLeft = getDaysLeft(expiryDate);
              const expired = isExpired(expiryDate);
              const expiringSoon = isExpiringSoon(expiryDate);
              const couponCode = String(offer.code || "").trim().toUpperCase();
              const minPurchase = Number(offer.minPurchase || offer.minimumPurchase || 0);
              const maxDiscount = Number(offer.maxDiscount || offer.maximumDiscount || 0);
              const isCopied = copiedCode === couponCode;

              return (
                <article
                  key={offer._id || offer.id || offer.code || index}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 ${theme.hoverBorder} ${theme.hoverShadow}`}
                >
                  {/* Card top */}
                  <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} p-5 text-white`}>
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] backdrop-blur-xl">
                        <Sparkles className="h-3 w-3" />
                        {theme.tagLabel}
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
                        <BadgePercent className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="relative mt-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">
                        TedBus offer
                      </p>
                      <h3 className="mt-1 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                        {getDiscountText(offer)}
                      </h3>
                    </div>

                    {expiryDate && (
                      <div className="relative mt-4">
                        {expired ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-900/40 px-3 py-1 text-[10px] font-black backdrop-blur-xl">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Expired
                          </span>
                        ) : expiringSoon ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/25 px-3 py-1 text-[10px] font-black text-amber-100 backdrop-blur-xl">
                            <Timer className="h-3.5 w-3.5" />
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-[10px] font-bold backdrop-blur-xl">
                            <Calendar className="h-3.5 w-3.5" />
                            Till {formatExpiryDate(expiryDate)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ticket cut */}
                  <div className="relative z-10">
                    <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                    <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />
                    <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="min-h-[40px] text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">
                      {getOfferDescription(offer)}
                    </p>

                    <div className="mt-4 space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {minPurchase > 0 && (
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                          Min. booking: ₹{formatCurrency(minPurchase)}
                        </div>
                      )}
                      {maxDiscount > 0 && (
                        <div className="flex items-center gap-2">
                          <BadgePercent className={`h-3.5 w-3.5 ${theme.accentText}`} />
                          Max discount: ₹{formatCurrency(maxDiscount)}
                        </div>
                      )}
                    </div>

                    {/* Coupon code */}
                    <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-1 shadow-lg shadow-slate-900/10">
                      <div className="flex items-center justify-between gap-3 rounded-[14px] border border-white/10 bg-white/5 p-3">
                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-400">
                            Coupon code
                          </p>
                          <p className="mt-1 truncate text-base font-black uppercase tracking-[0.12em] text-white">
                            {couponCode || "Not Available"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(couponCode)}
                          disabled={expired || !couponCode}
                          title={isCopied ? "Code copied" : "Copy coupon code"}
                          className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-3 text-[11px] font-black text-white transition active:scale-95 ${
                            expired || !couponCode
                              ? "cursor-not-allowed bg-slate-700 text-slate-500"
                              : isCopied
                                ? theme.copiedBg
                                : theme.copyBg
                          }`}
                        >
                          {isCopied ? (
                            <><CheckCircle2 className="h-3.5 w-3.5" /> Copied</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/search-bus")}
                      disabled={expired}
                      className={`group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-black transition ${
                        expired
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-500"
                          : `border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 ${theme.hoverBorder}`
                      }`}
                    >
                      Use Offer Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        {copiedCode ? `Coupon code ${copiedCode} copied` : ""}
      </span>
    </div>
  );
};

export default OffersNav;