import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bus,
  CalendarDays,
  Edit,
  IndianRupee,
  Layers,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";
import { normalizeBus } from "../../utils/adminBusUtils";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BUS_ICON_GRADIENTS = [
  "from-red-500 to-orange-400",
  "from-blue-500 to-indigo-400",
  "from-emerald-500 to-teal-400",
  "from-purple-500 to-fuchsia-400",
  "from-amber-500 to-orange-400",
  "from-slate-600 to-slate-400",
];

const getBusGradient = (seed) => {
  const str = String(seed || "");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BUS_ICON_GRADIENTS[Math.abs(hash) % BUS_ICON_GRADIENTS.length];
};

const getSeatStyle = (available, total) => {
  if (!total) return "text-slate-500 dark:text-slate-400";

  const ratio = available / total;

  if (ratio <= 0.15)
    return "text-red-600 dark:text-red-400";
  if (ratio <= 0.4)
    return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
};

const getSeatBarColor = (available, total) => {
  if (!total) return "bg-slate-300 dark:bg-slate-600";

  const ratio = available / total;

  if (ratio <= 0.15) return "bg-red-500";
  if (ratio <= 0.4) return "bg-amber-500";
  return "bg-emerald-500";
};

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

const ShimmerBlock = ({ className = "" }) => (
  <div
    className={`relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/70 ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:shimmer_1.4s_infinite] dark:via-white/10" />
  </div>
);

const ManageBusesSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <ShimmerBlock className="h-8 w-56" />
        <ShimmerBlock className="h-4 w-80" />
      </div>
      <ShimmerBlock className="h-12 w-36 rounded-2xl" />
    </div>

    <ShimmerBlock className="h-20 rounded-3xl" />

    <div className="space-y-3 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {Array.from({ length: 5 }).map((_, i) => (
        <ShimmerBlock key={i} className="h-16 rounded-2xl" />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* ManageBuses                                                          */
/* ------------------------------------------------------------------ */

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getBuses();

      const apiBuses =
        response?.buses ||
        response?.data?.buses ||
        [];

      setBuses(Array.isArray(apiBuses) ? apiBuses.map(normalizeBus) : []);
    } catch (err) {
      setError(err?.message || "Unable to fetch buses");
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const filteredBuses = useMemo(() => {
    if (!searchQuery.trim()) return buses;

    const query = searchQuery.trim().toLowerCase();

    return buses.filter((bus) => {
      return (
        bus.busName?.toLowerCase().includes(query) ||
        bus.busNumber?.toLowerCase().includes(query) ||
        bus.operator?.toLowerCase().includes(query) ||
        bus.source?.toLowerCase().includes(query) ||
        bus.destination?.toLowerCase().includes(query) ||
        bus.busType?.toLowerCase().includes(query)
      );
    });
  }, [buses, searchQuery]);

  const handleDelete = async (bus) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${bus.busName || "this bus"}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(bus.id);

      const response = await adminService.deleteBus(bus.id);

      setBuses((prev) => prev.filter((item) => item.id !== bus.id));

      toast.success(response?.message || "Bus deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to delete bus");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) {
    return (
      <>
        <GlobalKeyframes />
        <ManageBusesSkeleton />
      </>
    );
  }

  return (
    <div className="space-y-6">
      <GlobalKeyframes />

      {/* Header */}
      <div className="flex flex-col gap-4 opacity-0 [animation:fadeSlideUp_0.5s_ease-out_forwards] lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <Layers className="h-3 w-3" />
            Fleet management
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Manage Buses
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Add, update and remove buses from TedBus platform.
          </p>
        </div>

        <Link
          to="/admin/buses/add"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.98]"
        >
          <Plus className="h-5 w-5" />
          Add Bus
        </Link>
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 opacity-0 shadow-sm [animation-delay:80ms] [animation:fadeSlideUp_0.5s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bus, number, route..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 dark:focus:ring-red-500/15"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            {filteredBuses.length} bus{filteredBuses.length === 1 ? "" : "es"} found
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="relative overflow-hidden rounded-3xl border border-red-100 bg-red-50 p-8 text-center [animation:scaleIn_0.4s_ease-out_forwards] dark:border-red-900/40 dark:bg-red-950/20">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-200/40 blur-3xl dark:bg-red-900/20" />
          <AlertCircle className="relative mx-auto h-10 w-10 text-red-600 dark:text-red-400" />
          <h2 className="relative mt-3 text-xl font-black text-slate-900 dark:text-white">
            Unable to load buses
          </h2>
          <p className="relative mt-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchBuses}
            className="relative mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!error && filteredBuses.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-10 text-center opacity-0 shadow-sm [animation-delay:100ms] [animation:scaleIn_0.4s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-red-200/30 blur-3xl dark:bg-red-900/10" />
          <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <Bus className="h-8 w-8" />
          </div>
          <h2 className="relative mt-4 text-2xl font-black text-slate-900 dark:text-white">
            No buses found
          </h2>
          <p className="relative mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            Add your first bus to start managing TedBus fleet.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredBuses.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white opacity-0 shadow-sm [animation-delay:140ms] [animation:fadeSlideUp_0.5s_ease-out_forwards] dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Bus</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Timing</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBuses.map((bus, index) => {
                  const gradient = getBusGradient(
                    bus.busNumber || bus.busName || bus.id,
                  );
                  const seatRatioColor = getSeatStyle(
                    bus.availableSeats,
                    bus.totalSeats,
                  );
                  const seatBarColor = getSeatBarColor(
                    bus.availableSeats,
                    bus.totalSeats,
                  );
                  const seatPct = bus.totalSeats
                    ? Math.min(
                        (bus.availableSeats / bus.totalSeats) * 100,
                        100,
                      )
                    : 0;

                  return (
                    <tr
                      key={bus.id}
                      style={{
                        animationDelay: `${index * 40}ms`,
                      }}
                      className="border-t border-slate-100 opacity-0 [animation:fadeSlideUp_0.4s_ease-out_forwards] transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-md transition-transform duration-300 hover:scale-105`}
                          >
                            <Bus className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white">
                              {bus.busName || "Unnamed Bus"}
                            </p>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {bus.busNumber || "No Number"} • {bus.busType || "N/A"}
                            </p>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                              {bus.operator || "No Operator"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {bus.source} → {bus.destination}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                          <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-400" />
                          {formatDate(bus.journeyDate)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {bus.departureTime || "—"} - {bus.arrivalTime || "—"}
                        </p>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {bus.duration || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className={`font-black ${seatRatioColor}`}>
                          {bus.availableSeats || 0}/{bus.totalSeats || 0}
                        </p>
                        <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${seatBarColor}`}
                            style={{ width: `${seatPct}%` }}
                          />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="flex items-center gap-1 font-black text-red-600 dark:text-red-400">
                          <IndianRupee className="h-4 w-4" />
                          {bus.price || 0}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/buses/edit/${bus.id}`}
                            state={{
                              bus,
                            }}
                            className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:scale-105 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/60"
                            title="Edit Bus"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(bus)}
                            disabled={deletingId === bus.id}
                            className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:scale-105 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-950/60"
                            title="Delete Bus"
                          >
                            {deletingId === bus.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Keyframes (injected once)                                           */
/* ------------------------------------------------------------------ */

const GlobalKeyframes = () => (
  <style>{`
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      100% { transform: translateX(100%); }
    }
  `}</style>
);

export default ManageBuses;