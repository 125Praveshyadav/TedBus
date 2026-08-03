import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Armchair,
  BadgePercent,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Tag,
  Ticket,
  UserRound,
  X,
} from "lucide-react";

import { bookingService } from "../../services/bookingService";
import { couponService } from "../../services/couponService";

const GST_RATE = 0.05;
const DEFAULT_PLATFORM_FEE = 20;

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Journey date not selected";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    const fallback = new Date(date);

    if (Number.isNaN(fallback.getTime())) return date;

    return fallback.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const sortSeats = (seats = []) => {
  return [...seats].sort((a, b) => {
    const matchA = String(a).match(/(\d+)([A-D])/);
    const matchB = String(b).match(/(\d+)([A-D])/);

    if (!matchA || !matchB) return String(a).localeCompare(String(b));

    return (
      Number(matchA[1]) - Number(matchB[1]) ||
      matchA[2].localeCompare(matchB[2])
    );
  });
};

const normalizePassengerList = (
  selectedSeats = [],
  passengers = {},
  contactDetails = {},
) => {
  if (Array.isArray(passengers)) {
    return passengers.map((passenger, index) => ({
      ...passenger,
      seatNo:
        passenger.seatNo || passenger.seatNumber || selectedSeats[index] || "",
      email: passenger.email || contactDetails.email || "",
      phone: passenger.phone || contactDetails.phone || "",
    }));
  }

  return selectedSeats.map((seat) => {
    const passenger = passengers?.[seat] || {};

    return {
      seatNo: seat,
      seatNumber: seat,
      name: passenger.name || "",
      age: passenger.age || "",
      gender: passenger.gender || "",
      email: passenger.email || contactDetails.email || "",
      phone: passenger.phone || contactDetails.phone || "",
    };
  });
};

