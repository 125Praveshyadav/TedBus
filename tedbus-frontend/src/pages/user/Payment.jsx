import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Armchair,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  IndianRupee,
  Loader2,
  Lock,
  MapPin,
  PartyPopper,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Ticket,
  UserRound,
  Wallet,
  WalletCards,
  XCircle,
  Zap,
} from "lucide-react";

import { bookingService } from "../../services/bookingService";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { useAuth } from "../../components/context/AuthContext";

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Date not available";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    const fallback = new Date(date);

    if (Number.isNaN(fallback.getTime())) return date;

    return fallback.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

const normalizePaymentState = (state = {}) => {
  const booking = state.booking || null;
  const bus = state.busDetails || state.bus || booking?.bus || {};
  const bookingId =
    state.bookingId || booking?._id || booking?.id || "";
  const fare = state.fare || booking?.fareBreakup || {};
  const amount =
    state.amount ||
    fare.totalAmount ||
    booking?.totalAmount ||
    0;
  const seats =
    state.seats ||
    state.selectedSeats ||
    booking?.seatNumbers ||
    booking?.passengerDetails
      ?.map((p) => p.seatNumber)
      .filter(Boolean) ||
    [];
  const passengers =
    state.passengers ||
    booking?.passengerDetails ||
    [];

  const passenger = state.passenger || null;

  const normalizedPassengers =
    passengers.length > 0
      ? passengers
      : passenger
        ? [passenger]
        : [];

  return {
    bookingId,
    booking,
    busDetails: {
      ...bus,
      name:
        bus?.name ||
        bus?.busName ||
        bus?.operatorName ||
        "TedBus Partner",
      type:
        bus?.type ||
        bus?.busType ||
        bus?.category ||
        "Standard Bus",
      source: bus?.source || "Source",
      destination: bus?.destination || "Destination",
      departure:
        bus?.departure ||
        bus?.departureTime ||
        bus?.startTime ||
        "—",
      arrival:
        bus?.arrival ||
        bus?.arrivalTime ||
        bus?.endTime ||
        "—",
      duration: bus?.duration || "—",
    },
    journeyDate:
      state.journeyDate ||
      booking?.journeyDate ||
      bus?.journeyDate ||
      "",
    boardingPoint:
      state.boardingPoint || booking?.boardingPoint || "",
    droppingPoint:
      state.droppingPoint || booking?.droppingPoint || "",
    seats,
    passengers: normalizedPassengers,
    fare: {
      pricePerSeat:
        fare.pricePerSeat || fare.seatPrice || 0,
      baseFare: fare.baseFare || 0,
      gst: fare.gst || 0,
      platformFee: fare.platformFee || 0,
      discountAmount: fare.discountAmount || 0,
      totalAmount: amount,
    },
    amount,
    appliedCoupon:
      state.appliedCoupon || booking?.appliedCoupon || null,
  };
};

