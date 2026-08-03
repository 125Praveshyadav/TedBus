import { Bus } from "lucide-react";
import BusCard from "./BusCard";

const BusList = ({ buses = [], journeyDate }) => {
  if (!Array.isArray(buses) || buses.length === 0) {
    return (
      <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 dark:bg-slate-950 text-slate-400">
          <Bus className="h-8 w-8" />
        </div>

        <h3 className="mt-5 text-xl font-black text-slate-900 dark:text-white">
          No buses found
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Try changing your route, date, filters or sort options.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {buses.map((bus , index) => {
      
  // const busId = bus._id || bus.id;
        return   <BusCard
    key={bus._id || bus.id || index}
    bus={bus}
    journeyDate={journeyDate}
    index={index}      
  />;
      })}
    </div>
  );
};

export default BusList;
