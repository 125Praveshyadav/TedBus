import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Edit,
  IndianRupee,
  Loader2,
  MapPin,
  Plus,
  RefreshCcw,
  Route,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import adminService from "../../services/adminService";

const initialForm = {
  source: "",
  destination: "",
  distance: "",
  estimatedDuration: "",
  baseFare: "",
  isActive: true,
};

const normalizeRoute = (route = {}) => {
  return {
    ...route,
    id: route._id || route.id,
    source: route.source || "",
    destination: route.destination || "",
    distance: route.distance || 0,
    estimatedDuration: route.estimatedDuration || "",
    baseFare: route.baseFare || 0,
    isActive: route.isActive !== undefined ? route.isActive : true,
  };
};

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getRoutes();

      const apiRoutes =
        response?.routes ||
        response?.data?.routes ||
        [];

      const normalized = Array.isArray(apiRoutes)
        ? apiRoutes.map(normalizeRoute)
        : [];

      setRoutes(normalized);
    } catch (err) {
      setError(err?.message || "Unable to load routes");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const filteredRoutes = useMemo(() => {
    let result = [...routes];

    if (statusFilter !== "all") {
      const active = statusFilter === "active";
      result = result.filter((route) => route.isActive === active);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((route) => {
        return (
          route.source?.toLowerCase().includes(query) ||
          route.destination?.toLowerCase().includes(query) ||
          route.estimatedDuration?.toLowerCase().includes(query)
        );
      });
    }

    return result;
  }, [routes, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    return {
      total: routes.length,
      active: routes.filter((route) => route.isActive).length,
      inactive: routes.filter((route) => !route.isActive).length,
      avgFare:
        routes.length > 0
          ? Math.round(
              routes.reduce((sum, route) => sum + Number(route.baseFare || 0), 0) /
                routes.length
            )
          : 0,
    };
  }, [routes]);

  const openAddModal = () => {
    setEditingRoute(null);
    setFormData(initialForm);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (route) => {
    setEditingRoute(route);
    setFormData({
      source: route.source,
      destination: route.destination,
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
      baseFare: route.baseFare,
      isActive: route.isActive,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingRoute(null);
    setFormData(initialForm);
    setFormErrors({});
  };

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.source.trim()) {
      errors.source = "Source is required";
    }

    if (!formData.destination.trim()) {
      errors.destination = "Destination is required";
    }

    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() ===
        formData.destination.trim().toLowerCase()
    ) {
      errors.destination = "Source and destination cannot be same";
    }

    if (!formData.distance || Number(formData.distance) <= 0) {
      errors.distance = "Valid distance is required";
    }

    if (!formData.estimatedDuration.trim()) {
      errors.estimatedDuration = "Estimated duration is required";
    }

    if (!formData.baseFare || Number(formData.baseFare) < 0) {
      errors.baseFare = "Valid base fare is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => {
    return {
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      distance: Number(formData.distance),
      estimatedDuration: formData.estimatedDuration.trim(),
      baseFare: Number(formData.baseFare),
      isActive: Boolean(formData.isActive),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const payload = buildPayload();

      if (editingRoute) {
        const response = await adminService.updateRoute(editingRoute.id, payload);

        const updated =
          response?.route ||
          response?.data?.route ||
          {
            ...editingRoute,
            ...payload,
          };

        setRoutes((prev) =>
          prev.map((item) =>
            item.id === editingRoute.id ? normalizeRoute(updated) : item
          )
        );

        toast.success(response?.message || "Route updated successfully");
      } else {
        const response = await adminService.addRoute(payload);

        const created =
          response?.route ||
          response?.data?.route ||
          payload;

        setRoutes((prev) => [normalizeRoute(created), ...prev]);

        toast.success(response?.message || "Route added successfully");
      }

      closeModal();
    } catch (err) {
      const message = err?.message || "Unable to save route";

      setFormErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (route) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete route ${route.source} → ${route.destination}?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(route.id);

      const response = await adminService.deleteRoute(route.id);

      setRoutes((prev) => prev.filter((item) => item.id !== route.id));

      toast.success(response?.message || "Route deleted successfully");
    } catch (err) {
      toast.error(err?.message || "Unable to delete route");
    } finally {
      setDeletingId("");
    }
  };

  const toggleRouteStatus = async (route) => {
    try {
      const response = await adminService.updateRoute(route.id, {
        isActive: !route.isActive,
      });

      const updated =
        response?.route ||
        response?.data?.route ||
        {
          ...route,
          isActive: !route.isActive,
        };

      setRoutes((prev) =>
        prev.map((item) =>
          item.id === route.id ? normalizeRoute(updated) : item
        )
      );

      toast.success(
        updated.isActive
          ? "Route activated successfully"
          : "Route deactivated successfully"
      );
    } catch (err) {
      toast.error(err?.message || "Unable to update route status");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading routes...
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
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900">
            <Route className="h-8 w-8 text-red-600" />
            Manage Routes
          </h1>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Create and manage source-destination routes for TedBus.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={fetchRoutes}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Add Route
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Routes" value={stats.total} />
        <StatCard title="Active Routes" value={stats.active} color="green" />
        <StatCard title="Inactive Routes" value={stats.inactive} color="red" />
        <StatCard title="Avg Base Fare" value={`₹${stats.avgFare}`} color="amber" />
      </div>

      {/* Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search source, destination, duration..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-red-500"
          >
            <option value="all">All Routes</option>
            <option value="active">Active Routes</option>
            <option value="inactive">Inactive Routes</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-10 w-10 text-red-600" />

          <h2 className="mt-3 text-xl font-black text-slate-900">
            Unable to load routes
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-600">
            {error}
          </p>
        </div>
      )}

      {/* Empty */}
      {!error && filteredRoutes.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Route className="mx-auto h-14 w-14 text-red-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-900">
            No routes found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            Add your first route to start assigning buses.
          </p>
        </div>
      )}

      {/* Table */}
      {!error && filteredRoutes.length > 0 && (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Distance</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Base Fare</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRoutes.map((route) => (
                  <tr
                    key={route.id}
                    className="border-t border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                          <MapPin className="h-6 w-6" />
                        </div>

                        <div>
                          <p className="flex items-center gap-2 font-black text-slate-900">
                            {route.source}
                            <ArrowRight className="h-4 w-4 text-slate-400" />
                            {route.destination}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            Route ID: {route.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {route.distance} km
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {route.estimatedDuration}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1 font-black text-red-600">
                        <IndianRupee className="h-4 w-4" />
                        {route.baseFare}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => toggleRouteStatus(route)}
                        className={`rounded-full border px-3 py-1 text-xs font-black ${
                          route.isActive
                            ? "border-green-100 bg-green-50 text-green-700"
                            : "border-red-100 bg-red-50 text-red-700"
                        }`}
                      >
                        {route.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(route)}
                          className="rounded-xl bg-blue-50 p-3 text-blue-600 transition hover:bg-blue-100"
                          title="Edit Route"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(route)}
                          disabled={deletingId === route.id}
                          className="rounded-xl bg-red-50 p-3 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          title="Delete Route"
                        >
                          {deletingId === route.id ? (
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

      {/* Modal */}
      {modalOpen && (
        <RouteModal
          editingRoute={editingRoute}
          formData={formData}
          errors={formErrors}
          saving={saving}
          updateField={updateField}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

const RouteModal = ({
  editingRoute,
  formData,
  errors,
  saving,
  updateField,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {editingRoute ? "Edit Route" : "Add Route"}
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              {editingRoute
                ? "Update existing route details."
                : "Create a new active route."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-2xl bg-slate-100 p-3 text-slate-600 transition hover:bg-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-6">
          {errors.general && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              {errors.general}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Source"
              name="source"
              value={formData.source}
              onChange={updateField}
              error={errors.source}
              placeholder="Delhi"
            />

            <Input
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={updateField}
              error={errors.destination}
              placeholder="Lucknow"
            />

            <Input
              label="Distance (km)"
              name="distance"
              type="number"
              value={formData.distance}
              onChange={updateField}
              error={errors.distance}
              placeholder="500"
            />

            <Input
              label="Estimated Duration"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={updateField}
              error={errors.estimatedDuration}
              placeholder="8h 30m"
            />

            <Input
              label="Base Fare"
              name="baseFare"
              type="number"
              value={formData.baseFare}
              onChange={updateField}
              error={errors.baseFare}
              placeholder="899"
            />

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Status
              </label>

              <select
                value={formData.isActive ? "active" : "inactive"}
                onChange={(e) =>
                  updateField("isActive", e.target.value === "active")
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {saving
                ? "Saving..."
                : editingRoute
                ? "Update Route"
                : "Add Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  error,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

const StatCard = ({ title, value, color = "slate" }) => {
  const colors = {
    slate: "bg-slate-50 text-slate-900",
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p
        className={`mt-2 rounded-2xl px-3 py-2 text-2xl font-black ${colors[color]}`}
      >
        {value}
      </p>
    </div>
  );
};

export default ManageRoutes;