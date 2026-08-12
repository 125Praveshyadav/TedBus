import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CalendarDays, Repeat, Sparkles, Info } from "lucide-react";

import BusForm from "../../components/admin/BusForm";
import adminService from "../../services/adminService";

const initialForm = {
  busName: "",
  busNumber: "",
  operator: "",
  source: "",
  destination: "",
  journeyDate: "",
  departureTime: "",
  arrivalTime: "",
  duration: "",
  totalSeats: 48,
  availableSeats: 48,
  price: "",
  rating: 4,
  busType: "AC Sleeper",
  boardingPoints: [],
  droppingPoints: [],
  bookedSeats: [],
  amenities: [],
  // 🆕 Schedule fields
  isDaily: false,
  scheduleStartDate: "",
  scheduleEndDate: "",
};

const AddBus = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [boardingInput, setBoardingInput] = useState("");
  const [droppingInput, setDroppingInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (name, value) => {
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "totalSeats") next.availableSeats = value;
      return next;
    });

    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addPoint = (type) => {
    const value =
      type === "boarding" ? boardingInput.trim() : droppingInput.trim();
    if (!value) return;

    if (type === "boarding") {
      setFormData((prev) => ({
        ...prev,
        boardingPoints: [...prev.boardingPoints, value],
      }));
      setBoardingInput("");
    } else {
      setFormData((prev) => ({
        ...prev,
        droppingPoints: [...prev.droppingPoints, value],
      }));
      setDroppingInput("");
    }
  };

  const removePoint = (field, point) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== point),
    }));
  };

  // 🆕 Schedule mode toggle
  const setScheduleMode = (isDaily) => {
    setFormData((prev) => ({
      ...prev,
      isDaily,
      // Clear the other mode's fields
      ...(isDaily
        ? { journeyDate: "" }
        : { scheduleStartDate: "", scheduleEndDate: "" }),
    }));
    setErrors((prev) => ({
      ...prev,
      journeyDate: "",
      scheduleStartDate: "",
      scheduleEndDate: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.busName.trim()) newErrors.busName = "Bus name is required";
    if (!formData.busNumber.trim()) newErrors.busNumber = "Bus number is required";
    if (!formData.source.trim()) newErrors.source = "Source is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";

    // 🆕 Schedule validation
    if (formData.isDaily) {
      if (!formData.scheduleStartDate) {
        newErrors.scheduleStartDate = "Start date is required for daily schedule";
      }
      if (
        formData.scheduleEndDate &&
        formData.scheduleStartDate &&
        new Date(formData.scheduleEndDate) < new Date(formData.scheduleStartDate)
      ) {
        newErrors.scheduleEndDate = "End date must be after start date";
      }
    } else {
      if (!formData.journeyDate) newErrors.journeyDate = "Journey date is required";
    }

    if (!formData.departureTime) newErrors.departureTime = "Departure time is required";
    if (!formData.arrivalTime) newErrors.arrivalTime = "Arrival time is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.totalSeats || Number(formData.totalSeats) <= 0) newErrors.totalSeats = "Valid total seats required";

    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() ===
        formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Source and destination cannot be same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    const totalSeats = Number(formData.totalSeats);

    const basePayload = {
      ...formData,
      totalSeats,
      availableSeats: Number(formData.availableSeats || totalSeats),
      price: Number(formData.price),
      rating: Number(formData.rating || 4),
      bookedSeats: [],
    };

    // 🆕 Schedule handling
    if (formData.isDaily) {
      basePayload.isDaily = true;
      basePayload.scheduleStartDate = new Date(formData.scheduleStartDate);
      basePayload.scheduleEndDate = formData.scheduleEndDate
        ? new Date(formData.scheduleEndDate)
        : null;
      // For daily buses, journeyDate = start date (so old queries still work)
      basePayload.journeyDate = new Date(formData.scheduleStartDate);
    } else {
      basePayload.isDaily = false;
      basePayload.journeyDate = new Date(formData.journeyDate);
      basePayload.scheduleStartDate = null;
      basePayload.scheduleEndDate = null;
    }

    return basePayload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await adminService.addBus(buildPayload());
      toast.success(response?.message || "Bus added successfully");
      navigate("/admin/buses");
    } catch (err) {
      const message = err?.message || "Unable to add bus";
      setErrors((prev) => ({ ...prev, general: message }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ===== 🆕 Schedule Type Card ===== */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-1 bg-gradient-to-r from-slate-900 via-red-700 to-red-500" />

        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-red-900 to-red-700 text-white shadow-md shadow-red-900/30 dark:from-red-600 dark:to-red-800">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Schedule Type
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Choose how this bus runs
              </p>
            </div>
          </div>

          {/* Toggle Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            {/* One-time Schedule */}
            <button
              type="button"
              onClick={() => setScheduleMode(false)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                !formData.isDaily
                  ? "border-red-400 bg-red-50 shadow-md shadow-red-500/10 dark:border-red-500/50 dark:bg-red-500/10"
                  : "border-slate-200 bg-slate-50/60 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600"
              }`}
            >
              {!formData.isDaily && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500" />
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                    !formData.isDaily
                      ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-500/25"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-black ${
                      !formData.isDaily
                        ? "text-red-700 dark:text-red-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Specific Date
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Bus runs only on the selected date
                  </p>
                </div>
              </div>
            </button>

            {/* Daily Schedule */}
            <button
              type="button"
              onClick={() => setScheduleMode(true)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                formData.isDaily
                  ? "border-red-400 bg-red-50 shadow-md shadow-red-500/10 dark:border-red-500/50 dark:bg-red-500/10"
                  : "border-slate-200 bg-slate-50/60 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600"
              }`}
            >
              {formData.isDaily && (
                <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-red-600 to-orange-500" />
              )}
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                    formData.isDaily
                      ? "bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-500/25"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <Repeat className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-sm font-black ${
                        formData.isDaily
                          ? "text-red-700 dark:text-red-400"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      Runs Daily
                    </p>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                      <Sparkles className="h-2 w-2" />
                      New
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Bus runs everyday at the same time
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* 🆕 Daily Schedule Date Range */}
          {formData.isDaily && (
            <div className="animate-in fade-in slide-in-from-top-1 mt-4 rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/70 to-orange-50/50 p-4 dark:border-red-900/30 dark:from-red-500/[0.06] dark:to-orange-500/[0.04]">
              <div className="mb-3 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  This bus will be available for booking on every day between the start and end dates at the same departure/arrival time.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.scheduleStartDate}
                    onChange={(e) =>
                      updateField("scheduleStartDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full rounded-xl border-2 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:bg-slate-800 dark:text-white dark:focus:border-red-600 dark:focus:ring-red-500/10 ${
                      errors.scheduleStartDate
                        ? "border-red-400 dark:border-red-500/50"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.scheduleStartDate && (
                    <p className="mt-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                      {errors.scheduleStartDate}
                    </p>
                  )}
                </div>

                {/* End Date (Optional) */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    End Date{" "}
                    <span className="font-medium normal-case text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={formData.scheduleEndDate}
                    onChange={(e) =>
                      updateField("scheduleEndDate", e.target.value)
                    }
                    min={
                      formData.scheduleStartDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className={`w-full rounded-xl border-2 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:bg-slate-800 dark:text-white dark:focus:border-red-600 dark:focus:ring-red-500/10 ${
                      errors.scheduleEndDate
                        ? "border-red-400 dark:border-red-500/50"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {errors.scheduleEndDate && (
                    <p className="mt-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                      {errors.scheduleEndDate}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    Leave empty for indefinite schedule
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Existing BusForm ===== */}
      <BusForm
        title="Add Bus"
        subtitle={
          formData.isDaily
            ? "Create a daily-running bus schedule for TedBus."
            : "Create a new bus schedule for TedBus."
        }
        formData={formData}
        updateField={updateField}
        errors={errors}
        loading={loading}
        onSubmit={handleSubmit}
        boardingInput={boardingInput}
        setBoardingInput={setBoardingInput}
        droppingInput={droppingInput}
        setDroppingInput={setDroppingInput}
        addPoint={addPoint}
        removePoint={removePoint}
        toggleAmenity={toggleAmenity}
        submitLabel={formData.isDaily ? "Add Daily Bus" : "Add Bus"}
        isDaily={formData.isDaily} // 🆕 pass to BusForm (optional — see notes below)
      />
    </div>
  );
};

export default AddBus;