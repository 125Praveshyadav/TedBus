import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import BusForm from "../../components/admin/BusForm";
import adminService from "../../services//adminService";
import { formatDateInput } from "../../utils/adminBusUtils";

const normalizeFormData = (bus = {}) => {
  return {
    busName: bus.busName || "",
    busNumber: bus.busNumber || "",
    operator: bus.operator || "",
    source: bus.source || "",
    destination: bus.destination || "",
    journeyDate: formatDateInput(bus.journeyDate),
    departureTime: bus.departureTime || "",
    arrivalTime: bus.arrivalTime || "",
    duration: bus.duration || "",
    totalSeats: bus.totalSeats || 48,
    availableSeats: bus.availableSeats ?? bus.totalSeats ?? 48,
    price: bus.price || "",
    rating: bus.rating || 4,
    busType: bus.busType || "AC Sleeper",
    boardingPoints: Array.isArray(bus.boardingPoints) ? bus.boardingPoints : [],
    droppingPoints: Array.isArray(bus.droppingPoints) ? bus.droppingPoints : [],
    bookedSeats: Array.isArray(bus.bookedSeats) ? bus.bookedSeats : [],
    amenities: Array.isArray(bus.amenities) ? bus.amenities : [],
  };
};

const EditBus = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const stateBus = location.state?.bus || null;

  const [formData, setFormData] = useState(() => normalizeFormData(stateBus || {}));
  const [boardingInput, setBoardingInput] = useState("");
  const [droppingInput, setDroppingInput] = useState("");
  const [loading, setLoading] = useState(!stateBus);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchBus = async () => {
    try {
      setLoading(true);

      const response = await adminService.getBuses();

      const buses =
        response?.buses ||
        response?.data?.buses ||
        [];

      const foundBus = buses.find((bus) => (bus._id || bus.id) === id);

      if (!foundBus) {
        throw new Error("Bus not found");
      }

      setFormData(normalizeFormData(foundBus));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err?.message || "Unable to load bus",
      }));
      toast.error(err?.message || "Unable to load bus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stateBus) {
      fetchBus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateField = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);

      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity],
      };
    });
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.busName.trim()) newErrors.busName = "Bus name is required";
    if (!formData.busNumber.trim()) newErrors.busNumber = "Bus number is required";
    if (!formData.source.trim()) newErrors.source = "Source is required";
    if (!formData.destination.trim()) newErrors.destination = "Destination is required";
    if (!formData.journeyDate) newErrors.journeyDate = "Journey date is required";
    if (!formData.departureTime) newErrors.departureTime = "Departure time is required";
    if (!formData.arrivalTime) newErrors.arrivalTime = "Arrival time is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.totalSeats || Number(formData.totalSeats) <= 0) newErrors.totalSeats = "Valid total seats required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    return {
      ...formData,
      journeyDate: new Date(formData.journeyDate),
      totalSeats: Number(formData.totalSeats),
      availableSeats: Number(formData.availableSeats),
      price: Number(formData.price),
      rating: Number(formData.rating || 4),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const response = await adminService.updateBus(id, buildPayload());

      toast.success(response?.message || "Bus updated successfully");

      navigate("/admin/buses");
    } catch (err) {
      const message = err?.message || "Unable to update bus";

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-600" />
          <p className="mt-4 text-sm font-bold text-slate-500">
            Loading bus details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BusForm
      title="Edit Bus"
      subtitle="Update bus schedule, route, fare and amenities."
      formData={formData}
      updateField={updateField}
      errors={errors}
      loading={saving}
      onSubmit={handleSubmit}
      boardingInput={boardingInput}
      setBoardingInput={setBoardingInput}
      droppingInput={droppingInput}
      setDroppingInput={setDroppingInput}
      addPoint={addPoint}
      removePoint={removePoint}
      toggleAmenity={toggleAmenity}
      submitLabel="Update Bus"
    />
  );
};

export default EditBus;