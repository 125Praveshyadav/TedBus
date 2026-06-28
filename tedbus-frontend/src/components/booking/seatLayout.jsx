import { useState } from "react";
import {
  AlertCircle,
  Armchair,
  Check,
  Info,
  X,
} from "lucide-react";

import Seat from "./Seat";

const SeatLayout = ({
  
  selectedSeats,
  setSelectedSeats,
  bookedSeats = [],
  seatFare = 899,
}) => {
  const ROWS = 12;
  const MAX_SEATS = 6;
 

  const [error, setError] = useState("");

  const handleSelectSeat = (seatNumber) => {
    setError("");

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
      return;
    }

    if (selectedSeats.length >= MAX_SEATS) {
      setError(`You can select maximum ${MAX_SEATS} seats at a time.`);
      return;
    }

    setSelectedSeats([...selectedSeats, seatNumber]);
  };

  const removeSeat = (seatNumber) => {
    setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
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

  const sortedSelectedSeats = sortSeats(selectedSeats);

  const totalSeatAmount = selectedSeats.length * seatFare;

  return (
    
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-sm">

         
      {/* Header */}
      <div className="relative border-b border-slate-100 bg-gradient-to-br from-red-50 via-white to-slate-50 p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-red-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600 shadow-sm">
              <Armchair className="h-4 w-4" />
              Live Seat Map
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Select Your Seats
            </h2>

            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Choose your preferred seats. You can select up to{" "}
              <span className="font-black text-slate-900">{MAX_SEATS}</span>{" "}
              seats.
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Selected
            </p>

            <p className="mt-1 text-2xl font-black text-red-600">
              {selectedSeats.length}/{MAX_SEATS}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {/* Legend */}
        <div className="mb-6 grid gap-3 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-t-2xl rounded-b-md border-2 border-slate-300 bg-white" />
            <span className="text-sm font-bold text-slate-600">
              Available
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-t-2xl rounded-b-md border-2 border-red-600 bg-red-600 text-white shadow-md shadow-red-500/25">
              <Check className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-slate-600">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-t-2xl rounded-b-md border-2 border-slate-300 bg-slate-300" />
            <span className="text-sm font-bold text-slate-600">
              Booked
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Bus Layout Wrapper */}
        <div className="flex justify-center overflow-x-auto rounded-[2rem] border border-slate-100 bg-slate-50 p-4 sm:p-6">
          <div className="relative min-w-[360px] rounded-[2.5rem] border-[6px] border-slate-200 bg-white p-7 shadow-inner">
            {/* Driver / Front */}
            <div className="absolute right-7 top-7 flex flex-col items-center text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-300 bg-slate-50">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-400">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                </div>
              </div>

              <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Driver
              </span>
            </div>

            {/* Front label */}
            <div className="mb-8 mt-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500">
              Front of Bus
            </div>

            {/* Seat Rows */}
            <div className="mt-10 space-y-4">
              {Array.from({ length: ROWS }).map((_, rowIndex) => {
                const rowNumber = rowIndex + 1;

                return (
                  <div
                    key={rowNumber}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-5"
                  >
                    {/* Left Seats A B */}
                    <div className="flex justify-end gap-3">
                      <Seat
                        seatNumber={`${rowNumber}A`}
                        isSelected={selectedSeats.includes(`${rowNumber}A`)}
                        isBooked={bookedSeats.includes(`${rowNumber}A`)}
                        onSelectSeat={handleSelectSeat}
                      />

                      <Seat
                        seatNumber={`${rowNumber}B`}
                        isSelected={selectedSeats.includes(`${rowNumber}B`)}
                        isBooked={bookedSeats.includes(`${rowNumber}B`)}
                        onSelectSeat={handleSelectSeat}
                      />
                    </div>

                    {/* Aisle */}
                    <div className="flex w-10 justify-center">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-black text-slate-400">
                        {rowNumber}
                      </span>
                    </div>

                    {/* Right Seats C D */}
                    <div className="flex justify-start gap-3">
                      <Seat
                        seatNumber={`${rowNumber}C`}
                        isSelected={selectedSeats.includes(`${rowNumber}C`)}
                        isBooked={bookedSeats.includes(`${rowNumber}C`)}
                        onSelectSeat={handleSelectSeat}
                      />

                      <Seat
                        seatNumber={`${rowNumber}D`}
                        isSelected={selectedSeats.includes(`${rowNumber}D`)}
                        isBooked={bookedSeats.includes(`${rowNumber}D`)}
                        onSelectSeat={handleSelectSeat}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rear Exit */}
            <div className="mt-8 border-t border-slate-100 pt-5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-400">
                Rear Exit
              </span>
            </div>
          </div>
        </div>

        {/* Selected Seats */}
        <div className="mt-6 rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Selected Seats
                <span className="ml-2 text-red-600">
                  ({selectedSeats.length})
                </span>
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Seat fare will be calculated in booking summary.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Seat Total
              </p>

              <p className="text-xl font-black text-red-600">
                ₹{totalSeatAmount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {sortedSelectedSeats.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {sortedSelectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white shadow-md shadow-red-500/20"
                >
                  {seat}

                  <button
                    type="button"
                    onClick={() => removeSeat(seat)}
                    className="rounded-full p-0.5 text-red-100 transition hover:bg-white/20 hover:text-white"
                    aria-label={`Remove seat ${seat}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
              <p className="text-sm font-semibold text-slate-500">
                No seats selected yet. Click an available seat to select.
              </p>
            </div>
          )}
        </div>

        {/* Limit Warning */}
        {selectedSeats.length >= MAX_SEATS && (
          <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm font-bold text-yellow-800">
            ⚠️ You have reached the maximum limit of {MAX_SEATS} seats.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;