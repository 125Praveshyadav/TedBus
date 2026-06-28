import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  X,
} from "lucide-react";

import {
  amenityOptions,
  busTypeOptions,
} from "../../utils/adminBusUtils";

const BusForm = ({
  title,
  subtitle,
  formData,
  updateField,
  errors = {},
  loading,
  onSubmit,
  boardingInput,
  setBoardingInput,
  droppingInput,
  setDroppingInput,
  addPoint,
  removePoint,
  toggleAmenity,
  submitLabel = "Save Bus",
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>

        <Link
          to="/admin/buses"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buses
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {errors.general && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            {errors.general}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Bus Name"
            name="busName"
            value={formData.busName}
            onChange={updateField}
            error={errors.busName}
          />

          <Input
            label="Bus Number"
            name="busNumber"
            value={formData.busNumber}
            onChange={updateField}
            error={errors.busNumber}
          />

          <Input
            label="Operator"
            name="operator"
            value={formData.operator}
            onChange={updateField}
          />

          <Select
            label="Bus Type"
            name="busType"
            value={formData.busType}
            onChange={updateField}
            options={busTypeOptions}
          />

          <Input
            label="Source"
            name="source"
            value={formData.source}
            onChange={updateField}
            error={errors.source}
          />

          <Input
            label="Destination"
            name="destination"
            value={formData.destination}
            onChange={updateField}
            error={errors.destination}
          />

          <Input
            label="Journey Date"
            name="journeyDate"
            type="date"
            value={formData.journeyDate}
            onChange={updateField}
            error={errors.journeyDate}
          />

          <Input
            label="Departure Time"
            name="departureTime"
            type="time"
            value={formData.departureTime}
            onChange={updateField}
            error={errors.departureTime}
          />

          <Input
            label="Arrival Time"
            name="arrivalTime"
            type="time"
            value={formData.arrivalTime}
            onChange={updateField}
            error={errors.arrivalTime}
          />

          <Input
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={updateField}
            placeholder="e.g. 8h 30m"
          />

          <Input
            label="Total Seats"
            name="totalSeats"
            type="number"
            value={formData.totalSeats}
            onChange={updateField}
            error={errors.totalSeats}
          />

          <Input
            label="Available Seats"
            name="availableSeats"
            type="number"
            value={formData.availableSeats}
            onChange={updateField}
          />

          <Input
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={updateField}
            error={errors.price}
          />

          <Input
            label="Rating"
            name="rating"
            type="number"
            value={formData.rating}
            onChange={updateField}
          />
        </div>

        {/* Amenities */}
        <div className="mt-8">
          <h3 className="text-lg font-black text-slate-900">Amenities</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Select facilities available in this bus.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {amenityOptions.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`rounded-2xl border px-4 py-2 text-sm font-black transition ${
                  formData.amenities.includes(amenity)
                    ? "border-red-600 bg-red-50 text-red-600"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Boarding / Dropping */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <PointEditor
            title="Boarding Points"
            value={boardingInput}
            setValue={setBoardingInput}
            points={formData.boardingPoints}
            onAdd={() => addPoint("boarding")}
            onRemove={(point) => removePoint("boardingPoints", point)}
          />

          <PointEditor
            title="Dropping Points"
            value={droppingInput}
            setValue={setDroppingInput}
            points={formData.droppingPoints}
            onAdd={() => addPoint("dropping")}
            onRemove={(point) => removePoint("droppingPoints", point)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          {loading ? "Saving..." : submitLabel}
        </button>
      </form>
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
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-slate-700">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 ${
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

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-sm font-black text-slate-700">
      {label}
    </label>

    <select
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold outline-none transition focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
    >
      {options.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  </div>
);

const PointEditor = ({
  title,
  value,
  setValue,
  points,
  onAdd,
  onRemove,
}) => (
  <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
    <h3 className="font-black text-slate-900">{title}</h3>

    <div className="mt-4 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Add ${title.toLowerCase()}`}
        className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-red-500"
      />

      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl bg-red-600 px-4 py-3 text-white transition hover:bg-red-700"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>

    <div className="mt-4 flex flex-wrap gap-2">
      {points?.length > 0 ? (
        points.map((point) => (
          <span
            key={point}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-xs font-black text-slate-700"
          >
            {point}

            <button type="button" onClick={() => onRemove(point)}>
              <X className="h-3.5 w-3.5 text-red-600" />
            </button>
          </span>
        ))
      ) : (
        <p className="text-sm font-semibold text-slate-400">
          No points added yet.
        </p>
      )}
    </div>
  </div>
);

export default BusForm;