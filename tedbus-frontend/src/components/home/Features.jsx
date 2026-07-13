import { BadgeCheck, Clock3, CreditCard, Headphones, ShieldCheck, TicketCheck, MapPinned, RefreshCcw } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Safe & Verified Buses", desc: "Every bus operator is verified to ensure a safer experience.", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/10" },
  { icon: Clock3, title: "On-Time Departures", desc: "Plan confidently with accurate bus timings.", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { icon: CreditCard, title: "Secure Payments", desc: "Pay safely through trusted payment gateways.", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/10" },
  { icon: TicketCheck, title: "Instant E-Ticket", desc: "Get your confirmed ticket immediately after payment.", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/10" },
  { icon: MapPinned, title: "Easy Boarding", desc: "Choose convenient boarding points while booking.", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10" },
  { icon: RefreshCcw, title: "Easy Cancellation", desc: "Cancel eligible bookings easily with clear policies.", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/10" },
  { icon: Headphones, title: "24×7 Customer Support", desc: "Our support team is always available to help.", color: "text-sky-600", bg: "bg-sky-50 dark:bg-sky-900/10" },
  { icon: BadgeCheck, title: "Trusted by Travellers", desc: "A smooth, reliable and transparent booking experience.", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-600 dark:bg-slate-800 dark:border-red-900/30">
            <ShieldCheck className="h-4 w-4" /> Why Choose TedBus
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Everything you need for a <span className="block text-red-600">comfortable bus journey</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 dark:bg-slate-900 dark:border-slate-800">
              <div className="relative">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}><feature.icon className="h-7 w-7" /></div>
                <h3 className="mt-6 text-lg font-black text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;