const paymentFeatures = [
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Bank-grade encryption with Razorpay trusted gateway.",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
  },
  {
    icon: Smartphone,
    title: "UPI & Cards",
    desc: "Pay via UPI, Debit/Credit cards, wallets & net banking.",
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/50",
  },
  {
    icon: Zap,
    title: "Instant Ticket",
    desc: "E-ticket generated immediately after payment verification.",
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/50",
  },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const paymentState = useMemo(() => {
    return normalizePaymentState(location.state || {});
  }, [location.state]);

  const {
    bookingId,
    booking,
    busDetails,
    journeyDate,
    boardingPoint,
    droppingPoint,
    seats,
    passengers,
    fare,
    amount,
    appliedCoupon,
  } = paymentState;

  const [pageError, setPageError] = useState("");
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [verifyingPayment, setVerifyingPayment] =
    useState(false);
  const [paymentSuccess, setPaymentSuccess] =
    useState(null);
  const [paymentFailed, setPaymentFailed] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setPageError(
        "Booking ID missing. Please create booking again before payment.",
      );
    }
  }, [bookingId]);

  const openRazorpayCheckout = async () => {
    setPageError("");
    setPaymentFailed("");

    if (!bookingId) {
      setPageError(
        "Booking ID missing. Please go back and create booking again.",
      );
      return;
    }

    try {
      setCreatingOrder(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Razorpay SDK failed to load. Please check internet connection.",
        );
      }

      const orderResponse =
        await bookingService.createPaymentOrder(bookingId);

      const order =
        orderResponse?.order || orderResponse?.data?.order;

      if (!order?.id) {
        throw new Error(
          "Unable to create Razorpay order.",
        );
      }

      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error(
          "Razorpay key missing. Add VITE_RAZORPAY_KEY_ID in .env",
        );
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "TedBus",
        description: `Bus Ticket - ${bookingId}`,
        order_id: order.id,

        prefill: {
          name:
            user?.name || passengers?.[0]?.name || passengers?.[0]?.fullName || "",
          email:
            user?.email || passengers?.[0]?.email || "",
          contact:
            user?.phone || passengers?.[0]?.phone || "",
        },

        notes: {
          bookingId,
          bus: busDetails?.name,
          route: `${busDetails?.source} to ${busDetails?.destination}`,
        },

        theme: {
          color: "#dc2626",
        },

        handler: async function (response) {
          try {
            setVerifyingPayment(true);

            const verifyPayload = {
              bookingId,
              razorpay_order_id:
                response.razorpay_order_id,
              razorpay_payment_id:
                response.razorpay_payment_id,
              razorpay_signature:
                response.razorpay_signature,
            };

            const verifyResponse =
              await bookingService.verifyPayment(
                verifyPayload,
              );

            const verifiedBooking =
              verifyResponse?.booking ||
              verifyResponse?.data?.booking ||
              booking;

            setPaymentSuccess({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              booking: verifiedBooking,
            });

            sessionStorage.removeItem(
              "tedbus_pending_booking",
            );
          } catch (error) {
            setPaymentFailed(
              error?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setVerifyingPayment(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentFailed(
              "Payment was cancelled. You can retry payment.",
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setPaymentFailed(
          response?.error?.description ||
            "Payment failed. Please try again.",
        );
      });

      razorpay.open();
    } catch (error) {
      setPageError(
        error?.message || "Unable to start payment.",
      );
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleViewTicket = () => {
    const finalBookingId =
      paymentSuccess?.booking?._id ||
      paymentSuccess?.booking?.id ||
      bookingId;

    navigate("/ticket", {
      state: {
        bookingId: finalBookingId,
        booking: paymentSuccess?.booking || booking,
        payment: paymentSuccess,
      },
    });
  };

  if (pageError && !bookingId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-2xl shadow-red-500/10 dark:border-red-900/50 dark:bg-slate-900 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
              Payment unavailable
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              {pageError}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/search-bus"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
              >
                Search Buses
              </Link>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Compact hero */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8">
        <div className="pointer-events-none absolute -left-16 -top-20 h-48 w-48 rounded-full bg-white/15 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-16 right-0 h-52 w-52 rounded-full bg-orange-300/25 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_40%)]" />

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.06)_50%,rgba(255,255,255,0.06)_75%,transparent_75%,transparent)] [background-size:44px_44px] opacity-25" />

        <div className="relative mx-auto max-w-6xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl">
                <Lock className="h-6 w-6" />
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] backdrop-blur-xl sm:text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  Step 3 of 3 · Secure Payment
                </div>

                <h1 className="text-xl font-black tracking-[-0.04em] sm:text-2xl lg:text-3xl">
                  Complete Your Payment
                </h1>

                <p className="mt-1 text-xs font-medium text-red-50/90 sm:text-sm">
                  Booking ID: {bookingId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Step indicator */}
              <div className="hidden items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold backdrop-blur-xl sm:flex sm:text-sm">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Seats
                </span>

                <span className="h-px w-4 bg-white/40" />

                <span className="flex items-center gap-1.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Details
                </span>

                <span className="h-px w-4 bg-white/40" />

                <span className="flex items-center gap-1.5 text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-red-600">
                    3
                  </span>
                  Payment
                </span>
              </div>

              {/* Amount badge */}
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-xl">
                <p className="text-[9px] font-black uppercase tracking-wider text-white/60">
                  Payable
                </p>

                <p className="mt-0.5 text-xl font-black sm:text-2xl">
                  ₹{formatCurrency(amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Payment method card */}
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              {/* Header */}
              <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-emerald-50/50 p-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 sm:p-6">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/15" />

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
                      <WalletCards className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        Razorpay secured
                      </div>

                      <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
                        Pay Securely with Razorpay
                      </h2>

                      <p className="mt-1 max-w-lg text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                        Choose UPI, cards, net banking,
                        wallets or other payment methods.
                      </p>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
                    <CreditCard className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {/* Errors */}
                {pageError && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-red-800 dark:text-red-300">
                        Payment error
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                        {pageError}
                      </p>
                    </div>
                  </div>
                )}

                {paymentFailed && (
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                      <XCircle className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-black text-amber-800 dark:text-amber-300">
                        Payment not completed
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                        {paymentFailed}
                      </p>
                    </div>
                  </div>
                )}

                {/* Feature cards */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {paymentFeatures.map((feature) => {
                    const FeatureIcon = feature.icon;

                    return (
                      <div
                        key={feature.title}
                        className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${feature.border} bg-white dark:bg-slate-900`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${feature.iconBg}`}
                        >
                          <FeatureIcon
                            className={`h-5 w-5 ${feature.iconColor}`}
                          />
                        </div>

                        <h3 className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                          {feature.title}
                        </h3>

                        <p className="mt-1 text-[11px] font-medium leading-4 text-slate-500 dark:text-slate-400">
                          {feature.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Pay button */}
                <button
                  type="button"
                  onClick={openRazorpayCheckout}
                  disabled={
                    creatingOrder || verifyingPayment
                  }
                  className={`group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition-all duration-200 ${
                    creatingOrder || verifyingPayment
                      ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      : "bg-gradient-to-r from-red-600 via-red-600 to-orange-500 text-white shadow-xl shadow-red-500/25 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-red-500/30 active:translate-y-0 active:scale-[0.98]"
                  }`}
                >
                  {creatingOrder || verifyingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      {creatingOrder
                        ? "Creating Payment Order..."
                        : "Verifying Payment..."}
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Pay ₹{formatCurrency(amount)}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  256-bit SSL encrypted · PCI DSS compliant
                </div>
              </div>
            </div>

            {/* Passengers */}
            {passengers.length > 0 && (
              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/50 p-5 dark:border-slate-800 dark:from-slate-900 dark:to-violet-950/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white">
                        Passenger Details
                      </h2>

                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {passengers.length} passenger
                        {passengers.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {passengers.map(
                    (passenger, index) => (
                      <div
                        key={`${passenger.seatNumber || passenger.seatNo || index}-${index}`}
                        className="flex items-center gap-4 p-4 sm:p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-sm font-black text-white shadow-md shadow-red-500/20">
                          {(
                            passenger.name ||
                            passenger.fullName ||
                            "P"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                            {passenger.name ||
                              passenger.fullName ||
                              "Passenger"}
                          </p>

                          <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Seat{" "}
                            {passenger.seatNumber ||
                              passenger.seatNo ||
                              seats[index] ||
                              "N/A"}{" "}
                            · Age:{" "}
                            {passenger.age || "N/A"} ·{" "}
                            {passenger.gender || "N/A"}
                          </p>
                        </div>

                        <span className="rounded-lg bg-violet-50 px-2 py-1 text-[9px] font-black text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                          #{index + 1}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right summary */}
          <aside>
            <div className="sticky top-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              {/* Summary header */}
              <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white dark:border-slate-800">
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-500/25 blur-2xl" />

                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-red-400 backdrop-blur">
                    <Ticket className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Your trip
                    </p>

                    <h2 className="text-base font-black">
                      Booking Summary
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Bus */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20">
                      <BusFront className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-slate-900 dark:text-white">
                        {busDetails.name}
                      </h3>

                      <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {busDetails.type}
                      </p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        From
                      </p>

                      <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">
                        {busDetails.source}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <Clock3 className="h-3 w-3" />
                        {busDetails.departure}
                      </p>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="h-px w-5 border-t border-dashed border-slate-300 dark:border-slate-600" />

                      <ArrowRight className="my-1 h-3 w-3 text-red-500" />

                      <div className="h-px w-5 border-t border-dashed border-slate-300 dark:border-slate-600" />
                    </div>

                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                        To
                      </p>

                      <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">
                        {busDetails.destination}
                      </p>

                      <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        {busDetails.arrival}
                        <Clock3 className="h-3 w-3" />
                      </p>
                    </div>
                  </div>

                  {/* Date & duration */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {journeyDate && (
                      <div className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1.5 dark:border-red-900/50 dark:bg-red-950/30">
                        <CalendarDays className="h-3 w-3 text-red-600 dark:text-red-400" />

                        <span className="text-[9px] font-black text-red-700 dark:text-red-300">
                          {formatJourneyDate(journeyDate)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-900">
                      <Clock3 className="h-3 w-3 text-slate-400" />

                      <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">
                        {busDetails.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                {(boardingPoint || droppingPoint) && (
                  <div className="mt-4 space-y-2">
                    {boardingPoint && (
                      <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-emerald-500">
                            Boarding
                          </p>

                          <p className="text-[11px] font-black text-emerald-800 dark:text-emerald-300">
                            {boardingPoint}
                          </p>
                        </div>
                      </div>
                    )}

                    {droppingPoint && (
                      <div className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 dark:border-cyan-900/50 dark:bg-cyan-950/30">
                        <MapPin className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />

                        <div>
                          <p className="text-[8px] font-black uppercase tracking-wider text-cyan-500">
                            Dropping
                          </p>

                          <p className="text-[11px] font-black text-cyan-800 dark:text-cyan-300">
                            {droppingPoint}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Seats */}
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                      <Armchair className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      Seats
                    </p>

                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-600 dark:bg-red-950/50 dark:text-red-400">
                      {seats.length}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {seats.map((seat) => (
                      <span
                        key={seat}
                        className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-2.5 py-1 text-[10px] font-black text-white shadow-sm shadow-red-500/20"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fare */}
                <div className="mt-5 space-y-2.5 text-sm">
                  {fare.baseFare > 0 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400">
                        Base Fare
                      </span>

                      <span className="font-black text-slate-800 dark:text-slate-100">
                        ₹{formatCurrency(fare.baseFare)}
                      </span>
                    </div>
                  )}

                  {fare.platformFee > 0 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400">
                        Platform Fee
                      </span>

                      <span className="font-black text-slate-800 dark:text-slate-100">
                        ₹
                        {formatCurrency(fare.platformFee)}
                      </span>
                    </div>
                  )}

                  {fare.gst > 0 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400">
                        GST
                      </span>

                      <span className="font-black text-slate-800 dark:text-slate-100">
                        ₹{formatCurrency(fare.gst)}
                      </span>
                    </div>
                  )}

                  {appliedCoupon?.code &&
                    Number(fare.discountAmount) > 0 && (
                      <div className="flex justify-between gap-3 text-emerald-700 dark:text-emerald-400">
                        <span className="flex items-center gap-1 font-bold">
                          <Sparkles className="h-3.5 w-3.5" />
                          Coupon ({appliedCoupon.code})
                        </span>

                        <span className="font-black">
                          -₹
                          {formatCurrency(
                            fare.discountAmount,
                          )}
                        </span>
                      </div>
                    )}

                  {!appliedCoupon?.code &&
                    Number(fare.discountAmount) > 0 && (
                      <div className="flex justify-between gap-3 text-emerald-700 dark:text-emerald-400">
                        <span className="font-bold">
                          Discount
                        </span>

                        <span className="font-black">
                          -₹
                          {formatCurrency(
                            fare.discountAmount,
                          )}
                        </span>
                      </div>
                    )}
                </div>

                {/* Total */}
                <div className="mt-5 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-4 dark:from-red-950/40 dark:to-orange-950/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        Total Amount
                      </p>

                      <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                        Inclusive of taxes
                      </p>
                    </div>

                    <span className="flex items-center gap-0.5 text-2xl font-black text-red-600 dark:text-red-400">
                      <IndianRupee className="h-5 w-5" />
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 py-2.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  100% secure payment with Razorpay
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900">
            {/* Success header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 text-center text-white">
              <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/15 blur-2xl" />

              <div className="pointer-events-none absolute -bottom-16 right-0 h-40 w-40 rounded-full bg-teal-300/25 blur-2xl" />

              <div className="relative">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 backdrop-blur">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <h2 className="mt-4 text-2xl font-black">
                  Payment Successful!
                </h2>

                <p className="mt-1 text-sm font-medium text-emerald-50">
                  Your booking has been confirmed.
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">
                    Booking ID
                  </span>

                  <span className="max-w-[160px] truncate font-black text-slate-900 dark:text-white">
                    {bookingId}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">
                    Payment ID
                  </span>

                  <span className="max-w-[160px] truncate font-black text-slate-900 dark:text-white">
                    {paymentSuccess.paymentId}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500 dark:text-slate-400">
                    Amount Paid
                  </span>

                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    ₹{formatCurrency(amount)}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleViewTicket}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
                >
                  <Ticket className="h-4 w-4" />
                  View Ticket
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>

                <Link
                  to="/my-bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Download className="h-4 w-4" />
                  My Bookings
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Ticket sent to your registered email
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Payment;