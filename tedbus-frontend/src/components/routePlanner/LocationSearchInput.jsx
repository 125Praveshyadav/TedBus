import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2, X } from "lucide-react";
import { searchPlaces } from "../../services/tomtomService";

const LocationSearchInput = ({
  placeholder = "Search location...",
  onSelect,
  value = "",
  iconColor = "text-red-600",
  onClear,
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Click outside close
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Update query jab bahar se value change ho (saved route load)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Debounce — 400ms ke baad API call
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const results = await searchPlaces(val);
      setSuggestions(results);
      setShowDropdown(true);
      setLoading(false);
    }, 400);
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setSuggestions([]);
    setShowDropdown(false);
    if (onSelect) onSelect(place);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    if (onClear) onClear();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <style>{`
        @keyframes lsiDropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes lsiRowIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .lsi-dropdown { animation: lsiDropIn 0.18s cubic-bezier(0.22,1,0.36,1) both; transform-origin: top; }
        .lsi-row { animation: lsiRowIn 0.22s ease both; }
      `}</style>

      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          focused ? "ring-4 ring-red-500/10" : ""
        }`}
      >
        <MapPin
          className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-transform duration-300 ${iconColor} ${
            focused ? "scale-110" : ""
          }`}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            setFocused(true);
            suggestions.length > 0 && setShowDropdown(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3 pl-10 pr-9 text-sm font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-red-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-red-500/60 dark:focus:bg-slate-800"
        />
        {loading && (
          <Loader2 className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-red-500" />
        )}
        {!loading && query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="lsi-dropdown absolute left-0 top-full z-50 mt-1.5 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-xl shadow-slate-900/10 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/95">
          {suggestions.map((place, i) => (
            <button
              key={place.id}
              onClick={() => handleSelect(place)}
              style={{ animationDelay: `${i * 0.03}s` }}
              className="lsi-row group flex w-full items-start gap-3 border-b border-slate-50 px-3.5 py-3 text-left transition-colors duration-200 last:border-0 hover:bg-red-50/60 dark:border-slate-800 dark:hover:bg-red-900/10"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors duration-200 group-hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:group-hover:bg-red-900/30">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              <span className="line-clamp-2 pt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                {place.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchInput;