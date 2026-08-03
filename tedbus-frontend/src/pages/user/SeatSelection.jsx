import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  Armchair,
  ArrowLeft,
  ArrowRight,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import SeatLayout from "../../components/booking/seatLayout";
import { busService } from "../../services/busService";

const PLATFORM_FEE = 20;
const GST_RATE = 0.05;

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
};

const formatJourneyDate = (date) => {
  if (!date) return "Select Date";
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeSeatValue = (seat) => {
  const seatValue =
    typeof seat === "object" && seat !== null
      ? seat.seatNumber || seat.number || seat.code
      : seat;
  return String(seatValue || "").trim().toUpperCase();
};

const normalizeSeatList = (seats = []) => {
  if (!Array.isArray(seats)) return [];
  return [...new Set(seats.map(normalizeSeatValue).filter(Boolean))];
};

const sortSeats = (seats = []) => {
  return normalizeSeatList(seats).sort((a, b) => {
    const matchA = String(a).match(/^(\d+)([A-D])$/i);
    const matchB = String(b).match(/^(\d+)([A-D])$/i);
    if (!matchA || !matchB) return String(a).localeCompare(String(b));
    return Number(matchA[1]) - Number(matchB[1]) || matchA[2].localeCompare(matchB[2]);
  });
};

const getBusSources = (bus) => {
  if (!bus || typeof bus !== "object") return [];
  return [bus, bus.bus, bus.busId, bus.vehicle, bus.busDetails].filter(
    (item) => item && typeof item === "object" && !Array.isArray(item)
  );
};

const pickBusValue = (sources, keys = []) => {
  for (const key of keys) {
    for (const source of sources) {
      const value = source?.[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }
  return undefined;
};

const parsePositiveInteger = (value) => {
  if (Array.isArray(value)) return value.length;
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || !Number.isInteger(parsedValue) || parsedValue <= 0) return 0;
  return parsedValue;
};

const getTotalSeats = (bus) => {
  const sources = getBusSources(bus);
  const seatCountFields = [
    "totalSeats",
    "numberOfSeats",
    "noOfSeats",
    "seatCount",
    "totalSeatCount",
    "seatCapacity",
    "capacity",
    "seats",
  ];
  for (const field of seatCountFields) {
    for (const source of sources) {
      const seatCount = parsePositiveInteger(source?.[field]);
      if (seatCount > 0) return seatCount;
    }
  }
  return 0;
};

const normalizePoints = (points) => {
  if (!Array.isArray(points)) return [];
  return [...new Set(points.map((p) => (typeof p === "string" ? p.trim() : String(p?.name || p?.location || "").trim())).filter(Boolean))];
};

const normalizeBus = (bus) => {
  if (!bus) return null;
  const sources = getBusSources(bus);
  const rawPrice = pickBusValue(sources, ["price", "fare", "ticketPrice", "baseFare", "seatPrice"]);
  const parsedPrice = Number(rawPrice);
  
  return {
    ...bus,
    id: pickBusValue(sources, ["_id", "id"]),
    _id: pickBusValue(sources, ["_id", "id"]),
    name: pickBusValue(sources, ["name", "busName", "operatorName"]) || "TedBus Partner",
    type: pickBusValue(sources, ["type", "busType", "category"]) || "Standard Bus",
    source: pickBusValue(sources, ["source", "from", "origin"]) || "Source",
    destination: pickBusValue(sources, ["destination", "to", "dropCity"]) || "Destination",
    departure: pickBusValue(sources, ["departure", "departureTime", "startTime"]) || "—",
    arrival: pickBusValue(sources, ["arrival", "arrivalTime", "endTime"]) || "—",
    duration: pickBusValue(sources, ["duration"]) || "—",
    price: Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0,
    totalSeats: getTotalSeats(bus),
    boardingPoints: normalizePoints(pickBusValue(sources, ["boardingPoints"])),
    droppingPoints: normalizePoints(pickBusValue(sources, ["droppingPoints"])),
  };
};

const getSeatIndex = (seatNumber) => {
  const match = String(seatNumber).trim().toUpperCase().match(/^(\d+)([A-D])$/);
  if (!match) return 0;
  const rowNumber = Number(match[1]);
  const columnIndex = { A: 1, B: 2, C: 3, D: 4 }[match[2]];
  return (rowNumber - 1) * 4 + columnIndex;
};

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const stateBus = location.state?.bus || null;
  const stateJourneyDate = location.state?.journeyDate || "";
  const queryJourneyDate = searchParams.get("date") || "";

  const [bus, setBus] = useState(() => normalizeBus(stateBus));
  const [journeyDate, setJourneyDate] = useState(queryJourneyDate || stateJourneyDate || "");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState("");
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const totalSeats = Number(bus?.totalSeats || 0);
  const seatPrice = Number(bus?.price || 0);

  const validBookedSeats = useMemo(() => {
    return normalizeSeatList(bookedSeats).filter((seatNumber) => {
      const idx = getSeatIndex(seatNumber);
      return idx > 0 && idx <= totalSeats;
    });
  }, [bookedSeats, totalSeats]);

  const availableSeatCount = Math.max(totalSeats - validBookedSeats.length, 0);

  const baseFare = selectedSeats.length * seatPrice;
  const platformFee = selectedSeats.length > 0 ? PLATFORM_FEE : 0;
  const gst = baseFare * GST_RATE;
  const totalAmount = baseFare + platformFee + gst;

  const sortedSelectedSeats = useMemo(() => sortSeats(selectedSeats), [selectedSeats]);

  const fetchSeatData = async () => {
    try {
      setLoading(true);
      setError("");
      const finalDate = queryJourneyDate || stateJourneyDate || journeyDate;
      if (!finalDate) throw new Error("Journey date is missing. Please search buses again.");

      const response = await busService.getBusSeats(id, { date: finalDate });
      const apiBus = busService.extractBus(response);
      const mergedBus = apiBus ? { ...(stateBus || {}), ...apiBus } : stateBus;
      const normalizedBus = normalizeBus(mergedBus);

      if (!normalizedBus) throw new Error("Unable to load bus details.");
      if (normalizedBus.totalSeats <= 0) throw new Error("Bus capacity unavailable.");

      setBus(normalizedBus);
      setJourneyDate(finalDate);
      setBookedSeats(normalizeSeatList(busService.extractBookedSeats(response)));
      setSelectedSeats([]);

      setSelectedBoardingPoint((curr) => curr && normalizedBus.boardingPoints.includes(curr) ? curr : normalizedBus.boardingPoints[0] || "");
      setSelectedDroppingPoint((curr) => curr && normalizedBus.droppingPoints.includes(curr) ? curr : normalizedBus.droppingPoints[0] || "");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load seat availability.");
      setBookedSeats([]);
      setSelectedSeats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) { setLoading(false); setError("Bus ID missing."); return; }
    fetchSeatData();
  }, [id, queryJourneyDate]);

  const validateBeforeContinue = () => {
    if (selectedSeats.length === 0) { alert("Please select at least one seat."); return false; }
    if (bus?.boardingPoints?.length > 0 && !selectedBoardingPoint) { alert("Please select boarding point."); return false; }
    if (bus?.droppingPoints?.length > 0 && !selectedDroppingPoint) { alert("Please select dropping point."); return false; }
    if (!journeyDate) { alert("Journey date missing."); return false; }
    
    if (selectedSeats.some((seat) => validBookedSeats.includes(normalizeSeatValue(seat)))) {
      alert("One or more selected seats are already booked.");
      fetchSeatData();
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateBeforeContinue()) return;
    const pendingBooking = {
      busId: id,
      bus,
      busDetails: bus,
      journeyDate,
      totalSeats,
      seats: sortedSelectedSeats,
      selectedSeats: sortedSelectedSeats,
      boardingPoint: selectedBoardingPoint,
      droppingPoint: selectedDroppingPoint,
      fare: { seatPrice, baseFare, platformFee, gst, totalAmount },
      amount: totalAmount,
    };
    sessionStorage.setItem("tedbus_pending_booking", JSON.stringify(pendingBooking));
    navigate("/passenger-info", { state: pendingBooking });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-20 w-full animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid gap-4 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-[500px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />
            <div className="h-[400px] animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !bus) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-lg rounded-[2rem] border border-red-100 bg-white p-8 text-center shadow-xl dark:border-red-900/50 dark:bg-slate-900">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">Seats Unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={fetchSeatData} className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">
              Retry
            </button>
            <Link to="/search-bus" className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
              Back to Search
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950 pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        
        {/* Compact Premium Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-xl dark:border dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
              title="Go Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div>
              <div className="flex items-center gap-2 text-sm sm:text-base font-black tracking-wide">
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{bus.source}</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
                <span className="truncate max-w-[100px] sm:max-w-[150px]">{bus.destination}</span>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 mt-0.5">
                <CalendarDays className="h-3 w-3" /> {formatJourneyDate(journeyDate)} • {bus.name}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 border-t border-slate-800 pt-3 sm:border-0 sm:pt-0">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fare per seat</p>
              <p className="text-xl font-black text-red-400">₹{formatCurrency(seatPrice)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Colorful Bus Info Strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-3.5 dark:border-indigo-900/30 dark:bg-indigo-950/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500">Bus Type</p>
            <p className="mt-1 truncate text-sm font-black text-indigo-900 dark:text-indigo-300">{bus.type}</p>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3.5 dark:border-sky-900/30 dark:bg-sky-950/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-sky-500">Departure</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-sky-900 dark:text-sky-300">
              <Clock3 className="h-4 w-4" /> {bus.departure}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-amber-500">Arrival</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-amber-900 dark:text-amber-300">
              <Clock3 className="h-4 w-4" /> {bus.arrival}
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-3.5 dark:border-violet-900/30 dark:bg-violet-950/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-violet-500">Capacity</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-violet-900 dark:text-violet-300">
              <Armchair className="h-4 w-4" /> {totalSeats}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1 rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Available</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-black text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" /> {availableSeatCount}
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid items-start gap-6 lg:grid-cols-3">
          
          {/* Seat Layout Map */}
          <div className="lg:col-span-2">
            <SeatLayout
              totalSeats={totalSeats}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              bookedSeats={validBookedSeats}
              seatFare={seatPrice}
              maxSelectableSeats={6}
            />
          </div>

          {/* Compact Sidebar Summary */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
              
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800">
                <h2 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <Ticket className="h-4 w-4 text-red-500" /> Booking Summary
                </h2>
              </div>

              <div className="p-5 space-y-5">
                {/* Boarding/Dropping */}
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Boarding Point</label>
                    <select
                      value={selectedBoardingPoint}
                      onChange={(e) => setSelectedBoardingPoint(e.target.value)}
                      disabled={bus.boardingPoints.length === 0}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {bus.boardingPoints.length > 0 ? (
                        bus.boardingPoints.map((pt, i) => <option key={i} value={pt}>{pt}</option>)
                      ) : (
                        <option value="">Not available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">Dropping Point</label>
                    <select
                      value={selectedDroppingPoint}
                      onChange={(e) => setSelectedDroppingPoint(e.target.value)}
                      disabled={bus.droppingPoints.length === 0}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {bus.droppingPoints.length > 0 ? (
                        bus.droppingPoints.map((pt, i) => <option key={i} value={pt}>{pt}</option>)
                      ) : (
                        <option value="">Not available</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Selected Seats Pills */}
                <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Selected Seats</p>
                    <span className="text-[10px] font-black text-red-500">{selectedSeats.length}/6</span>
                  </div>
                  {sortedSelectedSeats.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {sortedSelectedSeats.map((seat) => (
                        <span key={seat} className="rounded-lg bg-red-100 px-2 py-1 text-[10px] font-black text-red-700 dark:bg-red-900/40 dark:text-red-400">
                          {seat}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] font-medium text-slate-400">No seats selected</p>
                  )}
                </div>

                {/* Fare Breakdown */}
                <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <div className="flex justify-between"><span>Base Fare (x{selectedSeats.length})</span><span className="text-slate-800 dark:text-slate-200">₹{formatCurrency(baseFare)}</span></div>
                  <div className="flex justify-between"><span>Platform Fee</span><span className="text-slate-800 dark:text-slate-200">₹{formatCurrency(platformFee)}</span></div>
                  <div className="flex justify-between"><span>GST (5%)</span><span className="text-slate-800 dark:text-slate-200">₹{formatCurrency(gst)}</span></div>
                </div>

                {/* Final Total */}
                <div className="flex items-center justify-between rounded-2xl bg-red-50 p-4 dark:bg-red-900/20">
                  <span className="text-xs font-black uppercase tracking-wider text-red-800 dark:text-red-400">Total</span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">₹{formatCurrency(totalAmount)}</span>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                  className={`group flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-black transition-all ${
                    selectedSeats.length === 0
                      ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                      : "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  }`}
                >
                  Continue Booking <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" /> Secure Checkout
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
};

export default SeatSelection;