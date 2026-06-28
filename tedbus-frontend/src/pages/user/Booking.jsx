import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Armchair,
  BusFront,
  CalendarDays,
  Check,
  MapPin,
  UserRound,
  WalletCards,
} from "lucide-react";

import PassengerForm from "../../components/booking/PassengerForm";
import BookingSummary from "../../components/booking/BookingSummary";

const safeJsonParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const formatJourneyDate = (date) => {
  if (!date) return "Journey date not selected";

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

    if (!matchA || !matchB) return String(a).localeCompare(String(b));

    return (
      Number(matchA[1]) - Number(matchB[1]) ||
      matchA[2].localeCompare(matchB[2])
    );
  });
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
    name: bus.name || bus.busName || bus.operatorName || "TedBus Partner",
    type: bus.type || bus.busType || bus.category || "Standard Bus",
    source: bus.source || "Source",
    destination: bus.destination || "Destination",
    departure: bus.departure || bus.departureTime || bus.startTime || "—",
    arrival: bus.arrival || bus.arrivalTime || bus.endTime || "—",
    duration: bus.duration || "—",
    price,
  };
};

const normalizeBookingState = (state = {}) => {
  const bus = state.bus || state.busDetails || {};
  const busId = state.busId || bus._id || bus.id || "";

  const selectedSeats = sortSeats(
    state.selectedSeats || state.seats || []
  );

  return {
    busId,
    busDetails: normalizeBus(bus, busId),
    selectedSeats,
    journeyDate: state.journeyDate || bus.journeyDate || state.date || "",
    boardingPoint: state.boardingPoint || "",
    droppingPoint: state.droppingPoint || "",
    fare: state.fare || null,
    amount: state.amount || state?.fare?.totalAmount || 0,
  };
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * SeatSelection.jsx se data location.state me aayega.
   * Page refresh protection ke liye sessionStorage fallback bhi rakha hai.
   */
  const storedBookingState = safeJsonParse(
    sessionStorage.getItem("tedbus_pending_booking")
  );

  const bookingState = useMemo(() => {
    return normalizeBookingState(location.state || storedBookingState || {});
  }, [location.state, storedBookingState]);

  const [step, setStep] = useState("passengers");
  const [passengers, setPassengers] = useState({});
  const [contactDetails, setContactDetails] = useState({});
  const [emergencyContact, setEmergencyContact] = useState({});

  const {
    busId,
    busDetails,
    selectedSeats,
    journeyDate,
    boardingPoint,
    droppingPoint,
    fare,
  } = bookingState;

  const seatSelectionPath = busId
    ? `/seat-selection/${busId}${journeyDate ? `?date=${journeyDate}` : ""}`
    : "/search-bus";

  const hasValidBookingData =
    Boolean(busId) && Array.isArray(selectedSeats) && selectedSeats.length > 0;

  const handlePassengerSubmit = (data) => {
    /**
     * PassengerForm old format:
     * onSubmit(passengerData)
     *
     * Future format:
     * onSubmit({
     *   passengers,
     *   contactDetails,
     *   emergencyContact
     * })
     */
    if (data?.passengers) {
      setPassengers(data.passengers);
      setContactDetails(data.contactDetails || {});
      setEmergencyContact(data.emergencyContact || {});
    } else {
      setPassengers(data || {});
    }

    setStep("summary");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Booking data missing
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Please select your bus and seats again to continue booking.
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
      {/* Header */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            to={seatSelectionPath}
            state={{
              bus: busDetails,
              journeyDate,
            }}
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/25"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Seats
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
                <BusFront className="h-4 w-4" />
                TedBus Booking
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Complete Your Booking
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-bold">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <BusFront className="h-4 w-4" />
                  {busDetails.name}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <MapPin className="h-4 w-4" />
                  {busDetails.source} → {busDetails.destination}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur">
                  <CalendarDays className="h-4 w-4" />
                  {formatJourneyDate(journeyDate)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs font-bold text-red-50">
                Selected Seats
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-red-600"
                  >
                    <Armchair className="h-3.5 w-3.5" />
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Stepper */}
          <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              {steps.map((item, index) => {
                const Icon = item.icon;
                const active = step === item.key;
                const completed =
                  item.key === "passengers" && step === "summary";

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black transition ${
                          active
                            ? "bg-red-600 text-white shadow-lg shadow-red-500/25"
                            : completed
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {completed ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-sm font-black ${
                            active
                              ? "text-red-600"
                              : completed
                              ? "text-green-600"
                              : "text-slate-500"
                          }`}
                        >
                          Step {index + 1}
                        </p>

                        <p className="text-sm font-bold text-slate-800">
                          {item.label}
                        </p>
                      </div>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="hidden h-px w-20 bg-slate-200 sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Booking Info */}
          <div className="mb-8 grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Bus Type
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {busDetails.type}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Departure
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {busDetails.departure}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Boarding
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {boardingPoint || "Not selected"}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Dropping
              </p>
              <p className="mt-1 text-sm font-black text-slate-800">
                {droppingPoint || "Not selected"}
              </p>
            </div>
          </div>

          {/* Step 1: Passenger Details */}
          {step === "passengers" && (
            <div>
              <PassengerForm
                selectedSeats={selectedSeats}
                passengers={passengers}
                initialPassengers={passengers}
                contactDetails={contactDetails}
                emergencyContact={emergencyContact}
                setContactDetails={setContactDetails}
                setEmergencyContact={setEmergencyContact}
                busDetails={busDetails}
                journeyDate={journeyDate}
                onSubmit={handlePassengerSubmit}
              />

              <div className="mt-6 flex justify-center">
                <Link
                  to={seatSelectionPath}
                  state={{
                    bus: busDetails,
                    journeyDate,
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Seats
                </Link>
              </div>
            </div>
          )}

          {/* Step 2: Booking Summary */}
          {step === "summary" && (
            <div>
              <BookingSummary
                busDetails={busDetails}
                selectedSeats={selectedSeats}
                passengers={passengers}
                contactDetails={contactDetails}
                emergencyContact={emergencyContact}
                journeyDate={journeyDate}
                boardingPoint={boardingPoint}
                droppingPoint={droppingPoint}
                fare={fare}
              />

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setStep("passengers");
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Passenger Details
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Booking;