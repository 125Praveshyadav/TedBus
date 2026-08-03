import { useCallback, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Armchair,
  BadgePercent,
  BusFront,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Tag,
  Ticket,
  User,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { bookingService } from "../../services/bookingService";
import couponService from "../../services/couponService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Date not selected";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) return date;

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

    if (!matchA || !matchB)
      return String(a).localeCompare(String(b));

    return (
      Number(matchA[1]) - Number(matchB[1]) ||
      matchA[2].localeCompare(matchB[2])
    );
  });
};

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const normalizeBus = (bus = {}, busId = "") => {
  const price =
    bus.price ||
    bus.fare ||
    bus.ticketPrice ||
    bus.baseFare ||
    bus.seatPrice ||
    0;

  return {
    ...bus,
    _id: bus._id || bus.id || busId,
    id: bus._id || bus.id || busId,
    name:
      bus.name ||
      bus.busName ||
      bus.operatorName ||
      "TedBus Partner",
    type:
      bus.type ||
      bus.busType ||
      bus.category ||
      "Standard Bus",
    source: bus.source || "Source",
    destination: bus.destination || "Destination",
    departure:
      bus.departure ||
      bus.departureTime ||
      bus.startTime ||
      "—",
    arrival:
      bus.arrival ||
      bus.arrivalTime ||
      bus.endTime ||
      "—",
    duration: bus.duration || "—",
    price,
  };
};

const normalizeBookingState = (state = {}) => {
  const bus = state.bus || state.busDetails || {};
  const busId = state.busId || bus._id || bus.id || "";

  const selectedSeats = sortSeats(
    state.selectedSeats || state.seats || [],
  );

  return {
    busId,
    busDetails: normalizeBus(bus, busId),
    selectedSeats,
    journeyDate:
      state.journeyDate ||
      bus.journeyDate ||
      state.date ||
      "",
    boardingPoint: state.boardingPoint || "",
    droppingPoint: state.droppingPoint || "",
    fare: state.fare || null,
    amount:
      state.amount || state?.fare?.totalAmount || 0,
  };
};

