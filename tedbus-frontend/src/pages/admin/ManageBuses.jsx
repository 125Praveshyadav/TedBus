import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  Bus,
  CalendarDays,
  Edit,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";
import { normalizeBus } from "../../utils/adminBusUtils";

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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading buses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Manage Buses
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Add, update and remove buses from TedBus platform.
          </p>
        </div>

        <Link
          to="/admin/buses/add"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
        >
          <Plus className="h-5 w-5" />
          Add Bus
        </Link>
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bus, number, route..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
            {filteredBuses.length} bus{filteredBuses.length === 1 ? "" : "es"} found
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />
          <h2 className="mt-3 text-xl font-black text-slate-900">
            Unable to load buses
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
          <button
            type="button"
            onClick={fetchBuses}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {!error && filteredBuses.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Bus className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No buses found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Add your first bus to start managing TedBus fleet.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredBuses.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
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
                {filteredBuses.map((bus) => (
                  <tr
                    key={bus.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                          <Bus className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">
                            {bus.busName || "Unnamed Bus"}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            {bus.busNumber || "No Number"} • {bus.busType || "N/A"}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {bus.operator || "No Operator"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {bus.source} → {bus.destination}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-bold text-slate-700">
                        <CalendarDays className="h-4 w-4 text-red-600" />
                        {formatDate(bus.journeyDate)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {bus.departureTime || "—"} - {bus.arrivalTime || "—"}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {bus.duration || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {bus.availableSeats || 0}/{bus.totalSeats || 0}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-black text-red-600">
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
                          className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                          title="Edit Bus"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(bus)}
                          disabled={deletingId === bus.id}
                          className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBuses;