import { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const MapView = ({ onMapReady, isDark }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Agar map already hai, style update karo
    if (mapRef.current) {
      mapRef.current.setStyle(
        `https://api.tomtom.com/style/1/style/22.2.1-*?map=2/basic_street-${isDark ? "dark" : "light"}&key=${import.meta.env.VITE_TOMTOM_API_KEY}`
      );
      return;
    }

    const map = tt.map({
      key: import.meta.env.VITE_TOMTOM_API_KEY,
      container: containerRef.current,
      center: [78.9629, 20.5937],
      zoom: 4.5,
      language: "en-GB",
      style: `https://api.tomtom.com/style/1/style/22.2.1-*?map=2/basic_street-${isDark ? "dark" : "light"}&key=${import.meta.env.VITE_TOMTOM_API_KEY}`,
    });

    map.addControl(new tt.NavigationControl(), "top-right");
    map.addControl(new tt.FullscreenControl(), "top-right");
    mapRef.current = map;

    map.on("load", () => {
      if (onMapReady) onMapReady(map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default MapView;