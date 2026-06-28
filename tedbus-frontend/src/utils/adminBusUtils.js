export const busTypeOptions = [
  "AC Sleeper",
  "AC Seater",
  "Non AC Sleeper",
  "Non AC Seater",
];

export const amenityOptions = [
  "WiFi",
  "Charging Point",
  "CCTV",
  "Water Bottle",
  "Blanket",
  "Reading Light",
  "Emergency Exit",
];

export const formatDateInput = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
};

export const normalizeBus = (bus = {}) => {
  return {
    ...bus,
    id: bus._id || bus.id,
    name: bus.busName || bus.name || "Unnamed Bus",
    type: bus.busType || bus.type || "N/A",
    fare: bus.price || 0,
  };
};