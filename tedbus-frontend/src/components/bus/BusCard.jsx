import { Link, useLocation } from "react-router-dom";
import {
  Armchair,
  ArrowRight,
  BusFront,
  Camera,
  CheckCircle2,
  Clock3,
  Droplets,
  MapPin,
  Plug,
  ShieldCheck,
  Star,
  Wifi,
} from "lucide-react";

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getAmenityIcon = (amenity) => {
  const text = String(amenity).toLowerCase();

  if (text.includes("wifi")) return Wifi;
  if (text.includes("charging") || text.includes("plug")) return Plug;
  if (text.includes("cctv") || text.includes("camera")) return Camera;
  if (text.includes("water")) return Droplets;

  return CheckCircle2;
};

const BusCard = ({ bus, journeyDate }) => {
  const location = useLocation();

  const busId = bus?._id || bus?.id;

  const name =
    bus?.name ||
    bus?.busName ||
    bus?.operatorName ||
    "TedBus Partner";

  const type =
    bus?.type ||
    bus?.busType ||
    bus?.category ||
    "Standard Bus";

  const departure =
    bus?.departure ||
    bus?.departureTime ||
    bus?.startTime ||
    "—";

  const arrival =
    bus?.arrival ||
    bus?.arrivalTime ||
    bus?.endTime ||
    "—";

  const source = bus?.source || "Source";
  const destination = bus?.destination || "Destination";

  const duration = bus?.duration || "—";

  const rating =
    bus?.rating ||
    bus?.averageRating ||
    4.2;

  const reviews =
    bus?.reviewsCount ||
    bus?.totalReviews ||
    0;

  const price =
    bus?.price ||
    bus?.fare ||
    bus?.ticketPrice ||
    bus?.baseFare ||
    bus?.seatPrice ||
    0;

  const seatsLeft =
    bus?.seatsAvailable ??
    bus?.availableSeats ??
    bus?.totalAvailableSeats ??
    bus?.availableSeatCount ??
    bus?.seats ??
    0;

  const amenities = Array.isArray(bus?.amenities)
    ? bus.amenities
    : [];

  const finalJourneyDate =
    journeyDate ||
    bus?.journeyDate ||
    new URLSearchParams(location.search).get("date");

  const seatSelectionLink = busId
    ? `/seat-selection/${busId}${
        finalJourneyDate ? `?date=${finalJourneyDate}` : ""
      }`
    : "#";

 const detailLink = busId
  ? `/bus/${busId}${finalJourneyDate ? `?date=${finalJourneyDate}` : ""}`
  : "#";

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-100 hover:shadow-2xl hover:shadow-slate-900/10">
      {/* Top Content */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          {/* Bus Info */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between xl:block">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                  <BusFront className="h-3.5 w-3.5" />
                  TedBus Assured
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {type}
                </p>
              </div>

              {/* Rating mobile */}
              <div className="flex items-center gap-2 xl:hidden">
                <div className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 text-sm font-black text-white">
                  <Star className="h-4 w-4 fill-white" />
                  {Number(rating).toFixed(1)}
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {reviews > 0 ? `${reviews}+ reviews` : "Verified"}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-600">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>{source}</span>
              <ArrowRight className="h-4 w-4 text-slate-300" />
              <span>{destination}</span>

              {formatDate(finalJourneyDate) && (
                <span className="ml-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                  {formatDate(finalJourneyDate)}
                </span>
              )}
            </div>

            {/* Amenities */}
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.length > 0 ? (
                amenities.slice(0, 4).map((amenity) => {
                  const Icon = getAmenityIcon(amenity);

                  return (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600"
                    >
                      <Icon className="h-3.5 w-3.5 text-red-600" />
                      {amenity}
                    </span>
                  );
                })
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                    Verified Bus
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    Free Cancellation
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Timing */}
          <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 xl:min-w-[330px]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div>
                <h4 className="text-2xl font-black text-slate-900">
                  {departure}
                </h4>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Departure
                </p>
              </div>

              <div className="flex flex-col items-center">
                <Clock3 className="h-4 w-4 text-slate-400" />
                <div className="my-2 h-px w-16 bg-slate-300" />
                <p className="text-xs font-black text-slate-500">
                  {duration}
                </p>
              </div>

              <div className="text-right">
                <h4 className="text-2xl font-black text-slate-900">
                  {arrival}
                </h4>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Arrival
                </p>
              </div>
            </div>
          </div>

          {/* Rating desktop */}
          <div className="hidden shrink-0 flex-col items-center xl:flex">
            <div className="inline-flex items-center gap-1 rounded-xl bg-green-600 px-3 py-1.5 text-sm font-black text-white">
              <Star className="h-4 w-4 fill-white" />
              {Number(rating).toFixed(1)}
            </div>

            <span className="mt-1 text-xs font-semibold text-slate-400">
              {reviews > 0 ? `${reviews}+ reviews` : "Verified"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Seats */}
          <div>
            <p
              className={`flex items-center gap-2 text-sm font-black ${
                Number(seatsLeft) <= 5
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              <Armchair className="h-4 w-4" />
              {Number(seatsLeft) > 0
                ? `Only ${seatsLeft} seats left`
                : "Seats availability updating"}
            </p>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              Live seat selection available
            </p>
          </div>

          {/* Price */}
          <div className="md:text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Starting from
            </p>

            <h2 className="text-3xl font-black text-red-600">
              ₹{formatCurrency(price)}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={detailLink}
              state={{
                bus,
                journeyDate: finalJourneyDate,
              }}
              className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 ${
                !busId ? "pointer-events-none opacity-50" : ""
              }`}
            >
              View Details
            </Link>

            <Link
              to={seatSelectionLink}
              state={{
                bus,
                journeyDate: finalJourneyDate,
              }}
              className={`inline-flex items-center justify-center rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98] ${
                !busId ? "pointer-events-none opacity-50" : ""
              }`}
            >
              View Seats
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BusCard;