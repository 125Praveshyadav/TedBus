const KEY = import.meta.env.VITE_TOMTOM_API_KEY;
const BASE = "https://api.tomtom.com";

// Location search (autocomplete ke liye)
export const searchPlaces = async (query, countrySet = "IN") => {
  if (!query || query.length < 2) return [];

  const res = await fetch(
    `${BASE}/search/2/search/${encodeURIComponent(query)}.json?key=${KEY}&countrySet=${countrySet}&language=en-GB&limit=6&typeahead=true`
  );

  if (!res.ok) return [];

  const data = await res.json();

  return (data.results || []).map((r) => ({
    id: r.id,
    name: r.address?.freeformAddress || r.poi?.name || "Unknown",
    lat: r.position.lat,
    lng: r.position.lon,
  }));
};

// Route calculate karna (traffic ke saath)
export const calculateRoute = async (start, end, waypoints = []) => {
  const waypointStr = waypoints
    .map((w) => `${w.lat},${w.lng}`)
    .join(":");

  const mid = waypointStr ? `:${waypointStr}:` : ":";

  const coords = `${start.lat},${start.lng}${mid}${end.lat},${end.lng}`;

  const res = await fetch(
    `${BASE}/routing/1/calculateRoute/${coords}/json?key=${KEY}&traffic=true&travelMode=car&maxAlternatives=2&instructionsType=text&computeBestOrder=false&language=en-GB`
  );

  if (!res.ok) throw new Error("Route calculation failed");

  const data = await res.json();

  return (data.routes || []).map((route) => {
    const summary = route.summary;
    const leg = route.legs[0];

    return {
      summary,
      distanceMeters: summary.lengthInMeters,
      distanceKm: (summary.lengthInMeters / 1000).toFixed(1),
      durationSeconds: summary.travelTimeInSeconds,
      durationText: formatDuration(summary.travelTimeInSeconds),
      trafficDelaySeconds: summary.trafficDelayInSeconds || 0,
      trafficDelayText: formatDuration(summary.trafficDelayInSeconds || 0),
      points: route.legs.flatMap((l) =>
        l.points.map((p) => [p.latitude, p.longitude])
      ),
    };
  });
};

// TomTom Traffic Flow — live congestion
export const getTrafficFlow = async (lat, lng) => {
  try {
    const res = await fetch(
      `${BASE}/traffic/services/4/flowSegmentData/relative0/10/json?key=${KEY}&point=${lat},${lng}`
    );

    if (!res.ok) return null;

    const data = await res.json();
    const flow = data.flowSegmentData;

    if (!flow) return null;

    const ratio = flow.currentSpeed / flow.freeFlowSpeed;

    return {
      currentSpeed: Math.round(flow.currentSpeed),
      freeFlowSpeed: Math.round(flow.freeFlowSpeed),
      ratio,
      level: ratio < 0.5 ? "heavy" : ratio < 0.8 ? "moderate" : "smooth",
      delayPercent: Math.round((1 / ratio - 1) * 100),
    };
  } catch {
    return null;
  }
};

const formatDuration = (seconds) => {
  if (!seconds || seconds < 60) return "< 1 min";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
};