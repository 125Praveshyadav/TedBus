import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertCircle,
  ArrowRight,
  BadgePercent,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  HelpCircle,
  Loader2,
  Percent,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TicketPercent,
  Wallet,
} from "lucide-react";
import couponService from "../../services/couponService";

const OffersNav = () => {
  const { t } = useTranslation(["offers", "common"]);
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { key: "all", label: t("offers:categories.all") },
    { key: "percentage", label: t("offers:categories.percentage") },
    { key: "flat", label: t("offers:categories.flat") },
    { key: "expiring", label: t("offers:categories.expiring") },
  ];

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await couponService.getActiveCoupons();
      const coupons = response?.coupons || response?.data?.coupons || [];
      setOffers(Array.isArray(coupons) ? coupons : []);
    } catch (err) {
      setError(err?.message || "Unable to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const filteredOffers = useMemo(() => {
    let result = [...offers];
    if (activeCategory === "percentage") result = result.filter(o => o.discountType === "percentage");
    else if (activeCategory === "flat") result = result.filter(o => o.discountType === "flat");
    else if (activeCategory === "expiring") {
      const now = new Date();
      result = result.filter(o => Math.ceil((new Date(o.expiryDate) - now) / (1000 * 60 * 60 * 24)) <= 7);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(o => o.code?.toLowerCase().includes(query));
    }
    return result;
  }, [offers, activeCategory, searchQuery]);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 1500);
    } catch { toast.error("Unable to copy code"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-16 text-white">
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
            <Sparkles className="h-4 w-4" /> {t("offers:exclusiveBadge")}
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{t("offers:heroTitle")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-red-50">{t("offers:heroSubtitle")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-colors">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("offers:searchPlaceholder")}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-red-500"
              />
            </div>
            <button onClick={fetchOffers} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              <RefreshCcw className="h-4 w-4" /> {t("offers:refresh")}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c.key} onClick={() => setActiveCategory(c.key)} className={`rounded-2xl px-4 py-2 text-sm font-black transition ${activeCategory === c.key ? "bg-red-600 text-white shadow-md shadow-red-500/20" : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-red-600"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Offer Cards Grid */}
        {!loading && !error && filteredOffers.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => (
              <article key={offer._id} className="group relative overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-100 dark:hover:border-red-900/30 hover:shadow-2xl hover:shadow-red-500/10">
                {/* Card Header Gradient */}
                <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 text-white">
                  <p className="text-[11px] font-black uppercase tracking-wider text-red-50">TedBus Offer</p>
                  <h3 className="mt-1 text-3xl font-black">{offer.discountType === "percentage" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}</h3>
                </div>

                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {offer.discountType === "percentage" ? `Save ${offer.discountValue}% on your next booking` : `Get flat ₹${offer.discountValue} off`}
                  </p>
                  
                  <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />
                  
                  {/* Coupon Code Claymorphism box */}
                  <div className="mt-5 rounded-2xl border border-dashed border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Coupon Code</p>
                        <p className="truncate text-lg font-black tracking-wider text-red-600 dark:text-red-500 uppercase">{offer.code}</p>
                      </div>
                      <button onClick={() => handleCopyCode(offer.code)} className={`flex h-11 items-center justify-center gap-1 rounded-xl px-4 text-xs font-black transition ${copiedCode === offer.code ? "bg-green-600 text-white" : "bg-red-600 text-white hover:bg-red-700"}`}>
                        {copiedCode === offer.code ? <><CheckCircle2 className="h-4 w-4" /> {t("offers:copied")}</> : <><Copy className="h-4 w-4" /> {t("offers:copy")}</>}
                      </button>
                    </div>
                  </div>

                  <button onClick={() => navigate("/search-bus")} className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 text-sm font-black text-slate-700 dark:text-slate-300 hover:border-red-100 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 transition-all">
                    {t("offers:useOffer")} <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersNav;