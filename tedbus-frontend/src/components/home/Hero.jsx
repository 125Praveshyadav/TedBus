import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bus,
  CalendarDays,
  MapPin,
  Search,
  ShieldCheck,
  Headphones,
  CreditCard,
  ArrowLeftRight,
  AlertCircle,
  Smartphone,
  Star,
} from "lucide-react";

const Hero = () => {
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
    {
      icon: ShieldCheck,
      title: "Safe Travel",
      description: "Verified buses and secure journeys",
    },
    {
      icon: CreditCard,
      title: "Easy Payment",
      description: "Fast and secure online payments",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help you",
    },
  ];

  const quickRoutes = [
    {
      source: "Delhi",
      destination: "Jaipur",
    },
    {
      source: "Mumbai",
      destination: "Pune",
    },
    {
      source: "Bangalore",
      destination: "Hyderabad",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source.trim()) {
      newErrors.source = "Source city is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination city is required";
    }

    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() ===
        formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Source and destination cannot be same";
    }

    if (!formData.date) {
      newErrors.date = "Journey date is required";
    }

    if (formData.date && formData.date < today) {
      newErrors.date = "Journey date cannot be in the past";
    }

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
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-50">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-red-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left Content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-bold text-red-600 shadow-sm">
              <Star className="h-4 w-4 fill-red-600" />
              India’s smarter bus booking experience
            </div>

            <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Book Bus Tickets
              <span className="block text-red-600">
                Faster, Safer & Easier
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Travel across cities with verified buses, live seat selection,
              secure payments, instant ticket confirmation and reliable support.
            </p>

            {/* Benefits */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-slate-100 bg-white/80 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-sm font-black text-slate-800">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Smartphone className="h-5 w-5" />
                Download Mobile App
              </button>

              <p className="text-sm font-medium text-slate-500">
                10k+ happy travellers choose TedBus
              </p>
            </div>
          </div>

          {/* Right Search Card */}
          <div className="lg:pl-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 sm:p-6">
              {/* Card Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Search Buses
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Find buses for your next journey
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-600 text-white shadow-lg shadow-red-500/30">
                  <Bus className="h-7 w-7" />
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                {/* Source */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    From
                  </label>

                  <div
                    className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.source ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="Enter source city"
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {errors.source && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.source}
                    </p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSwapCities}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                    title="Swap source and destination"
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Destination */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    To
                  </label>

                  <div
                    className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.destination ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Enter destination city"
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {errors.destination && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.destination}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Journey Date
                  </label>

                  <div
                    className={`relative rounded-2xl border bg-slate-50 transition focus-within:border-red-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10 ${
                      errors.date ? "border-red-300" : "border-slate-200"
                    }`}
                  >
                    <CalendarDays className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      name="date"
                      min={today}
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none"
                    />
                  </div>

                  {errors.date && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-red-500/25 transition hover:bg-red-700 active:scale-[0.98]"
                >
                  <Search className="h-5 w-5" />
                  Search Buses
                </button>
              </form>

              {/* Quick Routes */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="mb-3 text-sm font-black text-slate-700">
                  Popular Routes
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickRoutes.map((route) => (
                    <button
                      key={`${route.source}-${route.destination}`}
                      type="button"
                      onClick={() => handleQuickRoute(route)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      {route.source} → {route.destination}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Stat */}
            <div className="mx-auto mt-5 grid max-w-md grid-cols-3 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 text-center">
                <p className="text-xl font-black text-slate-900">50+</p>
                <p className="text-xs font-semibold text-slate-500">Routes</p>
              </div>

              <div className="border-x border-slate-100 p-4 text-center">
                <p className="text-xl font-black text-red-600">4.8</p>
                <p className="text-xs font-semibold text-slate-500">Rating</p>
              </div>

              <div className="p-4 text-center">
                <p className="text-xl font-black text-slate-900">24/7</p>
                <p className="text-xs font-semibold text-slate-500">Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;