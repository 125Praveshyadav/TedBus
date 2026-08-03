import { useState, useRef, useCallback, useEffect } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import {
  Navigation, Plus, X, Loader2, Clock, Ruler,
  Bookmark, RotateCcw, Trash2, ChevronRight,
  BookmarkCheck, TrafficCone, ArrowDownUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTheme } from "../../components/context/ThemeContext";
import {
  calculateRoute as calcTomTomRoute,
  getTrafficFlow,
} from "../../services/tomtomService";
import savedRouteService from "../../services/savedRouteService";
import LocationSearchInput from "../../components/routePlanner/LocationSearchInput";
import TrafficIndicator from "../../components/routePlanner/TrafficIndicator";

// ============================================
//  MAP HELPERS
// ============================================
const createMarker = (map, lngLat, color = "#dc2626", label = "") => {
  const el = document.createElement("div");
  el.style.cssText = `
    width: 36px; height: 36px;
    background: ${color};
    border: 3px solid white;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  `;
  const inner = document.createElement("div");
  inner.style.cssText = `
    transform: rotate(45deg);
    color: white;
    font-size: 11px;
    font-weight: 900;
    width: 100%; text-align: center;
  `;
  inner.textContent = label;
  el.appendChild(inner);

  return new tt.Marker({ element: el })
    .setLngLat(lngLat)
    .addTo(map);
};

const drawRoute = (map, points, color = "#dc2626", layerId) => {
  const geojson = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: points.map(([lat, lng]) => [lng, lat]),
    },
  };

  if (map.getLayer(layerId)) map.removeLayer(layerId);
  if (map.getSource(layerId)) map.removeSource(layerId);

  map.addSource(layerId, { type: "geojson", data: geojson });
  map.addLayer({
    id: layerId,
    type: "line",
    source: layerId,
    paint: {
      "line-color": color,
      "line-width": 5,
      "line-opacity": 0.9,
    },
  });
};

const routeColors = ["#dc2626", "#64748b", "#94a3b8"];

