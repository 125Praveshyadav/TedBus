import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Clock3, TrendingUp } from "lucide-react";

const popularRoutes = [
  { from: "Delhi", to: "Jaipur", price: 499, duration: "4h 30m", popularity: "Very High" },
  { from: "Chennai", to: "Bangalore", price: 549, duration: "6h 20m", popularity: "Medium" },
  { from: "Kolkata", to: "Patna", price: 449, duration: "9h 10m", popularity: "Medium" },
  { from: "Ahmedabad", to: "Surat", price: 249, duration: "4h 00m", popularity: "High" },
];

const PopularRoutes = () => {
  const navigate = useNavigate();
  const handleRouteClick = (route) => {
    const today = new Date().toISOString().split("T")[0];
    navigate(`/search-bus?source=${route.from}&destination=${route.to}&date=${today}`);
  };

  return (
    <section className="relative bg-white py-20 dark:bg-slate-950 transition-colors duration-300">
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-red-100/60 blur-3xl dark:bg-red-900/10" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl dark:bg-orange-900/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-5 py-2 text-sm font-black text-red-600 dark:bg-red-900/20 dark:border-red-900/30">
            <TrendingUp className="h-4 w-4" /> MOST BOOKED ROUTES
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Popular Routes</h2>
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">Thousands of travellers trust TedBus on these routes every month</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {popularRoutes.map((route, index) => (
            <button key={index} onClick={() => handleRouteClick(route)} className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-red-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-red-900">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-red-50 p-3 text-red-600 dark:bg-red-900/20">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <p className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
                    {route.from} <ArrowRight className="h-5 w-5 text-red-500" /> {route.to}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><Clock3 className="h-4 w-4" /> {route.duration}</div>
                  <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">{route.popularity}</div>
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-400">Starting from</p>
                  <p className="text-3xl font-black text-red-600">₹{route.price}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg"><ArrowRight className="h-5 w-5" /></div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;