import { useState, useRef, useCallback, useEffect } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import {
  Navigation, Plus, X, Loader2, Clock, Ruler,
  Bookmark, RotateCcw, Trash2, ChevronRight,
  BookmarkCheck, ArrowDownUp, Sparkles, Radio,
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
    box-shadow: 0 6px 16px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2);
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

// Premium, restrained accent set — deep crimson primary, cool slate for alternates.
const routeColors = ["#B91C1C", "#64748b", "#cbd5e1"];

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
        "#10b981",
        "A"
      );
      const endMarker = createMarker(
        map,
        [endPlace.lng, endPlace.lat],
        "#B91C1C",
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white transition-colors duration-300 dark:from-slate-950 dark:to-slate-900">
      <style>{`
        @keyframes rpFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rpGlowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(185,28,28,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(185,28,28,0); }
        }
        @keyframes rpShine {
          from { transform: translateX(-130%) skewX(-12deg); }
          to { transform: translateX(230%) skewX(-12deg); }
        }
        @keyframes rpDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
        .rp-panel { animation: rpFadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .rp-panel:nth-child(1) { animation-delay: 0.02s; }
        .rp-panel:nth-child(2) { animation-delay: 0.08s; }
        .rp-panel:nth-child(3) { animation-delay: 0.14s; }
        .rp-route-row { animation: rpFadeIn 0.4s ease both; }
        .rp-logo-ring { animation: rpGlowPulse 2.4s ease-in-out infinite; }
        .rp-btn-primary { position: relative; overflow: hidden; }
        .rp-btn-primary .shine { position: absolute; inset: 0; }
        .rp-btn-primary:hover .shine::before {
          content: ""; position: absolute; inset-block: 0; width: 34%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: rpShine 0.9s ease;
        }
        .rp-live-dot { animation: rpDot 1.6s ease-in-out infinite; }
      `}</style>

      {/* Ambient background glow — subtle, premium */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-red-400/10 blur-3xl dark:bg-red-600/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-500/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rp-logo-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white shadow-lg shadow-red-600/30">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                Route{" "}
                <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  Planner
                </span>
              </h1>
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <Radio className="h-3 w-3 text-red-500" />
                Live traffic &middot; Alternative routes &middot; Smart ETA
              </p>
            </div>
          </div>

          {/* Saved Routes Toggle */}
          <button
            onClick={() => setShowSaved(!showSaved)}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black transition-all duration-300 ${
              showSaved
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/25"
                : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-red-900/50"
            }`}
          >
            <BookmarkCheck size={14} />
            <span className="hidden sm:inline">Saved ({savedRoutes.length})</span>
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[380px_1fr]">

          {/* ===== LEFT PANEL ===== */}
          <div className="flex flex-col gap-4">

            {/* Saved Routes Panel */}
            {showSaved && (
              <div className="rp-panel rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm shadow-slate-900/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
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
                    {savedRoutes.map((route, i) => (
                      <div
                        key={route._id}
                        className="rp-route-row flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors duration-300 hover:border-red-100 hover:bg-red-50/40 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:border-red-900/40"
                        style={{ animationDelay: `${i * 0.05}s` }}
                      >
                        <button
                          onClick={() => loadSavedRoute(route)}
                          className="flex-1 text-left"
                        >
                          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                            {route.name}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {route.start.name} → {route.end.name}
                          </p>
                        </button>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => loadSavedRoute(route)}
                            className="rounded-lg bg-red-50 p-1.5 text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white dark:bg-red-900/20 dark:text-red-400"
                          >
                            <ChevronRight size={13} />
                          </button>
                          <button
                            onClick={() => deleteSavedRoute(route._id)}
                            className="rounded-lg p-1.5 text-slate-400 transition-all duration-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
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
            <div className="rp-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 transition-shadow duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
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
                  iconColor="text-emerald-600"
                  value={startValue}
                  onSelect={(p) => { setStartPlace(p); setStartValue(p.name); }}
                  onClear={() => { setStartPlace(null); setStartValue(""); }}
                />
              </div>

              {/* Waypoints */}
              {waypoints.map((wp, idx) => (
                <div key={wp.id} className="rp-route-row mb-2">
                  <label className="mb-1 block text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    STOP {idx + 1}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <LocationSearchInput
                        placeholder={`Add stop ${idx + 1}...`}
                        iconColor="text-amber-500"
                        value={wp.value}
                        onSelect={(p) => updateWaypointPlace(wp.id, p)}
                        onClear={() => updateWaypointPlace(wp.id, null)}
                      />
                    </div>
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white dark:bg-red-900/20 dark:text-red-400"
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
                  className="rp-btn-primary flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-700 py-3 text-sm font-black text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span className="shine" />
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
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 disabled:opacity-40 disabled:hover:translate-y-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={handleReset}
                  title="Reset"
                  className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {/* Route Comparison Cards */}
            {routes.length > 0 && (
              <div className="rp-panel rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    {routes.length} Route{routes.length > 1 ? "s" : ""} Found
                  </h3>
                  <button
                    onClick={handleSaveRoute}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-red-600 transition-colors duration-300 hover:text-red-700 dark:text-red-400"
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
                        style={{ animationDelay: `${idx * 0.06}s` }}
                        className={`rp-route-row w-full rounded-xl border-2 p-3 text-left transition-all duration-300 ${
                          selected
                            ? "border-red-500 bg-gradient-to-br from-red-50 to-rose-50/60 shadow-sm shadow-red-500/10 dark:border-red-500/70 dark:from-red-900/20 dark:to-rose-900/10"
                            : "border-slate-100 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-sm dark:border-slate-800 dark:hover:border-slate-700"
                        }`}
                      >
                        {/* Route header */}
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: routeColors[idx] || "#94a3b8" }}
                            />
                            <span className={`flex items-center gap-1 text-sm font-black ${selected ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}>
                              {idx === 0 && <Sparkles size={12} className="text-amber-500" />}
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
                            <span className="font-black text-red-500 dark:text-red-400">
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
            className="rp-panel relative overflow-hidden rounded-2xl border border-slate-200 shadow-md shadow-slate-900/5 dark:border-slate-800"
            style={{ height: "calc(100vh - 11rem)", minHeight: "450px" }}
          >
            {/* Live traffic badge */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-950/60 px-2.5 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
              <span className="rp-live-dot h-1.5 w-1.5 rounded-full bg-red-500" />
              Live traffic
            </div>
            <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;