// ============================================
//  MAIN COMPONENT
// ============================================
const RoutePlanner = () => {
  const { isDark } = useTheme();
   
  // Map state
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayersRef = useRef([]);
  const pollingRef = useRef(null);

  // Location state
  const [startPlace, setStartPlace] = useState(null);
  const [endPlace, setEndPlace] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  // Route state
  const [routes, setRoutes] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [routeTraffic, setRouteTraffic] = useState({});
  const [loading, setLoading] = useState(false);

  // Saved routes
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [savedLoading, setSavedLoading] = useState(false);

  // ============ MAP INIT ============
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY,
      container: mapContainerRef.current,
      center: [78.9629, 20.5937],
      zoom: 4.5,
      language: "en-GB",
    });

    map.addControl(new tt.NavigationControl(), "top-right");
    map.addControl(new tt.FullscreenControl(), "top-right");
    mapRef.current = map;

    return () => {
      clearInterval(pollingRef.current);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ============ MAP HELPERS ============
  const clearMapLayers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    routeLayersRef.current.forEach((id) => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    });
    routeLayersRef.current = [];

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const fitMapToRoute = useCallback((points) => {
    const map = mapRef.current;
    if (!map || points.length === 0) return;

    const bounds = new tt.LngLatBounds();
    points.forEach(([lat, lng]) => bounds.extend([lng, lat]));
    map.fitBounds(bounds, { padding: 60, maxZoom: 14 });
  }, []);

  // ============ TRAFFIC CHECK ============
  const checkTrafficForRoutes = useCallback(async (routeList) => {
    const results = {};
    await Promise.all(
      routeList.map(async (route, idx) => {
        const midPoint = route.points[Math.floor(route.points.length / 2)];
        if (midPoint) {
          const t = await getTrafficFlow(midPoint[0], midPoint[1]);
          if (t) results[idx] = t;
        }
      })
    );
    return results;
  }, []);

  // ============ CALCULATE ROUTE ============
  const handleCalculate = useCallback(async () => {
    if (!startPlace || !endPlace) {
      return toast.error("Please select start and destination");
    }

    const map = mapRef.current;
    if (!map) return;

    setLoading(true);
    clearMapLayers();

    try {
      const wps = waypoints
        .filter((w) => w.place)
        .map((w) => ({ lat: w.place.lat, lng: w.place.lng }));

      const result = await calcTomTomRoute(startPlace, endPlace, wps);

      if (!result || result.length === 0) {
        return toast.error("No route found. Try different locations.");
      }

      setRoutes(result);
      setSelectedIdx(0);

      // Draw all routes — selected: red, others: gray
      result.forEach((route, idx) => {
        const layerId = `route-${idx}-${Date.now()}`;
        routeLayersRef.current.push(layerId);

        if (map.loaded()) {
          drawRoute(map, route.points, routeColors[idx] || "#94a3b8", layerId);
        } else {
          map.on("load", () => {
            drawRoute(map, route.points, routeColors[idx] || "#94a3b8", layerId);
          });
        }
      });

      // Add markers
      const startMarker = createMarker(
        map,
        [startPlace.lng, startPlace.lat],
        "#16a34a",
        "A"
      );
      const endMarker = createMarker(
        map,
        [endPlace.lng, endPlace.lat],
        "#dc2626",
        "B"
      );
      markersRef.current = [startMarker, endMarker];

      waypoints
        .filter((w) => w.place)
        .forEach((w, idx) => {
          const m = createMarker(map, [w.place.lng, w.place.lat], "#f59e0b", `${idx + 1}`);
          markersRef.current.push(m);
        });

      fitMapToRoute(result[0].points);

      // Traffic check
      const traffic = await checkTrafficForRoutes(result);
      setRouteTraffic(traffic);

      // Polling — har 60 sec
      clearInterval(pollingRef.current);
      pollingRef.current = setInterval(async () => {
        const fresh = await checkTrafficForRoutes(result);
        setRouteTraffic((prev) => {
          const prevLevel = prev[0]?.level;
          const freshLevel = fresh[0]?.level;
          if (prevLevel && freshLevel && prevLevel !== freshLevel) {
            toast.warn(`⚠️ Traffic update: ${freshLevel.toUpperCase()} on your route!`);
          }
          return fresh;
        });
      }, 60000);

      toast.success(`${result.length} route${result.length > 1 ? "s" : ""} found!`);
    } catch (err) {
      console.error(err);
      toast.error("Route calculation failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [startPlace, endPlace, waypoints, clearMapLayers, fitMapToRoute, checkTrafficForRoutes]);

  // ============ SELECT ALTERNATE ROUTE ============
  const handleSelectRoute = useCallback((idx) => {
    setSelectedIdx(idx);
    const map = mapRef.current;
    if (!map || routes.length === 0) return;

    routes.forEach((route, rIdx) => {
      const layerId = routeLayersRef.current[rIdx];
      if (!layerId) return;

      if (map.getLayer(layerId)) {
        map.setPaintProperty(
          layerId,
          "line-color",
          rIdx === idx ? routeColors[0] : "#94a3b8"
        );
        map.setPaintProperty(layerId, "line-width", rIdx === idx ? 6 : 3);
        map.setPaintProperty(layerId, "line-opacity", rIdx === idx ? 1 : 0.5);
      }
    });

    fitMapToRoute(routes[idx].points);
  }, [routes, fitMapToRoute]);

  // ============ WAYPOINTS ============
  const addWaypoint = () => {
    if (waypoints.length >= 3) return toast.info("Maximum 3 stops allowed");
    setWaypoints([...waypoints, { id: Date.now(), place: null, value: "" }]);
  };

  const removeWaypoint = (id) => {
    setWaypoints(waypoints.filter((w) => w.id !== id));
  };

  const updateWaypointPlace = (id, place) => {
    setWaypoints(waypoints.map((w) => (w.id === id ? { ...w, place, value: place?.name || "" } : w)));
  };

  // ============ RESET ============
  const handleReset = () => {
    clearMapLayers();
    clearInterval(pollingRef.current);
    setRoutes([]);
    setRouteTraffic({});
    setStartPlace(null);
    setEndPlace(null);
    setWaypoints([]);
    setStartValue("");
    setEndValue("");
    setSelectedIdx(0);

    const map = mapRef.current;
    if (map) map.flyTo({ center: [78.9629, 20.5937], zoom: 4.5 });
  };

  // ============ SAVE ROUTE ============
  const handleSaveRoute = async () => {
    if (!startPlace || !endPlace) return toast.error("No route to save");

    const name = prompt("Give this route a name (e.g. Delhi to Jaipur):");
    if (!name?.trim()) return;

    try {
      await savedRouteService.saveRoute({
        name: name.trim(),
        start: startPlace,
        end: endPlace,
        waypoints: waypoints.filter((w) => w.place).map((w) => w.place),
      });
      toast.success("Route saved!");
      fetchSavedRoutes();
    } catch {
      toast.error("Failed to save route");
    }
  };

  // ============ SAVED ROUTES ============
  const fetchSavedRoutes = async () => {
    setSavedLoading(true);
    try {
      const data = await savedRouteService.getMyRoutes();
      setSavedRoutes(data?.routes || []);
    } catch {
      toast.error("Failed to load saved routes");
    } finally {
      setSavedLoading(false);
    }
  };

  const loadSavedRoute = async (route) => {
    setStartPlace({ name: route.start.name, lat: route.start.lat, lng: route.start.lng });
    setEndPlace({ name: route.end.name, lat: route.end.lat, lng: route.end.lng });
    setStartValue(route.start.name);
    setEndValue(route.end.name);
    setWaypoints(
      (route.waypoints || []).map((w) => ({
        id: Date.now() + Math.random(),
        place: w,
        value: w.name,
      }))
    );
    setShowSaved(false);
    toast.success("Route loaded! Click Get Routes.");
    await savedRouteService.markUsed(route._id);
  };

  const deleteSavedRoute = async (id) => {
    try {
      await savedRouteService.deleteRoute(id);
      setSavedRoutes((prev) => prev.filter((r) => r._id !== id));
      toast.success("Route deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  // ============ UI ============
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/25">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Route <span className="text-red-600 dark:text-red-500">Planner</span>
              </h1>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Live traffic • Alternative routes • Smart ETA
              </p>
            </div>
          </div>

          {/* Saved Routes Toggle */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition-all ${
              showSaved
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            <BookmarkCheck size={14} />
            <span className="hidden sm:inline">Saved ({savedRoutes.length})</span>
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[370px_1fr]">

          {/* ===== LEFT PANEL ===== */}
          <div className="flex flex-col gap-4">

            {/* Saved Routes Panel */}
            {showSaved && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                  Saved Routes
                </h3>

                {savedLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                  </div>
                ) : savedRoutes.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-400">
                    No saved routes yet
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {savedRoutes.map((route) => (
                      <div
                        key={route._id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3"
                      >
                        <button
                          onClick={() => loadSavedRoute(route)}
                          className="flex-1 text-left"
                        >
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                            {route.name}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                            {route.start.name} → {route.end.name}
                          </p>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => loadSavedRoute(route)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all"
                          >
                            <ChevronRight size={13} />
                          </button>
                          <button
                            onClick={() => deleteSavedRoute(route._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Search Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">
                Plan Route
              </h3>

              {/* Start */}
              <div className="mb-2">
                <label className="mb-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  FROM
                </label>
                <LocationSearchInput
                  placeholder="Start location..."
                  iconColor="text-green-600"
                  value={startValue}
                  onSelect={(p) => { setStartPlace(p); setStartValue(p.name); }}
                  onClear={() => { setStartPlace(null); setStartValue(""); }}
                />
              </div>

              {/* Waypoints */}
              {waypoints.map((wp, idx) => (
                <div key={wp.id} className="mb-2">
                  <label className="mb-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    STOP {idx + 1}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <LocationSearchInput
                        placeholder={`Add stop ${idx + 1}...`}
                        iconColor="text-orange-500"
                        value={wp.value}
                        onSelect={(p) => updateWaypointPlace(wp.id, p)}
                        onClear={() => updateWaypointPlace(wp.id, null)}
                      />
                    </div>
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}

              {/* End */}
              <div className="mb-4">
                <label className="mb-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  TO
                </label>
                <LocationSearchInput
                  placeholder="Destination..."
                  iconColor="text-red-600"
                  value={endValue}
                  onSelect={(p) => { setEndPlace(p); setEndValue(p.name); }}
                  onClear={() => { setEndPlace(null); setEndValue(""); }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCalculate}
                  disabled={loading || !startPlace || !endPlace}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Finding...</>
                  ) : (
                    <><Navigation size={16} /> Get Routes</>
                  )}
                </button>

                <button
                  onClick={addWaypoint}
                  title="Add stop"
                  disabled={waypoints.length >= 3}
                  className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-600 dark:text-slate-300 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={handleReset}
                  title="Reset"
                  className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 text-slate-600 dark:text-slate-300 hover:border-red-200 hover:text-red-600 transition-all"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Route Comparison Cards */}
            {routes.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {routes.length} Route{routes.length > 1 ? "s" : ""} Found
                  </h3>
                  <button
                    onClick={handleSaveRoute}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-600 dark:text-red-400 hover:text-red-700 transition-colors"
                  >
                    <Bookmark size={12} /> Save Route
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {routes.map((route, idx) => {
                    const traffic = routeTraffic[idx];
                    const selected = idx === selectedIdx;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectRoute(idx)}
                        className={`w-full rounded-xl border-2 p-3 text-left transition-all ${
                          selected
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                        }`}
                      >
                        {/* Route header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: routeColors[idx] || "#94a3b8" }}
                            />
                            <span className={`text-sm font-black ${selected ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}>
                              {idx === 0 ? "Recommended" : `Alternative ${idx}`}
                            </span>
                          </div>
                          {traffic && (
                            <TrafficIndicator traffic={traffic} compact />
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Ruler size={11} /> {route.distanceKm} km
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> {route.durationText}
                          </span>
                          {route.trafficDelaySeconds > 60 && (
                            <span className="text-red-500 dark:text-red-400 font-black">
                              +{route.trafficDelayText} delay
                            </span>
                          )}
                        </div>

                        {/* Traffic bar */}
                        {traffic && (
                          <div className="mt-2">
                            <TrafficIndicator traffic={traffic} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ===== MAP ===== */}
          <div
            className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
            style={{ height: "calc(100vh - 11rem)", minHeight: "450px" }}
          >
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;