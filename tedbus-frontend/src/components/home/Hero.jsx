import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus, CalendarDays, MapPin, Search, ShieldCheck, Headphones,
  CreditCard, ArrowLeftRight, AlertCircle, Smartphone, Star,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const today = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: today,
  });

  const [errors, setErrors] = useState({});

  const benefits = [
    { icon: ShieldCheck, title: t("benefits.safeTravel"), description: t("benefits.safeTravelDesc") },
    { icon: CreditCard, title: t("benefits.easyPayment"), description: t("benefits.easyPaymentDesc") },
    { icon: Headphones, title: t("benefits.support247"), description: t("benefits.support247Desc") },
  ];

  const quickRoutes = [
    { source: "Delhi", destination: "Jaipur" },
    { source: "Mumbai", destination: "Pune" },
    { source: "Bangalore", destination: "Hyderabad" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source.trim()) newErrors.source = t("heroErrors.sourceRequired");
    if (!formData.destination.trim()) newErrors.destination = t("heroErrors.destinationRequired");
    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination = t("heroErrors.sameCity");
    }
    if (!formData.date) newErrors.date = t("heroErrors.dateRequired");
    if (formData.date && formData.date < today) newErrors.date = t("heroErrors.pastDate");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSwapCities = () => {
    setFormData((prev) => ({
      ...prev,
      source: prev.destination,
      destination: prev.source,
    }));
    setErrors({});
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-200/40 dark:bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-100/60 dark:bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 dark:border-red-900/50 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 shadow-sm">
              <Star className="h-4 w-4 fill-red-600 dark:fill-red-400" />
              {t("hero.badge")}
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
              <span className="block text-red-600 dark:text-red-500">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            {/* Benefits */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* App CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-black text-slate-700 dark:text-slate-300 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                <Smartphone className="h-5 w-5" />
                {t("hero.downloadApp")}
              </button>

              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("hero.happyTravellers")}
              </p>
            </div>
          </div>

          {/* Right Search Card */}
          <div className="lg:pl-4">
            <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 sm:p-5">
              {/* Card Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {t("hero.searchTitle")}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {t("hero.searchSubtitle")}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/30">
                  <Bus className="h-5 w-5" />
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-2.5">
                {/* Source */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("hero.from")}
                  </label>

                  <div
                    className={`relative rounded-xl border bg-slate-50 dark:bg-slate-800 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.source ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder={t("hero.searchPlaceholderFrom")}
                      className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {errors.source && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.source}
                    </p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="relative flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400 active:scale-95"
                    title={t("hero.swapCities")}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Destination */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("hero.to")}
                  </label>

                  <div
                    className={`relative rounded-xl border bg-slate-50 dark:bg-slate-800 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.destination ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder={t("hero.searchPlaceholderTo")}
                      className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>

                  {errors.destination && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t("hero.journeyDate")}
                  </label>

                  <div
                    className={`relative rounded-xl border bg-slate-50 dark:bg-slate-800 transition focus-within:border-red-500 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.date ? "border-red-300 dark:border-red-800" : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      name="date"
                      min={today}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-transparent py-2.5 pl-10 pr-4 text-sm font-bold text-slate-800 dark:text-slate-200 outline-none dark:[color-scheme:dark]"
                    />
                  </div>

                  {errors.date && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  {t("hero.searchButton")}
                </button>
              </form>

              {/* Quick Routes */}
              <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                <p className="mb-2 text-xs font-black text-slate-700 dark:text-slate-300">
                  {t("hero.popularRoutes")}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {quickRoutes.map((route) => (
                    <button
                      key={`${route.source}-${route.destination}`}
                      type="button"
                      onClick={() => handleQuickRoute(route)}
                      className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      {route.source} → {route.destination}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stat */}
            <div className="mx-auto mt-4 grid max-w-md grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <div className="p-3 text-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">50+</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {t("hero.routes")}
                </p>
              </div>

              <div className="border-x border-slate-100 dark:border-slate-800 p-3 text-center">
                <p className="text-lg font-black text-red-600 dark:text-red-500">4.8</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {t("hero.rating")}
                </p>
              </div>

              <div className="p-3 text-center">
                <p className="text-lg font-black text-slate-900 dark:text-white">24/7</p>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
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