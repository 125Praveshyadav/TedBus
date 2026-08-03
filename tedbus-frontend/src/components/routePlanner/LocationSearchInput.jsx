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
      <div className="relative">
        <MapPin className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-8 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none transition focus:border-red-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-slate-400" />
        )}
        {!loading && query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10">
          {suggestions.map((place) => (
            <button
              key={place.id}
              onClick={() => handleSelect(place)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-0"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
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