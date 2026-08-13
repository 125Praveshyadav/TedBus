import { useMemo, useState } from "react";
import {
  AlertCircle,
  Armchair,
  BusFront,
  Check,
  Info,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

import Seat from "./Seat";

const SEATS_PER_ROW = 4;
const SEAT_COLUMNS = ["A", "B", "C", "D"];

const normalizeSeatValue = (seat) => {
  const seatValue =
    typeof seat === "object" && seat !== null
      ? seat.seatNumber || seat.number || seat.code
      : seat;

  return String(seatValue || "")
    .trim()
    .toUpperCase();
};

const sortSeats = (seats = []) => {
  return [...seats].sort((a, b) => {
    const matchA = String(a).match(/^(\d+)([A-D])$/i);
    const matchB = String(b).match(/^(\d+)([A-D])$/i);

    if (!matchA || !matchB) {
      return String(a).localeCompare(String(b));
    }

    return (
      Number(matchA[1]) - Number(matchB[1]) ||
      matchA[2].localeCompare(matchB[2])
    );
  });
};

const SeatLayout = ({
  totalSeats = 0,
  selectedSeats = [],
  setSelectedSeats,
  bookedSeats = [],
  seatFare = 0,
  maxSelectableSeats = 6,
}) => {
  const [error, setError] = useState("");

  const parsedTotalSeats = useMemo(() => {
    const value = Number(totalSeats);

    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }

    return Math.floor(value);
  }, [totalSeats]);

  const parsedSeatFare = Number(seatFare) || 0;

  const selectionLimit = Math.min(maxSelectableSeats, parsedTotalSeats);


  const seatRows = useMemo(() => {
    if (parsedTotalSeats <= 0) {
      return [];
    }

    const numberOfRows = Math.ceil(parsedTotalSeats / SEATS_PER_ROW);

    return Array.from({ length: numberOfRows }, (_, rowIndex) => {
      const rowNumber = rowIndex + 1;

      return SEAT_COLUMNS.map((columnLetter, columnIndex) => {
        const seatIndex = rowIndex * SEATS_PER_ROW + columnIndex;

        if (seatIndex >= parsedTotalSeats) {
          return null;
        }

        return `${rowNumber}${columnLetter}`;
      });
    });
  }, [parsedTotalSeats]);

  const validSeatSet = useMemo(() => {
    return new Set(
      seatRows.flatMap((row) => row.filter(Boolean).map(normalizeSeatValue)),
    );
  }, [seatRows]);

  const selectedSeatSet = useMemo(() => {
    return new Set(
      selectedSeats
        .map(normalizeSeatValue)
        .filter((seatNumber) => validSeatSet.has(seatNumber)),
    );
  }, [selectedSeats, validSeatSet]);

  const bookedSeatSet = useMemo(() => {
    return new Set(
      bookedSeats
        .map(normalizeSeatValue)
        .filter((seatNumber) => validSeatSet.has(seatNumber)),
    );
  }, [bookedSeats, validSeatSet]);

  const validSelectedSeats = useMemo(() => {
    return selectedSeats
      .map(normalizeSeatValue)
      .filter(
        (seatNumber, index, seatList) =>
          validSeatSet.has(seatNumber) &&
          seatList.indexOf(seatNumber) === index,
      );
  }, [selectedSeats, validSeatSet]);

  const sortedSelectedSeats = useMemo(() => {
    return sortSeats(validSelectedSeats);
  }, [validSelectedSeats]);

  const bookedSeatCount = bookedSeatSet.size;

  const availableSeatCount = Math.max(parsedTotalSeats - bookedSeatCount, 0);

  const totalSeatAmount = validSelectedSeats.length * parsedSeatFare;

  const handleSelectSeat = (seatNumber) => {
    setError("");

    const normalizedSeatNumber = normalizeSeatValue(seatNumber);

    if (
      !normalizedSeatNumber ||
      !validSeatSet.has(normalizedSeatNumber) ||
      bookedSeatSet.has(normalizedSeatNumber)
    ) {
      return;
    }

    if (selectedSeatSet.has(normalizedSeatNumber)) {
      setSelectedSeats((currentSeats) =>
        currentSeats.filter(
          (seat) => normalizeSeatValue(seat) !== normalizedSeatNumber,
        ),
      );

      return;
    }

    if (validSelectedSeats.length >= selectionLimit) {
      setError(`You can select maximum ${selectionLimit} seats at a time.`);

      return;
    }

    setSelectedSeats((currentSeats) => [...currentSeats, normalizedSeatNumber]);
  };

  const removeSeat = (seatNumber) => {
    const normalizedSeatNumber = normalizeSeatValue(seatNumber);

    setError("");

    setSelectedSeats((currentSeats) =>
      currentSeats.filter(
        (seat) => normalizeSeatValue(seat) !== normalizedSeatNumber,
      ),
    );
  };

  const renderSeat = (seatNumber, positionKey) => {
    if (!seatNumber) {
      return (
        <div
          key={positionKey}
          aria-hidden="true"
          className="h-14 w-12 shrink-0 opacity-0"
        />
      );
    }

    return (
      <Seat
        key={positionKey}
        seatNumber={seatNumber}
        isSelected={selectedSeatSet.has(seatNumber)}
        isBooked={bookedSeatSet.has(seatNumber)}
        onSelectSeat={handleSelectSeat}
      />
    );
  };

  if (parsedTotalSeats <= 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-xl shadow-amber-500/5 dark:border-amber-900/50 dark:bg-slate-900">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/20" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <AlertCircle className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
            Seat capacity unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
            This bus does not have a valid total seat count. Please update the
            bus capacity from the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:shadow-black/20">
      {/* Premium header */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-red-50 via-white to-orange-50 p-5 dark:border-slate-800 dark:from-red-950/30 dark:via-slate-900 dark:to-orange-950/20 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-red-200/50 blur-3xl dark:bg-red-900/20" />

        <div className="pointer-events-none absolute -bottom-28 left-20 h-56 w-56 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-900/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400">
              <Sparkles className="h-3.5 w-3.5" />
              Live seat map
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Choose Your Seat
            </h2>

            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              This bus has{" "}
              <span className="font-black text-slate-900 dark:text-white">
                {parsedTotalSeats} seats
              </span>
              . You can select up to{" "}
              <span className="font-black text-red-600 dark:text-red-400">
                {selectionLimit} seats
              </span>{" "}
              in one booking.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Seat Fare
              </p>

              <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">
                ₹
                {parsedSeatFare.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 shadow-sm dark:border-red-900/50 dark:bg-red-950/40">
              <p className="text-[9px] font-black uppercase tracking-wider text-red-400">
                Selected
              </p>

              <p className="mt-0.5 text-lg font-black text-red-600 dark:text-red-400">
                {validSelectedSeats.length}/{selectionLimit}
              </p>
            </div>
          </div>
        </div>

        {/* Capacity stats */}
        <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Capacity
            </p>

            <p className="mt-1 text-lg font-black text-slate-800 dark:text-slate-100">
              {parsedTotalSeats}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3 backdrop-blur dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500">
              Available
            </p>

            <p className="mt-1 text-lg font-black text-emerald-700 dark:text-emerald-400">
              {availableSeatCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-100/80 p-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
            <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
              Booked
            </p>

            <p className="mt-1 text-lg font-black text-slate-700 dark:text-slate-300">
              {bookedSeatCount}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Legend */}
        <div className="mb-5 grid grid-cols-1 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-white p-2 dark:bg-slate-900">
            <div className="h-8 w-7 shrink-0 rounded-t-xl rounded-b-md border-2 border-slate-300 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-800" />

            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Available
            </span>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white p-2 dark:bg-slate-900">
            <div className="flex h-8 w-7 shrink-0 items-center justify-center rounded-t-xl rounded-b-md border-2 border-red-600 bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md shadow-red-500/20">
              <Check className="h-4 w-4" />
            </div>

            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Selected
            </span>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-white p-2 dark:bg-slate-900">
            <div className="h-8 w-7 shrink-0 rounded-t-xl rounded-b-md border-2 border-slate-300 bg-slate-300 dark:border-slate-700 dark:bg-slate-700" />

            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Booked
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Bus layout outer section */}
        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-100 via-slate-50 to-red-50/50 p-3 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-red-950/20 sm:p-5">
          <div className="mx-auto min-w-[340px] max-w-[430px]">
            {/* Bus shell */}
            <div className="relative overflow-hidden rounded-[2.5rem] border-[5px] border-slate-800 bg-slate-100 p-3 shadow-[0_28px_70px_-30px_rgba(15,23,42,0.8)] dark:border-slate-600 dark:bg-slate-950 sm:p-4">
              {/* Bus glass/front */}
              <div className="relative mb-5 overflow-hidden rounded-[1.75rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white shadow-inner">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/25 blur-2xl" />

                <div className="relative flex items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-200">
                      <BusFront className="h-3.5 w-3.5" />
                      Front of bus
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Entry from front
                    </p>
                  </div>

                  {/* Steering */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-500 bg-slate-900 shadow-inner">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      </div>
                    </div>

                    <span className="mt-1 text-[8px] font-black uppercase tracking-widest text-slate-500">
                      Driver
                    </span>
                  </div>
                </div>
              </div>

              {/* Seat column labels */}
              <div className="mb-3 grid grid-cols-[1fr_32px_1fr] items-center gap-3 px-1">
                <div className="flex justify-end gap-2">
                  <span className="flex w-12 justify-center text-[9px] font-black uppercase text-slate-400">
                    A
                  </span>

                  <span className="flex w-12 justify-center text-[9px] font-black uppercase text-slate-400">
                    B
                  </span>
                </div>

                <div />

                <div className="flex justify-start gap-2">
                  <span className="flex w-12 justify-center text-[9px] font-black uppercase text-slate-400">
                    C
                  </span>

                  <span className="flex w-12 justify-center text-[9px] font-black uppercase text-slate-400">
                    D
                  </span>
                </div>
              </div>

              {/* Dynamic seat rows */}
              <div className="space-y-3 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-inner dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                {seatRows.map((row, rowIndex) => {
                  const rowNumber = rowIndex + 1;

                  return (
                    <div
                      key={`row-${rowNumber}`}
                      className="grid grid-cols-[1fr_32px_1fr] items-center gap-3"
                    >
                      {/* Left seats A and B */}
                      <div className="flex justify-end gap-2">
                        {renderSeat(row[0], `${rowNumber}-A`)}

                        {renderSeat(row[1], `${rowNumber}-B`)}
                      </div>

                      {/* Aisle row number */}
                      <div className="flex h-full items-center justify-center">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[9px] font-black text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
                          {rowNumber}
                        </span>
                      </div>

                      {/* Right seats C and D */}
                      <div className="flex justify-start gap-2">
                        {renderSeat(row[2], `${rowNumber}-C`)}

                        {renderSeat(row[3], `${rowNumber}-D`)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear section */}
              <div className="mt-4 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  Rear exit
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-600">
              Seat layout representation
            </p>
          </div>
        </div>

        {/* Selected seats section */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                <Armchair className="h-5 w-5 text-red-600 dark:text-red-400" />
                Selected Seats
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-400">
                  {validSelectedSeats.length}
                </span>
              </h3>

              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Click the remove icon to deselect a seat.
              </p>
            </div>

            <div className="shrink-0 rounded-2xl border border-red-100 bg-white px-4 py-2.5 text-left shadow-sm dark:border-red-900/40 dark:bg-slate-900 sm:text-right">
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Seat total
              </p>

              <p className="text-xl font-black text-red-600 dark:text-red-400">
                ₹
                {totalSeatAmount.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="p-4">
            {sortedSelectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sortedSelectedSeats.map((seat) => (
                  <span
                    key={seat}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-3 py-2 text-sm font-black text-white shadow-md shadow-red-500/20"
                  >
                    <Check className="h-3.5 w-3.5" />

                    {seat}

                    <button
                      type="button"
                      onClick={() => removeSeat(seat)}
                      className="rounded-full p-0.5 text-red-100 transition hover:bg-white/20 hover:text-white"
                      aria-label={`Remove seat ${seat}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

                <div>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No seats selected
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                    Click any available seat from the bus layout.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selection limit */}
        {validSelectedSeats.length >= selectionLimit && selectionLimit > 0 && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />

            <p className="text-sm font-bold">
              You have reached the maximum limit of {selectionLimit} seats for
              one booking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatLayout;
