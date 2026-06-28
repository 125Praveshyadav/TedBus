import { Check } from "lucide-react";

const Seat = ({ seatNumber, isSelected, isBooked, onSelectSeat }) => {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBooked) return;

    onSelectSeat(seatNumber);
  };

  const getSeatStyle = () => {
    if (isBooked) {
      return "border-slate-300 bg-slate-300 text-slate-500 cursor-not-allowed opacity-80";
    }

    if (isSelected) {
      return "border-red-600 bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105";
    }

    return "border-slate-300 bg-white text-slate-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer";
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isBooked}
      title={`Seat ${seatNumber} - ${
        isBooked ? "Booked" : isSelected ? "Selected" : "Available"
      }`}
      className={`
        relative flex h-14 w-12 items-center justify-center rounded-t-2xl rounded-b-md border-2
        text-xs font-black transition-all duration-200
        ${getSeatStyle()}
      `}
    >
      {isSelected ? <Check className="h-5 w-5" /> : seatNumber}

      <span
        className={`absolute bottom-1 h-1 w-8 rounded-full opacity-40 ${
          isSelected ? "bg-white" : "bg-slate-400"
        }`}
      />
    </button>
  );
};

export default Seat;