import { Bus } from "lucide-react";
import BusCard from "./BusCard";

const BusList = ({ buses = [], journeyDate }) => {
  if (!Array.isArray(buses) || buses.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
          <Bus className="h-8 w-8" />
        </div>

        <h3 className="mt-5 text-xl font-black text-slate-900">
          No buses found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Try changing your route, date, filters or sort options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {buses.map((bus) => {
        const busId = bus._id || bus.id;

        return (
          <BusCard
            key={busId}
            bus={bus}
            journeyDate={journeyDate}
          />
        );
      })}
    </div>
  );
};

export default BusList;