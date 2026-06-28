import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "totalSeats") {
        next.availableSeats = value;
      }

      return next;
    });

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

    return {
      ...formData,
      journeyDate: new Date(formData.journeyDate),
      totalSeats,
      availableSeats: Number(formData.availableSeats || totalSeats),
      price: Number(formData.price),
      rating: Number(formData.rating || 4),
      bookedSeats: [],
    };
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

      setErrors((prev) => ({
        ...prev,
        general: message,
      }));

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BusForm
      title="Add Bus"
      subtitle="Create a new bus schedule for TedBus."
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
      submitLabel="Add Bus"
    />
  );
};

export default AddBus;