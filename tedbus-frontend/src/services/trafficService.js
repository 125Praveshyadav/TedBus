import axios from "axios";

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

// Kisi point pe live traffic — currentSpeed vs freeFlowSpeed
export const getTrafficAtPoint = async (lat, lng) => {
  try {
    const res = await axios.get(
      `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json`,
      { params: { key: TOMTOM_KEY, point: `${lat},${lng}` } }
    );

    const data = res.data?.flowSegmentData;
    if (!data) return null;

    const ratio = data.currentSpeed / data.freeFlowSpeed;

    let level = "smooth";
    if (ratio < 0.5) level = "heavy";
    else if (ratio < 0.8) level = "moderate";

    return {
      currentSpeed: data.currentSpeed,
      freeFlowSpeed: data.freeFlowSpeed,
      level, // smooth | moderate | heavy
      delayFactor: Math.round((1 / ratio - 1) * 100), // % slower
    };
  } catch {
    return null;
  }
};

// Route ke beech ke point pe traffic check (route ka congestion)
export const getRouteTraffic = async (routeLeg) => {
  try {
    const path = routeLeg.steps;
    const midStep = path[Math.floor(path.length / 2)];
    const point = midStep.start_location;
    return await getTrafficAtPoint(point.lat(), point.lng());
  } catch {
    return null;
  }
};