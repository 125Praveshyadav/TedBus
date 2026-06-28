import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BusFront,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Ticket,
  UserRound,
  WalletCards,
  XCircle,
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
  if (!date) return "Journey date not available";

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
  const bus = state.busDetails || booking?.bus || {};

  const bookingId =
    state.bookingId ||
    booking?._id ||
    booking?.id ||
    "";

  const fare = state.fare || booking?.fareBreakup || {};

  const amount =
    state.amount ||
    fare.totalAmount ||
    booking?.totalAmount ||
    0;

  const seats =
    state.seats ||
    booking?.seatNumbers ||
    booking?.passengerDetails?.map((p) => p.seatNumber).filter(Boolean) ||
    [];

  const passengers =
    state.passengers ||
    booking?.passengerDetails ||
    [];

  return {
    bookingId,
    booking,
    busDetails: {
      ...bus,
      name: bus?.name || bus?.busName || bus?.operatorName || "TedBus Partner",
      type: bus?.type || bus?.busType || bus?.category || "Standard Bus",
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
      state.boardingPoint ||
      booking?.boardingPoint ||
      "",
    droppingPoint:
      state.droppingPoint ||
      booking?.droppingPoint ||
      "",
    seats,
    passengers,
    fare: {
      pricePerSeat:
        fare.pricePerSeat ||
        state?.fare?.pricePerSeat ||
        0,
      baseFare:
        fare.baseFare ||
        state?.fare?.baseFare ||
        0,
      gst:
        fare.gst ||
        state?.fare?.gst ||
        0,
      platformFee:
        fare.platformFee ||
        state?.fare?.platformFee ||
        0,
      discountAmount:
        fare.discountAmount ||
        state?.fare?.discountAmount ||
        0,
      totalAmount: amount,
    },
    amount,
    appliedCoupon:
    state.appliedCoupon ||
    booking?.appliedCoupon ||
    null,
  };
};

