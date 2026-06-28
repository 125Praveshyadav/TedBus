import { useEffect, useState } from "react";
import {
  AlertCircle,
  BadgePercent,
  CheckCircle2,
  Copy,
  Gift,
  Loader2,
  TicketPercent,
} from "lucide-react";

import couponService from "../../services/couponService";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");
  const [error, setError] = useState("");

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
      setError(err?.message || "Failed to load offers");
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1500);
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

  const getCouponTitle = (offer) => {
    if (offer.discountType === "percentage") {
      return `Save ${offer.discountValue}% on your next TedBus booking`;
    }

    if (offer.discountType === "flat") {
      return `Get flat ₹${offer.discountValue} off on your booking`;
    }

    return "Save more on your journey";
  };

  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-red-600">
            <Gift className="h-7 w-7" />
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Exclusive TedBus Offers
          </h2>

          <p className="mt-3 text-base leading-7 text-slate-500">
            Save more on every journey with active coupons and limited-time
            travel deals.
          </p>
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex h-64 animate-pulse items-center justify-center rounded-[2rem] border border-slate-100 bg-slate-100"
              >
                <Loader2 className="h-7 w-7 animate-spin text-slate-300" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

            <h3 className="mt-3 text-lg font-black text-slate-900">
              Offers unavailable
            </h3>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              type="button"
              onClick={fetchOffers}
              className="mt-5 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && offers.length === 0 && (
          <div className="mx-auto max-w-xl rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center">
            <TicketPercent className="mx-auto h-12 w-12 text-slate-300" />

            <h3 className="mt-4 text-lg font-black text-slate-800">
              No active offers right now
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              New coupons will appear here when available.
            </p>
          </div>
        )}

        {!loading && !error && offers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => {
              const offerId = offer._id || offer.id || offer.code;
              const code = offer.code;
              const discountText = getDiscountText(offer);
              const title = getCouponTitle(offer);

              return (
                <article
                  key={offerId}
                  className="group relative overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-1 shadow-xl shadow-red-500/15 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/25"
                >
                  <div className="relative h-full rounded-[1.8rem] bg-white/10 p-6 text-white backdrop-blur">
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/10" />

                    <div className="relative">
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                          <BadgePercent className="h-6 w-6" />
                        </div>

                        {offer.expiryDate && (
                          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                            Valid till{" "}
                            {new Date(offer.expiryDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </span>
                        )}
                      </div>

                      <h3 className="text-3xl font-black tracking-tight">
                        {discountText}
                      </h3>

                      <p className="mt-3 min-h-[48px] text-sm leading-6 text-red-50">
                        {title}
                      </p>

                      <div className="mt-6 rounded-2xl border border-dashed border-white/50 bg-white p-3 text-red-600">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                              Coupon Code
                            </p>

                            <p className="text-lg font-black tracking-wider text-red-600">
                              {code}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyCode(code)}
                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white active:scale-95"
                            title="Copy coupon code"
                          >
                            {copiedCode === code ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Copy className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1 text-xs font-semibold text-red-50">
                        {offer.minPurchase > 0 && (
                          <p>Minimum booking amount: ₹{offer.minPurchase}</p>
                        )}

                        {offer.maxDiscount && (
                          <p>Maximum discount: ₹{offer.maxDiscount}</p>
                        )}

                        {offer.usageLimit && (
                          <p>
                            Used {offer.usedCount || 0}/{offer.usageLimit} times
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Offers;