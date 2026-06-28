import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  ShieldCheck,
  TicketCheck,
  MapPinned,
  RefreshCcw,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Verified Buses",
    desc: "Every bus operator is verified to ensure a safer and more reliable travel experience.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Clock3,
    title: "On-Time Departures",
    desc: "Plan confidently with accurate bus timings and carefully managed schedules.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Pay safely through trusted payment gateways with encrypted transactions.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: TicketCheck,
    title: "Instant E-Ticket",
    desc: "Get your confirmed ticket immediately after successful booking and payment.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: MapPinned,
    title: "Easy Boarding",
    desc: "Choose convenient boarding and dropping points while booking your journey.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: RefreshCcw,
    title: "Easy Cancellation",
    desc: "Cancel eligible bookings easily with clear cancellation and refund policies.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Headphones,
    title: "24×7 Customer Support",
    desc: "Our support team is always available to help with bookings, payments and tickets.",
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    icon: BadgeCheck,
    title: "Trusted by Travellers",
    desc: "A smooth, reliable and transparent booking experience for every traveller.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const Features = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-20">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm">
            <ShieldCheck className="h-4 w-4" />
            Why Choose TedBus
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Everything you need for a
            <span className="block text-red-600">comfortable bus journey</span>
          </h2>

          <p className="mt-4 text-base font-medium leading-7 text-slate-600">
            From easy search to secure payment and instant ticket confirmation,
            TedBus makes your travel booking simple, fast and reliable.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-100 hover:shadow-2xl hover:shadow-slate-900/10"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-6 text-lg font-black text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                    {feature.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Trust Strip */}
        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 text-center sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black text-slate-950">50+</p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Popular Routes
              </p>
            </div>

            <div className="border-slate-100 sm:border-x">
              <p className="text-3xl font-black text-red-600">24×7</p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Support Available
              </p>
            </div>

            <div>
              <p className="text-3xl font-black text-slate-950">100%</p>
              <p className="mt-1 text-sm font-bold text-slate-500">
                Secure Payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;