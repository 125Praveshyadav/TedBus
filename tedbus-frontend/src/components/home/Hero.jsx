import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  Bus,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";


const CITY_OPTIONS = [
  { city: "Delhi", state: "Delhi", aliases: ["New Delhi"] },
  { city: "Mumbai", state: "Maharashtra", aliases: ["Bombay"] },
  {
    city: "Bangalore",
    state: "Karnataka",
    aliases: ["Bengaluru"],
  },
  { city: "Hyderabad", state: "Telangana" },
  { city: "Chennai", state: "Tamil Nadu", aliases: ["Madras"] },
  { city: "Kolkata", state: "West Bengal", aliases: ["Calcutta"] },
  { city: "Pune", state: "Maharashtra" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Ahmedabad", state: "Gujarat" },
  { city: "Surat", state: "Gujarat" },
  { city: "Lucknow", state: "Uttar Pradesh" },
  { city: "Kanpur", state: "Uttar Pradesh" },
  { city: "Nagpur", state: "Maharashtra" },
  { city: "Indore", state: "Madhya Pradesh" },
  { city: "Bhopal", state: "Madhya Pradesh" },
  { city: "Patna", state: "Bihar" },
  { city: "Ranchi", state: "Jharkhand" },
  { city: "Chandigarh", state: "Chandigarh" },
  { city: "Amritsar", state: "Punjab" },
  { city: "Ludhiana", state: "Punjab" },
  { city: "Jalandhar", state: "Punjab" },
  { city: "Jodhpur", state: "Rajasthan" },
  { city: "Udaipur", state: "Rajasthan" },
  { city: "Kota", state: "Rajasthan" },
  { city: "Ajmer", state: "Rajasthan" },
  { city: "Agra", state: "Uttar Pradesh" },
  { city: "Varanasi", state: "Uttar Pradesh", aliases: ["Banaras"] },
  {
    city: "Prayagraj",
    state: "Uttar Pradesh",
    aliases: ["Allahabad"],
  },
  { city: "Noida", state: "Uttar Pradesh" },
  { city: "Ghaziabad", state: "Uttar Pradesh" },
  { city: "Meerut", state: "Uttar Pradesh" },
  { city: "Gorakhpur", state: "Uttar Pradesh" },
  { city: "Bareilly", state: "Uttar Pradesh" },
  {
    city: "Gurugram",
    state: "Haryana",
    aliases: ["Gurgaon"],
  },
  { city: "Faridabad", state: "Haryana" },
  { city: "Dehradun", state: "Uttarakhand" },
  { city: "Haridwar", state: "Uttarakhand" },
  { city: "Rishikesh", state: "Uttarakhand" },
  { city: "Shimla", state: "Himachal Pradesh" },
  { city: "Manali", state: "Himachal Pradesh" },
  { city: "Dharamshala", state: "Himachal Pradesh" },
  { city: "Jammu", state: "Jammu and Kashmir" },
  { city: "Srinagar", state: "Jammu and Kashmir" },
  { city: "Raipur", state: "Chhattisgarh" },
  { city: "Bilaspur", state: "Chhattisgarh" },
  { city: "Bhubaneswar", state: "Odisha" },
  { city: "Cuttack", state: "Odisha" },
  { city: "Puri", state: "Odisha" },
  { city: "Guwahati", state: "Assam" },
  { city: "Siliguri", state: "West Bengal" },
  { city: "Darjeeling", state: "West Bengal" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", aliases: ["Vizag"] },
  { city: "Vijayawada", state: "Andhra Pradesh" },
  { city: "Tirupati", state: "Andhra Pradesh" },
  { city: "Mysore", state: "Karnataka", aliases: ["Mysuru"] },
  { city: "Mangalore", state: "Karnataka", aliases: ["Mangaluru"] },
  { city: "Hubli", state: "Karnataka", aliases: ["Hubballi"] },
  { city: "Kochi", state: "Kerala", aliases: ["Cochin"] },
  { city: "Thiruvananthapuram", state: "Kerala", aliases: ["Trivandrum"] },
  { city: "Kozhikode", state: "Kerala", aliases: ["Calicut"] },
  { city: "Coimbatore", state: "Tamil Nadu" },
  { city: "Madurai", state: "Tamil Nadu" },
  { city: "Salem", state: "Tamil Nadu" },
  { city: "Nashik", state: "Maharashtra" },
  {
    city: "Aurangabad",
    state: "Maharashtra",
    aliases: ["Chhatrapati Sambhajinagar"],
  },
  { city: "Kolhapur", state: "Maharashtra" },
  { city: "Vadodara", state: "Gujarat", aliases: ["Baroda"] },
  { city: "Rajkot", state: "Gujarat" },
  { city: "Panaji", state: "Goa" },
  { city: "Margao", state: "Goa" },
];

const getLocalDateInputValue = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const normalizeSearchValue = (value) => {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("en-IN");
};

const getCitySearchText = (option) => {
  return [option.city, option.state, ...(option.aliases || [])]
    .join(" ")
    .toLocaleLowerCase("en-IN");
};

const getCityMatchRank = (option, query) => {
  if (!query) return 0;

  const city = normalizeSearchValue(option.city);
  const state = normalizeSearchValue(option.state);
  const aliases = (option.aliases || []).map(normalizeSearchValue);

  if (city === query) return 0;
  if (city.startsWith(query)) return 1;
  if (aliases.some((alias) => alias === query)) return 2;
  if (aliases.some((alias) => alias.startsWith(query))) return 3;
  if (state.startsWith(query)) return 4;

  return 5;
};

const CityAutocomplete = ({
  id,
  name,
  label,
  placeholder,
  value,
  error,
  excludeCity,
  onValueChange,
  popularCitiesText,
  matchingCitiesText,
  noResultText,
  clearText,
}) => {
  const generatedId = useId();
  const inputId = id || `${name}-${generatedId}`;
  const listboxId = `${inputId}-suggestions`;

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(() => {
    const query = normalizeSearchValue(value);
    const excludedValue = normalizeSearchValue(excludeCity);

    return CITY_OPTIONS.map((option, originalIndex) => ({
      option,
      originalIndex,
      rank: getCityMatchRank(option, query),
    }))
      .filter(({ option }) => {
        const cityName = normalizeSearchValue(option.city);

        if (excludedValue && cityName === excludedValue) {
          return false;
        }

        if (!query) {
          return true;
        }

        return getCitySearchText(option).includes(query);
      })
      .sort((first, second) => {
        return (
          first.rank - second.rank || first.originalIndex - second.originalIndex
        );
      })
      .slice(0, 8)
      .map(({ option }) => option);
  }, [value, excludeCity]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value]);

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      if (currentIndex >= suggestions.length) {
        return suggestions.length > 0 ? suggestions.length - 1 : -1;
      }

      return currentIndex;
    });
  }, [suggestions.length]);

  const selectCity = (option) => {
    onValueChange(option.city);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
      }

      if (suggestions.length > 0) {
        setActiveIndex((currentIndex) =>
          currentIndex >= suggestions.length - 1 ? 0 : currentIndex + 1,
        );
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
      }

      if (suggestions.length > 0) {
        setActiveIndex((currentIndex) =>
          currentIndex <= 0 ? suggestions.length - 1 : currentIndex - 1,
        );
      }

      return;
    }

    if (
      event.key === "Enter" &&
      isOpen &&
      activeIndex >= 0 &&
      suggestions[activeIndex]
    ) {
      event.preventDefault();
      selectCity(suggestions[activeIndex]);
      return;
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (event.key === "Tab") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    onValueChange("");
    setIsOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const showNoResult =
    isOpen && suggestions.length === 0 && value.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative ${isOpen ? "z-40" : "z-10"}`}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-black text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>

      <div className="relative">
        <div
          className={`group relative rounded-2xl border transition-all duration-200 ${
            error
              ? "border-red-400 bg-red-50/60 ring-4 ring-red-500/5 dark:border-red-800 dark:bg-red-950/20"
              : isOpen
                ? "border-red-500 bg-white ring-4 ring-red-500/10 dark:bg-slate-900"
                : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600"
          }`}
        >
          <div
            className={`pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl transition ${
              isOpen
                ? "bg-red-600 text-white shadow-md shadow-red-500/20"
                : "bg-white text-red-600 shadow-sm dark:bg-slate-900 dark:text-red-400"
            }`}
          >
            <MapPin className="h-4 w-4" />
          </div>

          <input
            ref={inputRef}
            id={inputId}
            type="text"
            name={name}
            value={value}
            onChange={(event) => {
              onValueChange(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            maxLength={60}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-invalid={Boolean(error)}
            aria-activedescendant={
              activeIndex >= 0
                ? `${listboxId}-option-${activeIndex}`
                : undefined
            }
            className="h-14 w-full rounded-2xl bg-transparent py-3 pl-14 pr-12 text-sm font-black text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          />

          {value && (
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
              title={clearText}
              aria-label={clearText}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {isOpen && suggestions.length > 0 && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15 [scrollbar-width:thin] dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                {value.trim() ? matchingCitiesText : popularCitiesText}
              </p>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                {suggestions.length}
              </span>
            </div>

            <div className="space-y-1">
              {suggestions.map((option, index) => {
                const isActive = activeIndex === index;

                return (
                  <button
                    id={`${listboxId}-option-${index}`}
                    key={`${option.city}-${option.state}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectCity(option)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      isActive
                        ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          isActive
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                      </span>

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-black">
                          {option.city}
                        </span>

                        <span className="block truncate text-[11px] font-medium text-slate-400 dark:text-slate-500">
                          {option.state}
                        </span>
                      </span>
                    </span>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition ${
                        isActive
                          ? "translate-x-0.5 text-red-500"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showNoResult && (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <Search className="h-4 w-4" />
              </span>

              <div>
                <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                  {noResultText}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400 dark:text-slate-500">
                  You can still search using the city name you entered.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

const Hero = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const today = useMemo(() => {
    return getLocalDateInputValue();
  }, []);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: today,
  });

  const [errors, setErrors] = useState({});

  const benefits = [
    {
      icon: ShieldCheck,
      title: t("benefits.safeTravel"),
      description: t("benefits.safeTravelDesc"),
    },
    {
      icon: CreditCard,
      title: t("benefits.easyPayment"),
      description: t("benefits.easyPaymentDesc"),
    },
    {
      icon: Headphones,
      title: t("benefits.support247"),
      description: t("benefits.support247Desc"),
    },
  ];

  const quickRoutes = [
    { source: "Delhi", destination: "Jaipur" },
    { source: "Mumbai", destination: "Pune" },
    { source: "Bangalore", destination: "Hyderabad" },
  ];

  const cityUiText = {
    popularCities: t("hero.popularCities", {
      defaultValue: "Popular cities",
    }),
    matchingCities: t("hero.matchingCities", {
      defaultValue: "Matching cities",
    }),
    noResult: t("hero.noCityFound", {
      defaultValue: "No matching city found",
    }),
    clearCity: t("hero.clearCity", {
      defaultValue: "Clear city",
    }),
  };

  const updateFormField = (name, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      general: "",
    }));
  };

  const handleDateChange = (event) => {
    updateFormField("date", event.target.value);
  };

  const validateForm = () => {
    const newErrors = {};

    const normalizedSource = formData.source.trim();
    const normalizedDestination = formData.destination.trim();

    if (!normalizedSource) {
      newErrors.source = t("heroErrors.sourceRequired");
    }

    if (!normalizedDestination) {
      newErrors.destination = t("heroErrors.destinationRequired");
    }

    if (
      normalizedSource &&
      normalizedDestination &&
      normalizeSearchValue(normalizedSource) ===
        normalizeSearchValue(normalizedDestination)
    ) {
      newErrors.destination = t("heroErrors.sameCity");
    }

    if (!formData.date) {
      newErrors.date = t("heroErrors.dateRequired");
    }

    if (formData.date && formData.date < today) {
      newErrors.date = t("heroErrors.pastDate");
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSwapCities = () => {
    setFormData((currentData) => ({
      ...currentData,
      source: currentData.destination,
      destination: currentData.source,
    }));

    setErrors({});
  };

  const handleSearch = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const queryParams = new URLSearchParams({
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      date: formData.date,
    });

    navigate(`/search-bus?${queryParams.toString()}`);
  };

  const handleQuickRoute = (route) => {
    const queryParams = new URLSearchParams({
      source: route.source,
      destination: route.destination,
      date: formData.date || today,
    });

    navigate(`/search-bus?${queryParams.toString()}`);
  };

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/20" />

      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-red-300/25 blur-3xl dark:bg-red-600/10" />

      <div className="pointer-events-none absolute -bottom-36 -left-24 h-96 w-96 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/10" />

      <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-rose-200/20 blur-3xl dark:bg-rose-600/5" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.06]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] [background-size:28px_28px] dark:bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400 sm:text-sm">
              <Star className="h-4 w-4 fill-red-600 dark:fill-red-400" />
              {t("hero.badge")}
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {t("hero.title")}

              <span className="relative mt-1 block bg-gradient-to-r from-red-600 via-red-500 to-orange-500 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-lg sm:leading-8">
              {t("hero.subtitle")}
            </p>

            {/* Benefits */}
            <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-500/5 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-red-900/60 sm:rounded-3xl sm:p-4"
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white dark:bg-red-950/40 dark:text-red-400 sm:mb-3 sm:h-11 sm:w-11 sm:rounded-2xl">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>

                    <h3 className="text-[10px] font-black leading-4 text-slate-800 dark:text-slate-200 sm:text-sm">
                      {item.title}
                    </h3>

                    <p className="mt-1 hidden text-xs leading-5 text-slate-500 dark:text-slate-400 sm:block">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* App CTA */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-600 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <Smartphone className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                {t("hero.downloadApp")}
              </button>

              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                <div className="flex -space-x-2">
                  {["R", "A", "S"].map((letter, index) => (
                    <span
                      key={letter}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-black text-white dark:border-slate-950 ${
                        index === 0
                          ? "bg-red-500"
                          : index === 1
                            ? "bg-orange-500"
                            : "bg-slate-700"
                      }`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>

                <span>{t("hero.happyTravellers")}</span>
              </div>
            </div>
          </div>

          {/* Search area */}
          <div className="relative lg:pl-2">
            <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-black/30 sm:p-6">
              {/* Search card header */}
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    <Sparkles className="h-3 w-3" />
                    Instant booking
                  </div>

                  <h2 className="text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                    {t("hero.searchTitle")}
                  </h2>

                  <p className="mt-1 text-xs font-medium leading-5 text-slate-500 dark:text-slate-400 sm:text-sm">
                    {t("hero.searchSubtitle")}
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/25 sm:h-14 sm:w-14">
                  <Bus className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSearch} noValidate className="space-y-3">
                {/* Source */}
                <CityAutocomplete
                  id="hero-source"
                  name="source"
                  label={t("hero.from")}
                  placeholder={t("hero.searchPlaceholderFrom")}
                  value={formData.source}
                  error={errors.source}
                  excludeCity={formData.destination}
                  onValueChange={(value) => updateFormField("source", value)}
                  popularCitiesText={cityUiText.popularCities}
                  matchingCitiesText={cityUiText.matchingCities}
                  noResultText={cityUiText.noResult}
                  clearText={cityUiText.clearCity}
                />

                {/* Swap cities */}
                <div className="relative z-20 flex h-3 items-center justify-center">
                  <div className="absolute left-5 right-5 border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <button
                    type="button"
                    onClick={handleSwapCities}
                    title={t("hero.swapCities")}
                    aria-label={t("hero.swapCities")}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-900 text-white shadow-lg transition hover:rotate-180 hover:bg-red-600 active:scale-90 dark:border-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-red-500 dark:hover:text-white"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Destination */}
                <CityAutocomplete
                  id="hero-destination"
                  name="destination"
                  label={t("hero.to")}
                  placeholder={t("hero.searchPlaceholderTo")}
                  value={formData.destination}
                  error={errors.destination}
                  excludeCity={formData.source}
                  onValueChange={(value) =>
                    updateFormField("destination", value)
                  }
                  popularCitiesText={cityUiText.popularCities}
                  matchingCitiesText={cityUiText.matchingCities}
                  noResultText={cityUiText.noResult}
                  clearText={cityUiText.clearCity}
                />

                {/* Journey date */}
                <div>
                  <label
                    htmlFor="hero-journey-date"
                    className="mb-1.5 block text-xs font-black text-slate-700 dark:text-slate-300"
                  >
                    {t("hero.journeyDate")}
                  </label>

                  <div
                    className={`group relative rounded-2xl border transition-all duration-200 focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 dark:focus-within:bg-slate-900 ${
                      errors.date
                        ? "border-red-400 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm transition group-focus-within:bg-red-600 group-focus-within:text-white dark:bg-slate-900 dark:text-red-400">
                      <CalendarDays className="h-4 w-4" />
                    </div>

                    <input
                      id="hero-journey-date"
                      type="date"
                      name="date"
                      min={today}
                      value={formData.date}
                      onChange={handleDateChange}
                      aria-invalid={Boolean(errors.date)}
                      className="h-14 w-full cursor-pointer rounded-2xl bg-transparent py-3 pl-14 pr-4 text-sm font-black text-slate-900 outline-none dark:text-white dark:[color-scheme:dark]"
                    />
                  </div>

                  {errors.date && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Search button */}
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-orange-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-red-500/30 active:translate-y-0 active:scale-[0.98]"
                >
                  <Search className="h-5 w-5" />
                  {t("hero.searchButton")}

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              {/* Secure confirmation */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Instant confirmation
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Secure payment
                </span>
              </div>

              {/* Quick routes */}
              <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                    {t("hero.popularRoutes")}
                  </p>

                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Quick search
                  </span>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  {quickRoutes.map((route) => (
                    <button
                      key={`${route.source}-${route.destination}`}
                      type="button"
                      onClick={() => handleQuickRoute(route)}
                      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-red-900 dark:hover:bg-red-950/30"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-black text-slate-700 group-hover:text-red-600 dark:text-slate-300 dark:group-hover:text-red-400">
                          {route.source}
                        </span>

                        <span className="block truncate text-[9px] font-bold text-slate-400 dark:text-slate-500">
                          to {route.destination}
                        </span>
                      </span>

                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-red-500 dark:text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="relative mx-auto mt-4 grid max-w-md grid-cols-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20">
              <div className="p-3 text-center sm:p-4">
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  50+
                </p>

                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 sm:text-[11px]">
                  {t("hero.routes")}
                </p>
              </div>

              <div className="border-x border-slate-100 p-3 text-center dark:border-slate-800 sm:p-4">
                <p className="inline-flex items-center gap-1 text-lg font-black text-red-600 dark:text-red-400">
                  4.8
                  <Star className="h-3.5 w-3.5 fill-red-500" />
                </p>

                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 sm:text-[11px]">
                  {t("hero.rating")}
                </p>
              </div>

              <div className="p-3 text-center sm:p-4">
                <p className="text-lg font-black text-slate-900 dark:text-white">
                  24/7
                </p>

                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 sm:text-[11px]">
                  {t("hero.support")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
