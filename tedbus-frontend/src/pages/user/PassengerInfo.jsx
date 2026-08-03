import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Ticket,
  User,
  UserRound,
  Users,
} from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Reusable Premium Form Field with Dynamic Color
const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  icon: Icon,
  accentColor = "red",
  required = false,
  children,
}) => {
  const hasError = Boolean(error);

  const colorMap = {
    red: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 focus-ring-red",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 focus-ring-blue",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 focus-ring-emerald",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 focus-ring-amber",
    violet: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 focus-ring-violet",
    pink: "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40 focus-ring-pink",
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 focus-ring-cyan",
  };

  const focusClass = {
    red: "focus:border-red-500 focus:ring-red-500/10",
    blue: "focus:border-blue-500 focus:ring-blue-500/10",
    emerald: "focus:border-emerald-500 focus:ring-emerald-500/10",
    amber: "focus:border-amber-500 focus:ring-amber-500/10",
    violet: "focus:border-violet-500 focus:ring-violet-500/10",
    pink: "focus:border-pink-500 focus:ring-pink-500/10",
    cyan: "focus:border-cyan-500 focus:ring-cyan-500/10",
  }[accentColor];

  const selectedColor = colorMap[accentColor] || colorMap.red;
  const [iconText, iconBg] = selectedColor.split(" bg-");

  return (
    <div>
      <label
        htmlFor={`passenger-${name}`}
        className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <div
            className={`pointer-events-none absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition ${
              hasError
                ? "bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400"
                : `bg-${iconBg.split(" ")[0]} ${iconText} ${iconBg.split(" ")[1] || ""}`
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}

        {children ? (
          children
        ) : (
          <input
            id={`passenger-${name}`}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            autoComplete={name}
            aria-invalid={hasError}
            className={`h-12 w-full rounded-xl border bg-slate-50 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900 ${
              Icon ? "pl-[3.25rem] pr-4" : "px-4"
            } ${
              hasError
                ? "border-red-400 ring-red-500/5 dark:border-red-800"
                : `border-slate-200 dark:border-slate-700 ${focusClass}`
            }`}
          />
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

const PassengerInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  if (!bookingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-slate-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl dark:border-red-900/50 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
            No booking data found
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
            Please select seats first before proceeding to passenger details.
          </p>
          <button
            type="button"
            onClick={() => navigate("/search-bus")}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:scale-105 active:scale-[0.98]"
          >
            Search Buses <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    );
  }

  const {
    busId,
    bus,
    busDetails,
    seats = [],
    selectedSeats = [],
    amount,
    journeyDate,
    boardingPoint,
    droppingPoint,
    fare,
  } = bookingData;

  const finalSeats = selectedSeats.length > 0 ? selectedSeats : seats;
  const busInfo = bus || busDetails || {};

  const busName = busInfo?.name || busInfo?.busName || busInfo?.operatorName || "TedBus Partner";
  const busType = busInfo?.type || busInfo?.busType || busInfo?.category || "Standard Bus";
  const source = busInfo?.source || "Source";
  const destination = busInfo?.destination || "Destination";
  const departure = busInfo?.departure || busInfo?.departureTime || "—";
  const arrival = busInfo?.arrival || busInfo?.arrivalTime || "—";

  const seatPrice = fare?.seatPrice || busInfo?.price || 0;
  const baseFare = fare?.baseFare || 0;
  const platformFee = fare?.platformFee || 0;
  const gst = fare?.gst || 0;
  const totalAmount = amount || fare?.totalAmount || 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    const formattedValue =
      name === "phone"
        ? value.replace(/\D/g, "").slice(0, 10)
        : name === "age"
        ? value.replace(/\D/g, "").slice(0, 3)
        : value;

    setFormData((current) => ({ ...current, [name]: formattedValue }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Please enter passenger's full name";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.age) {
      errors.age = "Please enter age";
    } else {
      const ageNum = Number(formData.age);
      if (ageNum < 1 || ageNum > 120) errors.age = "Valid age (1-120)";
    }

    if (!formData.gender) errors.gender = "Please select gender";

    if (!formData.phone.trim()) {
      errors.phone = "Please enter phone number";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = "Enter valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      errors.email = "Please enter email address";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = "Enter valid email address";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    navigate("/payment", {
      state: {
        ...bookingData,
        busId,
        seats: finalSeats,
        amount: totalAmount,
        passenger: formData,
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20 transition-colors duration-300 dark:bg-slate-950">
      
      {/* Compact Premium Header */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-orange-500/20" />
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-600/30 blur-[80px]" />
        
        <div className="relative mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* Left: Back Button & Title */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-md transition hover:bg-white/10 active:scale-95"
                title="Go Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
                  <UserRound className="h-3 w-3" /> Step 2 of 3
                </p>
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  Passenger Details
                </h1>
              </div>
            </div>

            {/* Right: Stepper */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 opacity-50">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[11px] font-bold text-white">Seats</span>
              </div>
              <div className="h-px w-4 bg-white/20" />
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                  2
                </span>
                <span className="text-[11px] font-bold text-white">Details</span>
              </div>
              <div className="h-px w-4 bg-white/20" />
              <div className="flex items-center gap-1.5 opacity-50">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/40 text-[9px] font-black text-white">
                  3
                </span>
                <span className="text-[11px] font-bold text-white">Payment</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Body Content */}
      <section className="relative z-10 mx-auto -mt-6 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Left Column: Form */}
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            {/* Form Header */}
            <div className="border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Primary Passenger
                  </h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Ticket details will be sent to this contact.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields with Different Premium Colors */}
            <div className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                
                {/* Name - Blue Theme */}
                <FormField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="As per Govt. ID"
                  error={fieldErrors.fullName}
                  icon={User}
                  accentColor="blue"
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Age - Amber Theme */}
                  <FormField
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    error={fieldErrors.age}
                    icon={CalendarDays}
                    accentColor="amber"
                    required
                  />

                  {/* Gender - Pink Theme */}
                  <FormField
                    label="Gender"
                    name="gender"
                    error={fieldErrors.gender}
                    icon={UserRound}
                    accentColor="pink"
                    required
                  >
                    <select
                      id="passenger-gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className={`h-12 w-full cursor-pointer appearance-none rounded-xl border bg-slate-50 pl-[3.25rem] pr-4 text-sm font-bold text-slate-900 outline-none transition focus:bg-white focus:ring-4 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900 ${
                        fieldErrors.gender
                          ? "border-red-400 ring-red-500/5 dark:border-red-800"
                          : "border-slate-200 focus:border-pink-500 focus:ring-pink-500/10 dark:border-slate-700"
                      }`}
                    >
                      <option value="" disabled hidden>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Phone - Emerald Theme */}
                  <FormField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile no."
                    error={fieldErrors.phone}
                    icon={Phone}
                    accentColor="emerald"
                    required
                  />

                  {/* Email - Violet Theme */}
                  <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    error={fieldErrors.email}
                    icon={Mail}
                    accentColor="violet"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30 active:translate-y-0 active:scale-[0.98]"
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Payment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center justify-center gap-1.5 pt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Your information is encrypted and secure.
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Ticket Style Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              
              {/* Summary Header */}
              <div className="bg-slate-950 p-5 text-white dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-red-400 backdrop-blur">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black">Booking Summary</h2>
                    <p className="text-[10px] font-medium text-slate-400">Review your trip details</p>
                  </div>
                </div>
              </div>

              {/* Summary Content */}
              <div className="p-5">
                
                {/* Bus Info */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20">
                    <BusFront className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-black text-slate-900 dark:text-white">
                      {busName}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      {busType}
                    </p>
                  </div>
                </div>

                {/* Route */}
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">From</p>
                    <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">{source}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <Clock3 className="h-3 w-3" /> {departure}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-px w-6 border-t border-dashed border-slate-300 dark:border-slate-600" />
                    <ArrowRight className="my-1 h-3 w-3 text-red-500" />
                    <div className="h-px w-6 border-t border-dashed border-slate-300 dark:border-slate-600" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">To</p>
                    <p className="mt-0.5 text-xs font-black text-slate-900 dark:text-white">{destination}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-slate-500">
                      {arrival} <Clock3 className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                {/* Date & Seats */}
                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Date</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200">{formatDate(journeyDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Seats</p>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200">{finalSeats.length}</p>
                    </div>
                    <Armchair className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>

                {/* Selected Seats Pills */}
                <div className="mt-4">
                  <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-slate-400">Selected Seats</p>
                  <div className="flex flex-wrap gap-1.5">
                    {finalSeats.map((seat) => (
                      <span
                        key={seat}
                        className="rounded-lg bg-red-100 px-2.5 py-1 text-[10px] font-black text-red-700 dark:bg-red-900/40 dark:text-red-400"
                      >
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Boarding / Dropping */}
                {(boardingPoint || droppingPoint) && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                    {boardingPoint && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Boarding Point</p>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{boardingPoint}</p>
                        </div>
                      </div>
                    )}
                    {droppingPoint && (
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-500" />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">Dropping Point</p>
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{droppingPoint}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ticket Cutouts */}
              <div className="relative flex items-center">
                <div className="h-6 w-6 -translate-x-3 rounded-full border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
                <div className="h-px flex-1 border-b-2 border-dashed border-slate-200 dark:border-slate-700" />
                <div className="h-6 w-6 translate-x-3 rounded-full border-l border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" />
              </div>

              {/* Fare Total */}
              <div className="bg-red-50 p-5 dark:bg-red-950/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Amount</p>
                    <p className="text-[9px] font-semibold text-slate-400">Taxes Included</p>
                  </div>
                  <div className="flex items-center text-2xl font-black text-red-600 dark:text-red-400">
                    <IndianRupee className="h-5 w-5" />
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default PassengerInfo;