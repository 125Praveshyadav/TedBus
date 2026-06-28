import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const categories = [
  { key: "all", label: "All Offers" },
  { key: "percentage", label: "Percentage" },
  { key: "flat", label: "Flat Discount" },
  { key: "expiring", label: "Expiring Soon" },
];

const formatDate = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const daysLeft = (date) => {
  if (!date) return 0;

  const expiry = new Date(date);
  const now = new Date();

  const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  return diff > 0 ? diff : 0;
};

const OffersNav = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await couponService.getActiveCoupons();

      const coupons =
        response?.coupons ||
        response?.data?.coupons ||
        [];

      setOffers(Array.isArray(coupons) ? coupons : []);
    } catch (err) {
      setError(err?.message || "Unable to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = useMemo(() => {
    let result = [...offers];

    if (activeCategory === "percentage") {
      result = result.filter((offer) => offer.discountType === "percentage");
    } else if (activeCategory === "flat") {
      result = result.filter((offer) => offer.discountType === "flat");
    } else if (activeCategory === "expiring") {
      result = result.filter((offer) => daysLeft(offer.expiryDate) <= 7);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((offer) =>
        offer.code?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [offers, activeCategory, searchQuery]);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(""), 1500);
    } catch {
      alert("Unable to copy coupon code");
    }
  };

  const getDiscountText = (offer) => {
    if (offer.discountType === "percentage") {
      return `${offer.discountValue}% OFF`;
    }

    if (offer.discountType === "flat") {
      return `₹${offer.discountValue} OFF`;
    }

    return "Special Offer";
  };

  const getOfferTitle = (offer) => {
    if (offer.discountType === "percentage") {
      return `Save ${offer.discountValue}% on your next TedBus booking`;
    }

    if (offer.discountType === "flat") {
      return `Get flat ₹${offer.discountValue} off on bookings above ₹${
        offer.minPurchase || 0
      }`;
    }

    return "Save more on your journey";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Exclusive TedBus Offers
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Save big on every journey
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-base font-medium leading-7 text-red-50">
            Active coupons created by the TedBus team. Use codes during booking
            to instantly save on your fare.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search coupon code..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              />
            </div>

            <button
              type="button"
              onClick={fetchOffers}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Categories */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onClick={() => setActiveCategory(category.key)}
                className={`rounded-2xl px-4 py-2 text-sm font-black transition ${
                  activeCategory === category.key
                    ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-72 animate-pulse items-center justify-center rounded-[2rem] border border-slate-100 bg-slate-100"
              >
                <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h2 className="mt-3 text-xl font-black text-slate-900">
              Offers unavailable
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchOffers}
              className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredOffers.length === 0 && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <TicketPercent className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-2xl font-black text-slate-900">
              No offers available right now
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              New offers will appear here as soon as our team adds them.
            </p>
            <button
              type="button"
              onClick={() => navigate("/search-bus")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
            >
              Book a bus instead
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Offer Cards */}
        {!loading && !error && filteredOffers.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOffers.map((offer) => {
              const id = offer._id || offer.id || offer.code;
              const code = offer.code;
              const discountText = getDiscountText(offer);
              const title = getOfferTitle(offer);
              const expiringSoon = daysLeft(offer.expiryDate) <= 7;

              return (
                <article
                  key={id}
                  className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/15"
                >
                  {/* Header */}
                  <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 text-white">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                    <div className="relative flex items-start justify-between">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-wider text-red-50">
                          TedBus Offer
                        </p>
                        <h3 className="mt-1 text-3xl font-black tracking-tight">
                          {discountText}
                        </h3>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                        {offer.discountType === "percentage" ? (
                          <Percent className="h-6 w-6" />
                        ) : offer.discountType === "flat" ? (
                          <Wallet className="h-6 w-6" />
                        ) : (
                          <BadgePercent className="h-6 w-6" />
                        )}
                      </div>
                    </div>

                    {expiringSoon && (
                      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-amber-100">
                        <Clock className="h-3 w-3" />
                        Expiring in {daysLeft(offer.expiryDate)} days
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-sm font-semibold leading-6 text-slate-600">
                      {title}
                    </p>

                    <div className="my-4 h-px bg-slate-100" />

                    <div className="space-y-2 text-xs font-semibold text-slate-500">
                      {offer.minPurchase > 0 && (
                        <p className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-green-500" />
                          Minimum booking: ₹{offer.minPurchase}
                        </p>
                      )}

                      {offer.maxDiscount && (
                        <p className="flex items-center gap-2">
                          <BadgePercent className="h-4 w-4 text-red-500" />
                          Maximum discount: ₹{offer.maxDiscount}
                        </p>
                      )}

                      {offer.expiryDate && (
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          Valid till {formatDate(offer.expiryDate)}
                        </p>
                      )}

                      {offer.usageLimit && (
                        <p className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500" />
                          {offer.usedCount || 0} / {offer.usageLimit} used
                        </p>
                      )}
                    </div>

                    {/* Coupon Code */}
                    <div className="mt-5 rounded-2xl border border-dashed border-red-200 bg-red-50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                            Coupon Code
                          </p>
                          <p className="truncate text-lg font-black tracking-wider text-red-600">
                            {code}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopyCode(code)}
                          className={`flex h-11 items-center justify-center gap-1 rounded-xl px-3 text-xs font-black transition ${
                            copiedCode === code
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {copiedCode === code ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("/search-bus")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                      Use Offer Now
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Trust Section */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Verified Coupons",
                desc: "All offers are added and verified by the TedBus admin team.",
                icon: ShieldCheck,
                color: "text-green-600 bg-green-50",
              },
              {
                title: "Apply at Checkout",
                desc: "Use the coupon code during booking summary to instantly save.",
                icon: TicketPercent,
                color: "text-red-600 bg-red-50",
              },
              {
                title: "24×7 Support",
                desc: "Need help with a coupon? Our support team is always available.",
                icon: HelpCircle,
                color: "text-blue-600 bg-blue-50",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-base font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Terms */}
        <section className="mt-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-black text-red-600">
              <Gift className="h-3.5 w-3.5" />
              Terms & Conditions
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Important coupon rules
            </h2>

            <p className="mt-3 text-sm font-medium leading-7 text-slate-500">
              Please review these terms before applying any coupon at checkout.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "One Code Per Booking",
                desc: "Only one coupon code can be applied per booking.",
              },
              {
                title: "Non-Transferable",
                desc: "Coupons cannot be transferred or shared with others.",
              },
              {
                title: "Validity",
                desc: "Coupons are valid only till the mentioned expiry date.",
              },
              {
                title: "Minimum Booking",
                desc: "Offer is valid only when the minimum amount is met.",
              },
              {
                title: "Refund Policy",
                desc: "Refunds are processed as per booking and operator policy.",
              },
              {
                title: "No Cash Back",
                desc: "Unused coupon discount cannot be converted to cash.",
              },
            ].map((term) => (
              <article
                key={term.title}
                className="rounded-3xl border-l-4 border-red-600 bg-white p-5 shadow-sm"
              >
                <h4 className="text-sm font-black text-slate-900">
                  {term.title}
                </h4>
                <p className="mt-2 text-xs font-medium leading-6 text-slate-500">
                  {term.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-1 shadow-xl shadow-red-500/20">
          <div className="rounded-[1.8rem] bg-white p-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Ready to save on your next trip?
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-500">
              Search for your route, pick the best bus and apply a coupon at
              checkout for instant savings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/search-bus")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-red-500/30 transition hover:bg-red-700 active:scale-95"
            >
              Search Buses
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OffersNav;