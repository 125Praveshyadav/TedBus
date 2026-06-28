import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Armchair,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

const createPassengerState = (selectedSeats = [], existingPassengers = {}) => {
  return selectedSeats.reduce((acc, seat) => {
    acc[seat] = {
      name: existingPassengers?.[seat]?.name || "",
      age: existingPassengers?.[seat]?.age || "",
      gender: existingPassengers?.[seat]?.gender || "",
    };

    return acc;
  }, {});
};

const sortSeats = (seats = []) => {
  return [...seats].sort((a, b) => {
    const matchA = String(a).match(/(\d+)([A-D])/);
    const matchB = String(b).match(/(\d+)([A-D])/);

    if (!matchA || !matchB) {
      return String(a).localeCompare(String(b));
    }

    return (
      Number(matchA[1]) - Number(matchB[1]) ||
      matchA[2].localeCompare(matchB[2])
    );
  });
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

const PassengerForm = ({
  selectedSeats = [],
  onSubmit,

  // Optional values from Booking.jsx when user comes back from summary
  initialPassengers = {},
  contactDetails: initialContactDetails = {},
  emergencyContact: initialEmergencyContact = {},
}) => {
  const sortedSeats = useMemo(() => {
    return sortSeats(selectedSeats);
  }, [selectedSeats]);

  const [passengers, setPassengers] = useState(() =>
    createPassengerState(sortedSeats, initialPassengers)
  );

  const [contactDetails, setContactDetails] = useState({
    email: initialContactDetails?.email || "",
    phone: initialContactDetails?.phone || "",
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: initialEmergencyContact?.name || "",
    phone: initialEmergencyContact?.phone || "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setPassengers((prev) => createPassengerState(sortedSeats, prev));
  }, [sortedSeats]);

  const clearFieldError = (key) => {
    setErrors((prev) => ({
      ...prev,
      [key]: "",
      general: "",
    }));
  };

  const handlePassengerChange = (seat, field, value) => {
    setPassengers((prev) => ({
      ...prev,
      [seat]: {
        ...prev[seat],
        [field]: value,
      },
    }));

    clearFieldError(`${seat}-${field}`);
  };

  const handleContactChange = (field, value) => {
    const formattedValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setContactDetails((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    clearFieldError(`contact-${field}`);
  };

  const handleEmergencyChange = (field, value) => {
    const formattedValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;

    setEmergencyContact((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));

    clearFieldError(`emergency-${field}`);
  };

  const validateForm = () => {
    const newErrors = {};

    if (sortedSeats.length === 0) {
      newErrors.general = "No seats selected. Please go back and select seats.";
    }

    if (!contactDetails.email.trim()) {
      newErrors["contact-email"] = "Email is required";
    } else if (!isValidEmail(contactDetails.email.trim())) {
      newErrors["contact-email"] = "Please enter a valid email address";
    }

    if (!contactDetails.phone.trim()) {
      newErrors["contact-phone"] = "Phone number is required";
    } else if (!isValidPhone(contactDetails.phone.trim())) {
      newErrors["contact-phone"] =
        "Enter a valid 10-digit Indian mobile number";
    }

    sortedSeats.forEach((seat) => {
      const passenger = passengers[seat] || {};

      if (!passenger.name.trim()) {
        newErrors[`${seat}-name`] = "Passenger name is required";
      } else if (passenger.name.trim().length < 3) {
        newErrors[`${seat}-name`] = "Name must be at least 3 characters";
      }

      if (!passenger.age) {
        newErrors[`${seat}-age`] = "Age is required";
      } else if (
        Number(passenger.age) < 1 ||
        Number(passenger.age) > 100
      ) {
        newErrors[`${seat}-age`] = "Enter a valid age between 1 and 100";
      }

      if (!passenger.gender) {
        newErrors[`${seat}-gender`] = "Gender is required";
      }
    });

    const emergencyNameFilled = emergencyContact.name.trim();
    const emergencyPhoneFilled = emergencyContact.phone.trim();

    if (emergencyNameFilled || emergencyPhoneFilled) {
      if (!emergencyNameFilled) {
        newErrors["emergency-name"] = "Emergency contact name is required";
      }

      if (!emergencyPhoneFilled) {
        newErrors["emergency-phone"] = "Emergency phone number is required";
      } else if (!isValidPhone(emergencyPhoneFilled)) {
        newErrors["emergency-phone"] =
          "Enter a valid 10-digit emergency phone number";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    onSubmit?.({
      passengers,
      contactDetails: {
        email: contactDetails.email.trim().toLowerCase(),
        phone: contactDetails.phone.trim(),
      },
      emergencyContact: {
        name: emergencyContact.name.trim(),
        phone: emergencyContact.phone.trim(),
      },
    });
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-600">
              <UsersRound className="h-4 w-4" />
              Passenger Information
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Enter Passenger Details
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Add details for all {sortedSeats.length} selected passenger
              {sortedSeats.length === 1 ? "" : "s"}.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Selected Seats
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {sortedSeats.map((seat) => (
                <span
                  key={seat}
                  className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-black text-white"
                >
                  <Armchair className="h-3.5 w-3.5" />
                  {seat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {errors.general && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4">
            <p className="flex items-start gap-2 text-sm font-bold text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {errors.general}
            </p>
          </div>
        )}

        {/* Contact Details */}
        <div className="mb-8 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900">
              <Mail className="h-5 w-5 text-red-600" />
              Contact Details
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Ticket and booking updates will be sent to this email and phone.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Email Address <span className="text-red-600">*</span>
              </label>

              <div
                className={`relative rounded-2xl border bg-white transition focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors["contact-email"]
                    ? "border-red-300"
                    : "border-slate-200"
                }`}
              >
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={contactDetails.email}
                  onChange={(e) =>
                    handleContactChange("email", e.target.value)
                  }
                  placeholder="example@email.com"
                  className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              {errors["contact-email"] && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors["contact-email"]}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Mobile Number <span className="text-red-600">*</span>
              </label>

              <div
                className={`relative rounded-2xl border bg-white transition focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10 ${
                  errors["contact-phone"]
                    ? "border-red-300"
                    : "border-slate-200"
                }`}
              >
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) =>
                    handleContactChange("phone", e.target.value)
                  }
                  placeholder="9876543210"
                  className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              {errors["contact-phone"] && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors["contact-phone"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Passenger Cards */}
        <div className="space-y-6">
          {sortedSeats.map((seat, index) => {
            const passenger = passengers[seat] || {};

            return (
              <div
                key={seat}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-red-100 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Passenger {index + 1}
                      </h3>

                      <p className="text-sm font-bold text-slate-500">
                        Seat {seat}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex w-fit items-center gap-1 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-black text-white">
                    <Armchair className="h-3.5 w-3.5" />
                    {seat}
                  </span>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Full Name <span className="text-red-600">*</span>
                    </label>

                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) =>
                        handlePassengerChange(seat, "name", e.target.value)
                      }
                      placeholder="Enter passenger name"
                      className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 ${
                        errors[`${seat}-name`]
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                    />

                    {errors[`${seat}-name`] && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors[`${seat}-name`]}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <label className="mb-2 block text-sm font-black text-slate-700">
                      Age <span className="text-red-600">*</span>
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={passenger.age}
                      onChange={(e) =>
                        handlePassengerChange(seat, "age", e.target.value)
                      }
                      placeholder="Enter age"
                      className={`w-full rounded-2xl border bg-slate-50 px-4 py-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 ${
                        errors[`${seat}-age`]
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                    />

                    {errors[`${seat}-age`] && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors[`${seat}-age`]}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-sm font-black text-slate-700">
                      Gender <span className="text-red-600">*</span>
                    </label>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {["Male", "Female", "Other"].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() =>
                            handlePassengerChange(seat, "gender", gender)
                          }
                          className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                            passenger.gender === gender
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          }`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>

                    {errors[`${seat}-gender`] && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors[`${seat}-gender`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Contact */}
        <div className="mt-8 rounded-[1.5rem] border border-amber-100 bg-amber-50 p-5">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-lg font-black text-amber-900">
              <ShieldCheck className="h-5 w-5" />
              Emergency Contact
            </h3>

            <p className="mt-1 text-sm font-medium text-amber-700">
              Optional, but recommended for safer travel.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-black text-amber-900">
                Contact Name
              </label>

              <input
                type="text"
                value={emergencyContact.name}
                onChange={(e) =>
                  handleEmergencyChange("name", e.target.value)
                }
                placeholder="Emergency contact name"
                className={`w-full rounded-2xl border bg-white px-4 py-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 ${
                  errors["emergency-name"]
                    ? "border-red-300"
                    : "border-amber-200"
                }`}
              />

              {errors["emergency-name"] && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors["emergency-name"]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-amber-900">
                Contact Phone
              </label>

              <input
                type="tel"
                value={emergencyContact.phone}
                onChange={(e) =>
                  handleEmergencyChange("phone", e.target.value)
                }
                placeholder="9876543210"
                className={`w-full rounded-2xl border bg-white px-4 py-4 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 ${
                  errors["emergency-phone"]
                    ? "border-red-300"
                    : "border-amber-200"
                }`}
              />

              {errors["emergency-phone"] && (
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors["emergency-phone"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <p className="text-sm font-semibold leading-6 text-green-800">
            Your personal information is used only for ticket confirmation,
            journey communication and safety purposes.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={sortedSeats.length === 0}
          className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-black transition ${
            sortedSeats.length === 0
              ? "cursor-not-allowed bg-slate-200 text-slate-400"
              : "bg-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 active:scale-[0.98]"
          }`}
        >
          Review Booking
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
};

export default PassengerForm;