const createEmptyPassenger = (seatNumber) => ({
  seatNumber,
  name: "",
  age: "",
  gender: "",
});

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  icon: Icon,
  iconBg = "bg-red-50 dark:bg-red-950/40",
  iconColor = "text-red-600 dark:text-red-400",
  required = false,
  children,
}) => {
  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <div
            className={`pointer-events-none absolute left-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg transition ${
              hasError
                ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                : `${iconBg} ${iconColor}`
            }`}
          >
            <Icon className="h-3 w-3" />
          </div>
        )}

        {children || (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={name}
            aria-invalid={hasError}
            className={`h-11 w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
              Icon ? "pl-[2.75rem] pr-3" : "px-3"
            } ${
              hasError
                ? "border-red-400 ring-red-500/5 dark:border-red-800"
                : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
            }`}
          />
        )}
      </div>

      {hasError && (
        <p className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

/*
 * Calculate discount amount from coupon
 */
const calculateDiscount = (coupon, totalBeforeDiscount) => {
  if (!coupon) return 0;

  const discountType = String(
    coupon.discountType || "",
  ).toLowerCase();

  const discountValue = Number(coupon.discountValue || 0);
  const maxDiscount = Number(coupon.maxDiscount || 0);
  const minPurchase = Number(coupon.minPurchase || 0);

  if (totalBeforeDiscount < minPurchase) return 0;

  let discount = 0;

  if (discountType === "percentage") {
    discount = (totalBeforeDiscount * discountValue) / 100;

    if (maxDiscount > 0 && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else if (
    discountType === "flat" ||
    discountType === "fixed"
  ) {
    discount = discountValue;
  }

  return Math.min(discount, totalBeforeDiscount);
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const storedBookingState = safeJsonParse(
    sessionStorage.getItem("tedbus_pending_booking"),
  );

  const bookingState = useMemo(() => {
    return normalizeBookingState(
      location.state || storedBookingState || {},
    );
  }, [location.state, storedBookingState]);

  const {
    busId,
    busDetails,
    selectedSeats,
    journeyDate,
    boardingPoint,
    droppingPoint,
    fare,
    amount,
  } = bookingState;

  const [step, setStep] = useState("passengers");
  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [passengers, setPassengers] = useState(() =>
    selectedSeats.map(createEmptyPassenger),
  );

  const [contactDetails, setContactDetails] = useState({
    email: "",
    phone: "",
  });

  const [passengerErrors, setPassengerErrors] =
    useState({});
  const [contactErrors, setContactErrors] = useState({});

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const hasValidBookingData =
    Boolean(busId) &&
    Array.isArray(selectedSeats) &&
    selectedSeats.length > 0;

  const seatSelectionPath = busId
    ? `/seat-selection/${busId}${journeyDate ? `?date=${journeyDate}` : ""}`
    : "/search-bus";

  // Fare calculations with coupon
  const fareCalculation = useMemo(() => {
    const baseFare = fare?.baseFare || 0;
    const platformFee = fare?.platformFee || 0;
    const gst = fare?.gst || 0;
    const totalBeforeDiscount =
      baseFare + platformFee + gst;

    const discountAmount = calculateDiscount(
      appliedCoupon,
      totalBeforeDiscount,
    );

    const finalAmount = Math.max(
      totalBeforeDiscount - discountAmount,
      0,
    );

    return {
      baseFare,
      platformFee,
      gst,
      seatPrice: fare?.seatPrice || 0,
      totalBeforeDiscount,
      discountAmount,
      finalAmount,
    };
  }, [fare, appliedCoupon]);

  const handlePassengerChange = useCallback(
    (seatIndex, field, value) => {
      setPassengers((current) =>
        current.map((passenger, index) =>
          index === seatIndex
            ? {
                ...passenger,
                [field]:
                  field === "age"
                    ? value
                        .replace(/\D/g, "")
                        .slice(0, 3)
                    : value,
              }
            : passenger,
        ),
      );

      setPassengerErrors((current) => ({
        ...current,
        [`${seatIndex}-${field}`]: "",
      }));
    },
    [],
  );

  const handleContactChange = useCallback(
    (event) => {
      const { name, value } = event.target;

      const formattedValue =
        name === "phone"
          ? value.replace(/\D/g, "").slice(0, 10)
          : value;

      setContactDetails((current) => ({
        ...current,
        [name]: formattedValue,
      }));

      setContactErrors((current) => ({
        ...current,
        [name]: "",
      }));
    },
    [],
  );

  const validatePassengers = () => {
    const errors = {};
    let isValid = true;

    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        errors[`${index}-name`] = "Name is required";
        isValid = false;
      }

      if (!passenger.age) {
        errors[`${index}-age`] = "Age is required";
        isValid = false;
      } else {
        const ageNum = Number(passenger.age);

        if (ageNum < 1 || ageNum > 120) {
          errors[`${index}-age`] =
            "Valid age (1-120)";
          isValid = false;
        }
      }

      if (!passenger.gender) {
        errors[`${index}-gender`] =
          "Please select gender";
        isValid = false;
      }
    });

    const cErrors = {};

    if (!contactDetails.email.trim()) {
      cErrors.email = "Email is required";
      isValid = false;
    } else if (
      !EMAIL_REGEX.test(contactDetails.email.trim())
    ) {
      cErrors.email = "Enter valid email";
      isValid = false;
    }

    if (!contactDetails.phone.trim()) {
      cErrors.phone = "Phone is required";
      isValid = false;
    } else if (
      !PHONE_REGEX.test(contactDetails.phone.trim())
    ) {
      cErrors.phone = "Enter valid 10-digit number";
      isValid = false;
    }

    setPassengerErrors(errors);
    setContactErrors(cErrors);

    return isValid;
  };

  const handlePassengerSubmit = (event) => {
    event.preventDefault();

    if (!validatePassengers()) {
      toast.error("Please fill all required fields");
      return;
    }

    setStep("summary");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /*
   * Coupon handlers
   */
  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");
      setCouponSuccess("");

      /*
       * Try multiple API patterns:
       * 1. couponService.applyCoupon(code, amount)
       * 2. couponService.validateCoupon(code, amount)
       * 3. couponService.verifyCoupon(code, amount)
       */
      let response = null;

      const totalBeforeDiscount =
        fareCalculation.totalBeforeDiscount;

      if (typeof couponService.applyCoupon === "function") {
        response = await couponService.applyCoupon(
          code,
          totalBeforeDiscount,
        );
      } else if (
        typeof couponService.validateCoupon === "function"
      ) {
        response = await couponService.validateCoupon(
          code,
          totalBeforeDiscount,
        );
      } else if (
        typeof couponService.verifyCoupon === "function"
      ) {
        response = await couponService.verifyCoupon(
          code,
          totalBeforeDiscount,
        );
      } else {
        throw new Error(
          "Coupon validation service not available",
        );
      }

      const coupon =
        response?.coupon ||
        response?.data?.coupon ||
        response?.data ||
        response;

      if (!coupon || (!coupon.discountType && !coupon.discountValue)) {
        throw new Error("Invalid coupon response");
      }

      // Check minimum purchase
      const minPurchase = Number(
        coupon.minPurchase || 0,
      );

      if (
        minPurchase > 0 &&
        totalBeforeDiscount < minPurchase
      ) {
        setCouponError(
          `Minimum booking amount ₹${formatCurrency(minPurchase)} required for this coupon`,
        );
        return;
      }

      // Check expiry
      if (coupon.expiryDate) {
        const expiryTimestamp = new Date(
          coupon.expiryDate,
        ).getTime();

        if (
          !Number.isNaN(expiryTimestamp) &&
          expiryTimestamp < Date.now()
        ) {
          setCouponError("This coupon has expired");
          return;
        }
      }

      const discount = calculateDiscount(
        coupon,
        totalBeforeDiscount,
      );

      setAppliedCoupon({
        ...coupon,
        code: coupon.code || code,
      });

      setCouponSuccess(
        `🎉 Coupon applied! You save ₹${formatCurrency(discount)}`,
      );

      toast.success(
        `Coupon ${coupon.code || code} applied successfully!`,
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid or expired coupon code";

      setCouponError(message);
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");

    toast.info("Coupon removed");
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true);

      const passengerDetails = passengers.map((p) => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender,
        seatNumber: p.seatNumber,
      }));

      const bookingPayload = {
        busId,
        journeyDate,
        seatNumbers: selectedSeats,
        passengerDetails,
        contactDetails: {
          email: contactDetails.email.trim(),
          phone: contactDetails.phone.trim(),
        },
        boardingPoint: boardingPoint || undefined,
        droppingPoint: droppingPoint || undefined,
        couponCode: appliedCoupon?.code || undefined,
      };

      const response =
        await bookingService.createBooking(
          bookingPayload,
        );

      const booking =
        response?.booking ||
        response?.data?.booking ||
        null;

      const bookingId =
        booking?._id || booking?.id || "";

      if (!bookingId) {
        throw new Error(
          "Booking created but ID not received.",
        );
      }

      sessionStorage.removeItem(
        "tedbus_pending_booking",
      );

      toast.success(
        response?.message ||
          "Booking created successfully!",
      );

      navigate("/payment", {
        state: {
          bookingId,
          booking,
          busId,
          bus: busDetails,
          busDetails,
          journeyDate,
          boardingPoint,
          droppingPoint,
          seats: selectedSeats,
          selectedSeats,
          passengers: passengerDetails,
          contactDetails,
          appliedCoupon: appliedCoupon || null,
          fare: {
            ...fare,
            seatPrice: fareCalculation.seatPrice,
            baseFare: fareCalculation.baseFare,
            platformFee: fareCalculation.platformFee,
            gst: fareCalculation.gst,
            discountAmount:
              fareCalculation.discountAmount,
            totalAmount: fareCalculation.finalAmount,
          },
          amount: fareCalculation.finalAmount,
        },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create booking. Please try again.";

      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  const steps = [
    {
      key: "passengers",
      label: "Passenger Details",
      icon: UserRound,
    },
    {
      key: "summary",
      label: "Review & Pay",
      icon: WalletCards,
    },
  ];

  if (!hasValidBookingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 transition-colors duration-300 dark:bg-slate-950">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-2xl shadow-red-500/10 dark:border-red-900/50 dark:bg-slate-900 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />

          <div className="relative">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <AlertCircle className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
              Booking data missing
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
              Please select your bus and seats again to
              continue booking.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/search-bus"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
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
      {/* Compact sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl transition-colors duration-300 dark:border-slate-800/60 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={seatSelectionPath}
              state={{
                bus: busDetails,
                journeyDate,
              }}
              className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-red-900 dark:hover:text-red-400"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-black text-slate-900 dark:text-white sm:text-base">
                  {step === "passengers"
                    ? "Passenger Details"
                    : "Review & Pay"}
                </h1>

                <span className="hidden rounded-full bg-violet-100 px-2 py-0.5 text-[8px] font-black text-violet-700 dark:bg-violet-950/50 dark:text-violet-400 sm:inline">
                  STEP{" "}
                  {step === "passengers" ? "1" : "2"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:text-xs">
                <BusFront className="h-3 w-3" />

                <span className="truncate">
                  {busDetails.name}
                </span>

                <span className="text-slate-300 dark:text-slate-600">
                  •
                </span>

                <span className="truncate">
                  {busDetails.source} →{" "}
                  {busDetails.destination}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold dark:border-slate-700 dark:bg-slate-800/70 sm:flex">
              {steps.map((item, index) => {
                const active = step === item.key;
                const completed =
                  item.key === "passengers" &&
                  step === "summary";

                return (
                  <span
                    key={item.key}
                    className="flex items-center gap-1"
                  >
                    {index > 0 && (
                      <span className="mx-1 h-px w-3 bg-slate-300 dark:bg-slate-600" />
                    )}

                    <span
                      className={
                        completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : active
                            ? "text-violet-700 dark:text-violet-400"
                            : "text-slate-400 dark:text-slate-500"
                      }
                    >
                      {completed ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        item.label.split(" ")[0]
                      )}
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-white shadow-md shadow-red-500/20">
              <p className="text-[8px] font-black uppercase tracking-wider text-red-100">
                {appliedCoupon ? "After discount" : "Total"}
              </p>

              <p className="text-sm font-black sm:text-base">
                ₹
                {formatCurrency(
                  fareCalculation.finalAmount,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Trip info cards */}
          <div className="mb-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-red-100 bg-white p-3 shadow-sm dark:border-red-900/50 dark:bg-slate-900">
              <p className="text-[8px] font-black uppercase tracking-wider text-red-500 dark:text-red-400">
                Bus
              </p>

              <p className="mt-1 truncate text-xs font-black text-slate-900 dark:text-white">
                {busDetails.name}
              </p>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-white p-3 shadow-sm dark:border-violet-900/50 dark:bg-slate-900">
              <p className="text-[8px] font-black uppercase tracking-wider text-violet-500 dark:text-violet-400">
                Route
              </p>

              <p className="mt-1 truncate text-xs font-black text-slate-900 dark:text-white">
                {busDetails.source} →{" "}
                {busDetails.destination}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-3 shadow-sm dark:border-amber-900/50 dark:bg-slate-900">
              <p className="text-[8px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
                Date
              </p>

              <p className="mt-1 truncate text-xs font-black text-slate-900 dark:text-white">
                {formatJourneyDate(journeyDate)}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-white p-3 shadow-sm dark:border-cyan-900/50 dark:bg-slate-900">
              <p className="text-[8px] font-black uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
                Departure
              </p>

              <p className="mt-1 flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white">
                <Clock3 className="h-3 w-3 text-cyan-500" />
                {busDetails.departure}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <p className="text-[8px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Seats
              </p>

              <div className="mt-1 flex flex-wrap gap-1">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="text-xs font-black text-emerald-700 dark:text-emerald-300"
                  >
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: Passenger form */}
          {step === "passengers" && (
            <div className="grid items-start gap-5 lg:grid-cols-[1fr_340px]">
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
                <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-violet-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20 sm:p-5">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/15" />

                  <div className="relative flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/25">
                      <Users className="h-4 w-4" />
                    </div>

                    <div>
                      <h2 className="text-base font-black text-slate-900 dark:text-white sm:text-lg">
                        Passenger Details
                      </h2>

                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
                        Fill details for each
                        passenger
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handlePassengerSubmit}
                  noValidate
                  className="p-4 sm:p-5"
                >
                  <div className="space-y-5">
                    {passengers.map(
                      (passenger, index) => (
                        <div
                          key={passenger.seatNumber}
                          className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 text-[10px] font-black text-white shadow-sm">
                                {index + 1}
                              </span>
                              Passenger{" "}
                              {index + 1}
                            </p>

                            <span className="rounded-lg bg-red-100 px-2 py-0.5 text-[9px] font-black text-red-600 dark:bg-red-950/50 dark:text-red-400">
                              Seat{" "}
                              {passenger.seatNumber}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <FormField
                              label="Full Name"
                              name={`name-${index}`}
                              value={passenger.name}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="Full name"
                              error={
                                passengerErrors[
                                  `${index}-name`
                                ]
                              }
                              icon={User}
                              iconBg="bg-red-50 dark:bg-red-950/40"
                              iconColor="text-red-600 dark:text-red-400"
                              required
                            />

                            <FormField
                              label="Age"
                              name={`age-${index}`}
                              type="number"
                              value={passenger.age}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "age",
                                  e.target.value,
                                )
                              }
                              placeholder="Age"
                              error={
                                passengerErrors[
                                  `${index}-age`
                                ]
                              }
                              icon={CalendarDays}
                              iconBg="bg-amber-50 dark:bg-amber-950/40"
                              iconColor="text-amber-600 dark:text-amber-400"
                              required
                            />

                            <FormField
                              label="Gender"
                              name={`gender-${index}`}
                              error={
                                passengerErrors[
                                  `${index}-gender`
                                ]
                              }
                              icon={UserRound}
                              iconBg="bg-pink-50 dark:bg-pink-950/40"
                              iconColor="text-pink-600 dark:text-pink-400"
                              required
                            >
                              <select
                                id={`gender-${index}`}
                                name={`gender-${index}`}
                                value={
                                  passenger.gender
                                }
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "gender",
                                    e.target.value,
                                  )
                                }
                                required
                                className={`h-11 w-full cursor-pointer appearance-none rounded-xl border bg-slate-50 pl-[2.75rem] pr-3 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900 ${
                                  passengerErrors[
                                    `${index}-gender`
                                  ]
                                    ? "border-red-400 dark:border-red-800"
                                    : "border-slate-200 focus:border-red-500 focus:ring-red-500/10 dark:border-slate-700"
                                }`}
                              >
                                <option value="">
                                  Select
                                </option>
                                <option value="Male">
                                  Male
                                </option>
                                <option value="Female">
                                  Female
                                </option>
                                <option value="Other">
                                  Other
                                </option>
                              </select>
                            </FormField>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  {/* Contact details */}
                  <div className="mt-5 rounded-2xl border border-cyan-100 bg-white p-4 dark:border-cyan-900/50 dark:bg-slate-900">
                    <p className="mb-3 flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-300">
                      <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      Contact Details
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <FormField
                        label="Email"
                        name="email"
                        type="email"
                        value={contactDetails.email}
                        onChange={handleContactChange}
                        placeholder="you@example.com"
                        error={contactErrors.email}
                        icon={Mail}
                        iconBg="bg-cyan-50 dark:bg-cyan-950/40"
                        iconColor="text-cyan-600 dark:text-cyan-400"
                        required
                      />

                      <FormField
                        label="Phone"
                        name="phone"
                        type="tel"
                        value={contactDetails.phone}
                        onChange={handleContactChange}
                        placeholder="9876543210"
                        error={contactErrors.phone}
                        icon={Phone}
                        iconBg="bg-emerald-50 dark:bg-emerald-950/40"
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="group mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.98]"
                  >
                    Review Booking
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </div>

              {/* Mini summary sidebar */}
              <aside className="hidden lg:block">
                <div className="sticky top-[73px] rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-red-600 dark:text-red-400" />

                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      Trip Summary
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400">
                        Bus
                      </span>

                      <span className="truncate font-black text-slate-800 dark:text-slate-100">
                        {busDetails.name}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400">
                        Seats
                      </span>

                      <span className="font-black text-slate-800 dark:text-slate-100">
                        {selectedSeats.join(", ")}
                      </span>
                    </div>

                    {fare && (
                      <div className="border-t border-slate-100 pt-2.5 dark:border-slate-800">
                        <div className="flex justify-between gap-3">
                          <span className="font-black text-slate-700 dark:text-slate-300">
                            Total
                          </span>

                          <span className="font-black text-red-600 dark:text-red-400">
                            ₹{formatCurrency(amount)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    Secure booking
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* Step 2: Review & confirm */}
          {step === "summary" && (
            <div className="grid items-start gap-5 lg:grid-cols-[1fr_380px]">
              <div className="space-y-5">
                {/* Passengers review */}
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-violet-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-violet-950/20 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                        <Users className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white">
                          Passengers
                        </h2>

                        <p className="text-[10px] font-bold text-slate-400">
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
                          key={passenger.seatNumber}
                          className="flex items-center gap-3 p-4 sm:p-5"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-sm font-black text-white shadow-md shadow-red-500/20">
                            {passenger.name
                              .charAt(0)
                              .toUpperCase() || "P"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-slate-900 dark:text-white">
                              {passenger.name}
                            </p>

                            <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              Seat{" "}
                              {passenger.seatNumber} ·
                              Age {passenger.age} ·{" "}
                              {passenger.gender}
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

                {/* Contact review */}
                <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <p className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                    <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Contact
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2.5 dark:border-cyan-900/50 dark:bg-cyan-950/30">
                      <Mail className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />

                      <span className="truncate text-xs font-black text-cyan-800 dark:text-cyan-300">
                        {contactDetails.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                      <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />

                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                        {contactDetails.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coupon section */}
                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-amber-50/50 p-4 dark:border-slate-800 dark:from-slate-900 dark:to-amber-950/20 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                        <BadgePercent className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white">
                          Apply Coupon
                        </h2>

                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          Have a coupon code? Apply it
                          to save more.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    {appliedCoupon ? (
                      /* Applied coupon display */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>

                            <div>
                              <p className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                                {appliedCoupon.code}
                              </p>

                              <p className="mt-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                {appliedCoupon.discountType ===
                                "percentage"
                                  ? `${appliedCoupon.discountValue}% off`
                                  : `₹${formatCurrency(appliedCoupon.discountValue)} off`}

                                {appliedCoupon.maxDiscount >
                                  0 &&
                                  appliedCoupon.discountType ===
                                    "percentage" &&
                                  ` (max ₹${formatCurrency(appliedCoupon.maxDiscount)})`}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-100 dark:hover:bg-red-950/40"
                            title="Remove coupon"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/20">
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            You save
                          </span>

                          <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                            ₹
                            {formatCurrency(
                              fareCalculation.discountAmount,
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Coupon input */
                      <div className="space-y-3">
                        <div className="flex gap-2.5">
                          <div className="relative flex-1">
                            <div className="pointer-events-none absolute left-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <Tag className="h-3 w-3" />
                            </div>

                            <input
                              type="text"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(
                                  e.target.value
                                    .toUpperCase()
                                    .replace(
                                      /\s/g,
                                      "",
                                    ),
                                );

                                setCouponError("");
                                setCouponSuccess("");
                              }}
                              placeholder="Enter coupon code"
                              maxLength={20}
                              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-[2.75rem] pr-3 text-sm font-black uppercase tracking-wider text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:bg-slate-900"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            disabled={
                              couponLoading ||
                              !couponCode.trim()
                            }
                            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-amber-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0 active:scale-[0.98]"
                          >
                            {couponLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <BadgePercent className="h-4 w-4" />
                            )}

                            {couponLoading
                              ? "Checking..."
                              : "Apply"}
                          </button>
                        </div>

                        {couponError && (
                          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/30">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                            <p className="text-xs font-bold text-red-700 dark:text-red-400">
                              {couponError}
                            </p>
                          </div>
                        )}

                        {couponSuccess && (
                          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              {couponSuccess}
                            </p>
                          </div>
                        )}

                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                          Browse available coupons on
                          the{" "}
                          <Link
                            to="/offers"
                            className="font-bold text-red-600 underline dark:text-red-400"
                          >
                            Offers page
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit + Confirm */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("passengers");
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="group flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70 active:translate-y-0 active:scale-[0.98]"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Confirm & Pay ₹
                        {formatCurrency(
                          fareCalculation.finalAmount,
                        )}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Summary sidebar */}
              <aside>
                <div className="sticky top-[73px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white dark:border-slate-800">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/25 blur-2xl" />

                    <div className="relative flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-red-400 backdrop-blur">
                        <Ticket className="h-4 w-4" />
                      </div>

                      <h2 className="text-sm font-black">
                        Booking Summary
                      </h2>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Bus info */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-sm shadow-red-500/20">
                          <BusFront className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-xs font-black text-slate-900 dark:text-white">
                            {busDetails.name}
                          </h3>

                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {busDetails.source} →{" "}
                            {busDetails.destination}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/60">
                      <div className="flex items-center justify-between">
                        <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-700 dark:text-slate-300">
                          <Armchair className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                          Seats
                        </p>

                        <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-black text-red-600 dark:bg-red-950/50 dark:text-red-400">
                          {selectedSeats.length}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedSeats.map((seat) => (
                          <span
                            key={seat}
                            className="rounded-md bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 text-[9px] font-black text-white shadow-sm shadow-red-500/20"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Points */}
                    {(boardingPoint ||
                      droppingPoint) && (
                      <div className="mt-3 space-y-1.5">
                        {boardingPoint && (
                          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                            <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />

                            <p className="text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                              {boardingPoint}
                            </p>
                          </div>
                        )}

                        {droppingPoint && (
                          <div className="flex items-center gap-2 rounded-lg border border-cyan-100 bg-cyan-50 px-2.5 py-2 dark:border-cyan-900/50 dark:bg-cyan-950/30">
                            <MapPin className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />

                            <p className="text-[10px] font-black text-cyan-800 dark:text-cyan-300">
                              {droppingPoint}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fare breakdown */}
                    <div className="mt-4 space-y-2 text-xs">
                      {fareCalculation.seatPrice >
                        0 && (
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Seat Fare
                          </span>

                          <span className="font-black text-slate-800 dark:text-slate-100">
                            ₹
                            {formatCurrency(
                              fareCalculation.seatPrice,
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-3">
                        <span className="text-slate-500 dark:text-slate-400">
                          Seats
                        </span>

                        <span className="font-black text-slate-800 dark:text-slate-100">
                          {selectedSeats.length}
                        </span>
                      </div>

                      {fareCalculation.baseFare >
                        0 && (
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Base Fare
                          </span>

                          <span className="font-black text-slate-800 dark:text-slate-100">
                            ₹
                            {formatCurrency(
                              fareCalculation.baseFare,
                            )}
                          </span>
                        </div>
                      )}

                      {fareCalculation.platformFee >
                        0 && (
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            Platform Fee
                          </span>

                          <span className="font-black text-slate-800 dark:text-slate-100">
                            ₹
                            {formatCurrency(
                              fareCalculation.platformFee,
                            )}
                          </span>
                        </div>
                      )}

                      {fareCalculation.gst > 0 && (
                        <div className="flex justify-between gap-3">
                          <span className="text-slate-500 dark:text-slate-400">
                            GST
                          </span>

                          <span className="font-black text-slate-800 dark:text-slate-100">
                            ₹
                            {formatCurrency(
                              fareCalculation.gst,
                            )}
                          </span>
                        </div>
                      )}

                      {/* Coupon discount */}
                      {appliedCoupon &&
                        fareCalculation.discountAmount >
                          0 && (
                          <>
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                            <div className="flex justify-between gap-3 text-emerald-700 dark:text-emerald-400">
                              <span className="flex items-center gap-1 font-bold">
                                <BadgePercent className="h-3.5 w-3.5" />
                                Coupon (
                                {appliedCoupon.code})
                              </span>

                              <span className="font-black">
                                -₹
                                {formatCurrency(
                                  fareCalculation.discountAmount,
                                )}
                              </span>
                            </div>
                          </>
                        )}
                    </div>

                    {/* Total */}
                    <div className="mt-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 p-3 dark:from-red-950/40 dark:to-orange-950/20">
                      {/* Show original if discount applied */}
                      {appliedCoupon &&
                        fareCalculation.discountAmount >
                          0 && (
                          <div className="mb-1 flex items-center justify-between gap-3">
                            <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                              Original
                            </p>

                            <span className="text-sm font-black text-slate-400 line-through">
                              ₹
                              {formatCurrency(
                                fareCalculation.totalBeforeDiscount,
                              )}
                            </span>
                          </div>
                        )}

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[8px] font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                            {appliedCoupon
                              ? "After Discount"
                              : "Total"}
                          </p>

                          <p className="text-[9px] font-semibold text-slate-400">
                            Incl. taxes
                          </p>
                        </div>

                        <span className="flex items-center gap-0.5 text-xl font-black text-red-600 dark:text-red-400">
                          <IndianRupee className="h-4 w-4" />
                          {formatCurrency(
                            fareCalculation.finalAmount,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Savings badge */}
                    {appliedCoupon &&
                      fareCalculation.discountAmount >
                        0 && (
                        <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-[10px] font-black text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          You save ₹
                          {formatCurrency(
                            fareCalculation.discountAmount,
                          )}{" "}
                          with coupon!
                        </div>
                      )}

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Safe & secure booking
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Booking;