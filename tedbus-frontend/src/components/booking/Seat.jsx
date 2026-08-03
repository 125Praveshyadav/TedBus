import { Check, LockKeyhole } from "lucide-react";

const Seat = ({
  seatNumber,
  isSelected = false,
  isBooked = false,
  onSelectSeat,
}) => {
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isBooked) {
      return;
    }

    onSelectSeat?.(seatNumber);
  };

  const getSeatStyle = () => {
    if (isBooked) {
      return `
        cursor-not-allowed
        border-slate-300
        bg-slate-200
        text-slate-400
        opacity-80
        shadow-inner
        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-500
      `;
    }

    if (isSelected) {
      return `
        scale-105
        border-red-600
        bg-gradient-to-br
        from-red-600
        to-orange-500
        text-white
        shadow-lg
        shadow-red-500/30
      `;
    }

    return `
      cursor-pointer
      border-slate-300
      bg-white
      text-slate-700
      shadow-sm
      hover:-translate-y-1
      hover:border-red-500
      hover:bg-red-50
      hover:text-red-600
      hover:shadow-lg
      hover:shadow-red-500/10
      dark:border-slate-600
      dark:bg-slate-800
      dark:text-slate-300
      dark:hover:border-red-500
      dark:hover:bg-red-950/40
      dark:hover:text-red-400
    `;
  };

  const statusText = isBooked
    ? "Booked"
    : isSelected
      ? "Selected"
      : "Available";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBooked}
      aria-label={`Seat ${seatNumber}, ${statusText}`}
      aria-pressed={isSelected}
      title={`Seat ${seatNumber} - ${statusText}`}
      className={`
        group relative flex h-14 w-12 shrink-0 items-center
        justify-center overflow-visible rounded-t-2xl rounded-b-lg
        border-2 text-xs font-black transition-all duration-200
        focus:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20
        ${getSeatStyle()}
      `}
    >
      {/* Inner seat backrest */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-x-1.5 top-1.5 h-8
          rounded-t-xl rounded-b-md border
          ${
            isSelected
              ? "border-white/40 bg-white/10"
              : isBooked
                ? "border-slate-400/30 bg-slate-400/10"
                : "border-slate-400/25 bg-slate-100/70 dark:bg-slate-700/50"
          }
        `}
      />

      {/* Left arm */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute -left-[4px] bottom-2
          h-5 w-1.5 rounded-full border
          ${
            isSelected
              ? "border-red-700 bg-red-500"
              : isBooked
                ? "border-slate-400 bg-slate-300 dark:border-slate-600 dark:bg-slate-700"
                : "border-slate-300 bg-white group-hover:border-red-500 group-hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800"
          }
        `}
      />

      {/* Right arm */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute -right-[4px] bottom-2
          h-5 w-1.5 rounded-full border
          ${
            isSelected
              ? "border-red-700 bg-red-500"
              : isBooked
                ? "border-slate-400 bg-slate-300 dark:border-slate-600 dark:bg-slate-700"
                : "border-slate-300 bg-white group-hover:border-red-500 group-hover:bg-red-50 dark:border-slate-600 dark:bg-slate-800"
          }
        `}
      />

      {/* Seat number */}
      <span className="relative z-10 mt-0.5">
        {seatNumber}
      </span>

      {/* Selected icon */}
      {isSelected && (
        <span className="absolute -right-1.5 -top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-md">
          <Check className="h-3 w-3 stroke-[4]" />
        </span>
      )}

      {/* Booked icon */}
      {isBooked && (
        <span className="absolute -right-1.5 -top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-500 text-white shadow-sm dark:border-slate-900">
          <LockKeyhole className="h-2.5 w-2.5" />
        </span>
      )}

      {/* Seat bottom cushion */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none absolute bottom-1 h-1 w-8 rounded-full
          ${
            isSelected
              ? "bg-white/60"
              : isBooked
                ? "bg-slate-400/50"
                : "bg-slate-400/40 group-hover:bg-red-400/60"
          }
        `}
      />
    </button>
  );
};

export default Seat;