const Payment = () => {
  console.log("NEW PAYMENT PAGE LOADED");

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
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState("");

  useEffect(() => {
    if (!bookingId) {
      setPageError(
        "Booking ID missing. Please create booking again before payment."
      );
    }
  }, [bookingId]);

  const openRazorpayCheckout = async () => {
    setPageError("");
    setPaymentFailed("");

    if (!bookingId) {
      setPageError("Booking ID missing. Please go back and create booking again.");
      return;
    }

    try {
      setCreatingOrder(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check internet connection.");
      }

      const orderResponse = await bookingService.createPaymentOrder(bookingId);

      const order =
        orderResponse?.order ||
        orderResponse?.data?.order;

      if (!order?.id) {
        throw new Error("Unable to create Razorpay order.");
      }
     console.log("FRONTEND ENV =>", import.meta.env);
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
     console.log("FRONTEND ENV =>", import.meta.env);
      if (!key) {
        throw new Error("Razorpay key missing. Add VITE_RAZORPAY_KEY_ID in .env");
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "TedBus",
        description: `Bus Ticket Booking - ${bookingId}`,
        order_id: order.id,

        prefill: {
          name:
            user?.name ||
            passengers?.[0]?.name ||
            "",
          email:
            user?.email ||
            passengers?.[0]?.email ||
            "",
          contact:
            user?.phone ||
            passengers?.[0]?.phone ||
            "",
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
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verifyResponse = await bookingService.verifyPayment(
              verifyPayload
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

            sessionStorage.removeItem("tedbus_pending_booking");
          } catch (error) {
            setPaymentFailed(
              error?.message || "Payment verification failed. Please contact support."
            );
          } finally {
            setVerifyingPayment(false);
          }
        },

        modal: {
          ondismiss: function () {
            setPaymentFailed("Payment was cancelled. You can retry payment.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setPaymentFailed(
          response?.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      setPageError(error?.message || "Unable to start payment.");
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleViewTicket = () => {
    const finalBookingId =
      paymentSuccess?.booking?._id ||
      paymentSuccess?.booking?.id ||
      bookingId;

    navigate(`/ticket`, {
      state: {
        bookingId: finalBookingId,
        booking: paymentSuccess?.booking || booking,
        payment: paymentSuccess,
      },
    });
  };

  if (pageError && !bookingId) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Payment unavailable
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-6 text-slate-600">
            {pageError}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/search-bus"
              className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
            >
              Search Buses
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Summary
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                <Lock className="h-4 w-4" />
                Secure Payment
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Complete Your Payment
              </h1>

              <p className="mt-2 text-sm font-semibold text-red-50">
                Booking ID: {bookingId}
              </p>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs font-bold text-red-50">Payable Amount</p>

              <h2 className="mt-1 text-4xl font-black">
                ₹{formatCurrency(amount)}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="space-y-6">
            {/* Payment Method Card */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600">
                    <WalletCards className="h-4 w-4" />
                    Razorpay Gateway
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    Pay Securely with Razorpay
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
                    Choose UPI, cards, net banking, wallets or other payment
                    options directly inside the Razorpay secure checkout.
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-50 text-red-600">
                  <CreditCard className="h-7 w-7" />
                </div>
              </div>

              {pageError && (
                <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <p className="flex items-start gap-2 text-sm font-bold text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {pageError}
                  </p>
                </div>
              )}

              {paymentFailed && (
                <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="flex items-start gap-2 text-sm font-bold text-amber-800">
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {paymentFailed}
                  </p>
                </div>
              )}

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <ShieldCheck className="h-6 w-6 text-green-600" />
                  <h3 className="mt-3 text-sm font-black text-slate-900">
                    100% Secure
                  </h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                    Bank-grade security with Razorpay.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                  <h3 className="mt-3 text-sm font-black text-slate-900">
                    Multiple Methods
                  </h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                    UPI, cards, wallets and net banking.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <Ticket className="h-6 w-6 text-red-600" />
                  <h3 className="mt-3 text-sm font-black text-slate-900">
                    Instant Ticket
                  </h3>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
                    Ticket generated after payment verification.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openRazorpayCheckout}
                disabled={creatingOrder || verifyingPayment}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition ${
                  creatingOrder || verifyingPayment
                    ? "cursor-not-allowed bg-slate-200 text-slate-400"
                    : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
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
                  </>
                )}
              </button>
            </div>

            {/* Passengers */}
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
                <UserRound className="h-5 w-5 text-red-600" />
                Passenger Details
              </h2>

              <div className="mt-5 space-y-3">
                {passengers.length > 0 ? (
                  passengers.map((passenger, index) => (
                    <div
                      key={`${passenger.seatNumber || passenger.seatNo}-${index}`}
                      className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-black text-slate-900">
                          {passenger.name || "Passenger"}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          Seat{" "}
                          {passenger.seatNumber ||
                            passenger.seatNo ||
                            passenger.seat ||
                            seats[index] ||
                            "N/A"}{" "}
                          • Age: {passenger.age || "N/A"} •{" "}
                          {passenger.gender || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-slate-500">
                    Passenger details unavailable.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="bg-slate-900 p-6 text-white">
                <h2 className="text-xl font-black">Booking Summary</h2>

                <p className="mt-1 text-sm font-semibold text-slate-300">
                  Review before payment
                </p>
              </div>

              <div className="p-6">
                {/* Bus */}
                <div className="border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <BusFront className="h-6 w-6" />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900">
                        {busDetails.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {busDetails.type}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                          From
                        </p>
                        <p className="mt-1 font-black text-slate-800">
                          {busDetails.source}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {busDetails.departure}
                        </p>
                      </div>

                      <div className="h-px flex-1 border-t border-dashed border-slate-300" />

                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                          To
                        </p>
                        <p className="mt-1 font-black text-slate-800">
                          {busDetails.destination}
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {busDetails.arrival}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Date
                        </p>
                        <p className="mt-1 flex items-center gap-1 font-bold text-slate-700">
                          <CalendarDays className="h-4 w-4 text-red-600" />
                          {formatJourneyDate(journeyDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 font-bold text-slate-700">
                          {busDetails.duration}
                        </p>
                      </div>
                    </div>

                    {(boardingPoint || droppingPoint) && (
                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                        {boardingPoint && (
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Boarding
                            </p>
                            <p className="mt-1 flex items-center gap-1 font-bold text-slate-700">
                              <MapPin className="h-4 w-4 text-red-600" />
                              {boardingPoint}
                            </p>
                          </div>
                        )}

                        {droppingPoint && (
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Dropping
                            </p>
                            <p className="mt-1 flex items-center gap-1 font-bold text-slate-700">
                              <MapPin className="h-4 w-4 text-red-600" />
                              {droppingPoint}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Selected Seats
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {seats.map((seat) => (
                        <span
                          key={seat}
                          className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-black text-red-600"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fare */}
                <div className="space-y-3 border-b border-slate-100 py-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Base Fare</span>
                    <span className="font-black text-slate-900">
                      ₹{formatCurrency(fare.baseFare)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">Platform Fee</span>
                    <span className="font-black text-slate-900">
                      ₹{formatCurrency(fare.platformFee)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">GST</span>
                    <span className="font-black text-slate-900">
                      ₹{formatCurrency(fare.gst)}
                    </span>
                  </div>
                  {appliedCoupon?.code && Number(fare.discountAmount) > 0 && (
  <div className="flex justify-between gap-4 text-green-700">
    <span className="flex items-center gap-1 font-bold">
      Coupon ({appliedCoupon.code})
    </span>
    <span className="font-black">
      -₹{formatCurrency(fare.discountAmount)}
    </span>
  </div>
)}

                  {Number(fare.discountAmount) > 0 && (
                    <div className="flex justify-between gap-4 text-green-700">
                      <span className="font-bold">Discount</span>
                      <span className="font-black">
                        -₹{formatCurrency(fare.discountAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-slate-900">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-red-600">
                      ₹{formatCurrency(amount)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-green-50 p-4 text-xs font-bold text-green-700">
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
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Payment Successful!
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Your booking has been confirmed successfully.
            </p>

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-left text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-black text-slate-900">
                  {bookingId}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Payment ID</span>
                <span className="max-w-[180px] truncate font-black text-slate-900">
                  {paymentSuccess.paymentId}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-black text-green-600">
                  ₹{formatCurrency(amount)}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleViewTicket}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700"
              >
                <Ticket className="h-4 w-4" />
                View Ticket
              </button>

              <Link
                to="/my-bookings"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                My Bookings
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Payment;