const BookingSummary = ({
  busDetails,
  selectedSeats = [],
  passengers = {},

  journeyDate,
  boardingPoint,
  droppingPoint,
  contactDetails = {},
  emergencyContact = {},
  fare,
  appliedCoupon: appliedCouponProp,
}) => {
  const navigate = useNavigate();

  const [creatingBooking, setCreatingBooking] = useState(false);
  const [error, setError] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(appliedCouponProp || null);

  const sortedSeats = useMemo(() => sortSeats(selectedSeats), [selectedSeats]);

  const passengerList = useMemo(() => {
    return normalizePassengerList(sortedSeats, passengers, contactDetails);
  }, [sortedSeats, passengers, contactDetails]);

  const busId = busDetails?._id || busDetails?.id;

  const pricePerSeat = Number(
    fare?.seatPrice ||
      busDetails?.price ||
      busDetails?.fare ||
      busDetails?.ticketPrice ||
      busDetails?.baseFare ||
      0,
  );

  const totalSeats = sortedSeats.length;
  const baseFare = Number(fare?.baseFare ?? pricePerSeat * totalSeats);
  const gst = Number(fare?.gst ?? Math.round(baseFare * GST_RATE));
  const platformFee = Number(
    fare?.platformFee ?? (totalSeats > 0 ? DEFAULT_PLATFORM_FEE : 0),
  );

  const grossTotal = baseFare + gst + platformFee;

  const discountAmount = Number(
    appliedCoupon?.discountAmount || appliedCoupon?.discount || 0,
  );

  const payableAmount = Math.max(grossTotal - discountAmount, 0);

  const source = busDetails?.source || "Source";
  const destination = busDetails?.destination || "Destination";

  const departure =
    busDetails?.departure ||
    busDetails?.departureTime ||
    busDetails?.startTime ||
    "—";

  const arrival =
    busDetails?.arrival ||
    busDetails?.arrivalTime ||
    busDetails?.endTime ||
    "—";

  const duration = busDetails?.duration || "—";

  const busName =
    busDetails?.name ||
    busDetails?.busName ||
    busDetails?.operatorName ||
    "TedBus Partner";

  const busType =
    busDetails?.type ||
    busDetails?.busType ||
    busDetails?.category ||
    "Standard Bus";

  const handleApplyCoupon = async () => {
    setCouponError("");
    setCouponMessage("");

    const trimmedCode = couponCode.trim().toUpperCase();

    if (!trimmedCode) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (grossTotal <= 0) {
      setCouponError("Add seats first to apply a coupon");
      return;
    }

    try {
      setApplyingCoupon(true);

      const response = await couponService.validateCoupon({
        code: trimmedCode,
        amount: grossTotal,
      });

      const responseCoupon = response?.coupon || response?.data?.coupon || null;

      const responseDiscount = Number(
        response?.discountAmount || response?.data?.discountAmount || 0,
      );

      if (!responseCoupon || responseDiscount <= 0) {
        throw new Error("Coupon is not valid for this booking");
      }

      setAppliedCoupon({
        ...responseCoupon,
        code: responseCoupon.code || trimmedCode,
        discountAmount: responseDiscount,
      });

      setCouponMessage(
        response?.message || `Coupon applied. You saved ₹${responseDiscount}`,
      );
    } catch (err) {
      setCouponError(err?.message || "Unable to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");
  };

  const validateSummary = () => {
    if (!busId) {
      setError("Bus details missing. Please search and select bus again.");
      return false;
    }

    if (!journeyDate && !busDetails?.journeyDate) {
      setError("Journey date missing. Please select journey date again.");
      return false;
    }

    if (sortedSeats.length === 0) {
      setError("Please select at least one seat.");
      return false;
    }

    const invalidPassenger = passengerList.find(
      (passenger) =>
        !passenger.name ||
        !passenger.age ||
        !passenger.gender ||
        !passenger.seatNo ||
        !passenger.email ||
        !passenger.phone,
    );

    if (invalidPassenger) {
      setError(
        "Passenger details are incomplete. Name, email, phone, age and gender are required.",
      );
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    setError("");

    if (!validateSummary()) return;

    try {
      setCreatingBooking(true);

      const finalJourneyDate = journeyDate || busDetails?.journeyDate;

      const passengerDetails = passengerList.map((passenger) => ({
        seatNumber: passenger.seatNo,
        name: passenger.name,
        email: passenger.email,
        phone: passenger.phone,
        age: Number(passenger.age),
        gender: passenger.gender,
      }));

      const bookingPayload = {
        busId,
        seatNumbers: sortedSeats,
        passengerDetails,

        contactDetails,
        emergencyContact,

        journeyDate: finalJourneyDate,
        boardingPoint,
        droppingPoint,

        fare: {
          pricePerSeat,
          baseFare,
          gst,
          platformFee,
          discountAmount,
          couponCode: appliedCoupon?.code || null,
          totalAmount: payableAmount,
        },

        totalAmount: payableAmount,
        amount: payableAmount,

        couponCode: appliedCoupon?.code || null,
        discountAmount,
      };

      const response = await bookingService.createBooking(bookingPayload);

      const booking =
        response?.booking || response?.data?.booking || response?.data || null;

      const bookingId =
        booking?._id ||
        booking?.id ||
        response?.bookingId ||
        response?.data?.bookingId;

      if (!bookingId) {
        throw new Error("Booking created but booking ID not received.");
      }

      navigate("/payment", {
        state: {
          bookingId,
          booking,
          busId,
          busDetails,
          journeyDate: finalJourneyDate,
          boardingPoint,
          droppingPoint,
          seats: sortedSeats,
          passengers: passengerList,
          fare: {
            pricePerSeat,
            baseFare,
            gst,
            platformFee,
            discountAmount,
            totalAmount: payableAmount,
          },
          amount: payableAmount,
          appliedCoupon,
        },
      });
    } catch (err) {
      setError(err?.message || "Unable to create booking. Please try again.");
    } finally {
      setCreatingBooking(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
      {/* Left Side */}
      <div className="space-y-5 lg:col-span-2">
        {/* Trip Summary */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 text-white dark:from-red-700 dark:via-red-600 dark:to-orange-600 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur sm:text-sm">
                  <Ticket className="h-4 w-4" />
                  Booking Summary
                </div>

                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  Review Your Journey
                </h2>

                <p className="mt-2 text-sm font-semibold text-red-50">
                  Confirm trip, seats and passenger details before payment.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white/15 px-4 py-3 text-sm font-black backdrop-blur">
                {totalSeats} Seat{totalSeats === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Bus Details */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-black text-red-600 dark:text-red-400">
                    <BusFront className="h-4 w-4" />
                    Bus Details
                  </div>

                  <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                    {busName}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">
                    {busType}
                  </p>
                </div>

                <div className="shrink-0 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                  ID: {busId || "N/A"}
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    From
                  </p>
                  <h4 className="mt-2 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                    {source}
                  </h4>
                  <p className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <Clock3 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    {departure}
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex w-full flex-row items-center justify-center gap-2 md:flex-col md:gap-0">
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700 md:hidden" />
                    <div className="hidden h-px w-20 bg-slate-300 dark:bg-slate-700 md:block md:w-28" />
                    <span className="my-0 whitespace-nowrap rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 dark:bg-red-950/40 dark:text-red-400 md:my-2">
                      {duration}
                    </span>
                    <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700 md:hidden" />
                    <div className="hidden h-px w-20 bg-slate-300 dark:bg-slate-700 md:block md:w-28" />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4 dark:bg-slate-900 md:text-right">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    To
                  </p>
                  <h4 className="mt-2 text-lg font-black text-slate-900 dark:text-white sm:text-xl">
                    {destination}
                  </h4>
                  <p className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 md:justify-end">
                    <Clock3 className="h-4 w-4 text-red-600 dark:text-red-400" />
                    {arrival}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Journey Date
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <CalendarDays className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    {formatJourneyDate(journeyDate || busDetails?.journeyDate)}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Boarding
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <MapPin className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    {boardingPoint || "Not selected"}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 dark:bg-slate-900">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Dropping
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-100">
                    <MapPin className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                    {droppingPoint || "Not selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Seats */}
            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
              <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white sm:text-lg">
                <Armchair className="h-5 w-5 text-red-600 dark:text-red-400" />
                Selected Seats ({sortedSeats.length})
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {sortedSeats.length > 0 ? (
                  sortedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-sm font-black text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {seat}
                    </span>
                  ))
                ) : (
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    No seats selected
                  </p>
                )}
              </div>
            </div>

            {/* Passengers */}
            <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
              <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white sm:text-lg">
                <UserRound className="h-5 w-5 text-red-600 dark:text-red-400" />
                Passengers ({passengerList.length})
              </h3>

              <div className="mt-3 space-y-3">
                {passengerList.map((passenger) => (
                  <div
                    key={passenger.seatNo}
                    className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-slate-900 dark:text-white">
                        {passenger.name || "Passenger Name Missing"}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Seat {passenger.seatNo} • Age: {passenger.age || "N/A"}{" "}
                        • {passenger.gender || "N/A"}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-800 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                      ₹{formatCurrency(pricePerSeat)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Info */}
        <section className="rounded-3xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/40 dark:bg-blue-950/30 sm:p-6">
          <h4 className="flex items-center gap-2 text-base font-black text-blue-900 dark:text-blue-200 sm:text-lg">
            <ShieldCheck className="h-5 w-5" />
            Important Information
          </h4>

          <ul className="mt-4 grid gap-3 text-sm font-semibold text-blue-800 dark:text-blue-300 sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Carry a valid ID proof during journey.
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Ticket confirmation will be sent after payment.
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Reach boarding point at least 20 minutes early.
            </li>

            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Cancellation depends on operator policy.
            </li>
          </ul>
        </section>
      </div>

      {/* Right Side */}
      <aside className="lg:col-span-1">
        <div className="sticky top-6 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm dark:border-red-900/50 dark:bg-slate-900">
          <div className="bg-slate-900 p-5 text-white dark:bg-slate-950 sm:p-6">
            <h3 className="text-lg font-black sm:text-xl">Price Breakdown</h3>

            <p className="mt-1 text-sm font-semibold text-slate-300">
              Transparent fare details
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                <p className="flex items-start gap-2 text-sm font-bold text-red-700 dark:text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3 border-b border-slate-100 pb-5 text-sm dark:border-slate-800">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Base Fare ({totalSeats} × ₹{formatCurrency(pricePerSeat)})
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹{formatCurrency(baseFare)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  GST (5%)
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹{formatCurrency(gst)}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Platform Fee
                </span>
                <span className="font-black text-slate-900 dark:text-white">
                  ₹{formatCurrency(platformFee)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between gap-4 text-green-700 dark:text-green-400">
                  <span className="flex items-center gap-1 font-bold">
                    <BadgePercent className="h-4 w-4" />
                    Discount
                    {appliedCoupon?.code ? ` (${appliedCoupon.code})` : ""}
                  </span>

                  <span className="font-black">
                    -₹{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
            </div>

            {/* COUPON SECTION */}
            <div className="my-5">
              <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Tag className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                Apply Coupon
              </p>

              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon code"
                      className={`w-full min-w-0 rounded-xl border bg-slate-50 px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:bg-slate-950 dark:text-slate-200 dark:focus:border-red-500 ${
                        couponError
                          ? "border-red-300 dark:border-red-800"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={applyingCoupon}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {applyingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {couponError && (
                    <p className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {couponError}
                    </p>
                  )}

                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Find active offers in the Offers section.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-3 dark:border-green-900/40 dark:bg-green-950/30">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-black text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {appliedCoupon.code} applied
                      </p>

                      <p className="mt-1 text-xs font-bold text-green-800 dark:text-green-300">
                        You saved ₹{formatCurrency(discountAmount)}
                      </p>

                      {couponMessage && (
                        <p className="mt-1 text-[11px] font-semibold text-green-700 dark:text-green-400">
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="shrink-0 rounded-xl bg-white p-2 text-red-600 transition hover:bg-red-50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40"
                      title="Remove coupon"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
              <span className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
                Payable Amount
              </span>

              <span className="text-2xl font-black text-red-600 dark:text-red-400 sm:text-3xl">
                ₹{formatCurrency(payableAmount)}
              </span>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={creatingBooking || totalSeats === 0}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-sm font-black transition ${
                creatingBooking || totalSeats === 0
                  ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                  : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98] dark:shadow-red-900/30"
              }`}
            >
              {creatingBooking ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Booking...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              Secure payment powered by TedBus
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
              By proceeding, you agree to TedBus terms, cancellation and refund
              policies.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default BookingSummary;