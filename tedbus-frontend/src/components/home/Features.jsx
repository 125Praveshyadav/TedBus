import {
  BadgeCheck,
  Clock3,
  CreditCard,
  Headphones,
  MapPinned,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  TicketCheck,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Safe & Verified Buses",
    desc: "Every bus operator on TedBus is background-verified and rated for your safe journey.",
    gradient: "from-emerald-600 to-green-500",
    glow: "group-hover:shadow-emerald-500/20",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    softBorder: "border-emerald-100 dark:border-emerald-900/50",
    accentText: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  {
    icon: Clock3,
    title: "On-Time Departures",
    desc: "Accurate real-time schedules so you can plan every trip with complete confidence.",
    gradient: "from-blue-600 to-sky-500",
    glow: "group-hover:shadow-blue-500/20",
    softBg: "bg-blue-50 dark:bg-blue-950/40",
    softBorder: "border-blue-100 dark:border-blue-900/50",
    accentText: "text-blue-600 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    desc: "Pay with confidence through trusted, encrypted and PCI-compliant payment gateways.",
    gradient: "from-red-600 to-orange-500",
    glow: "group-hover:shadow-red-500/20",
    softBg: "bg-red-50 dark:bg-red-950/40",
    softBorder: "border-red-100 dark:border-red-900/50",
    accentText: "text-red-600 dark:text-red-400",
    dotColor: "bg-red-500",
  },
  {
    icon: TicketCheck,
    title: "Instant E-Ticket",
    desc: "Get your confirmed digital ticket instantly after payment — no waiting, no hassle.",
    gradient: "from-violet-600 to-purple-500",
    glow: "group-hover:shadow-violet-500/20",
    softBg: "bg-violet-50 dark:bg-violet-950/40",
    softBorder: "border-violet-100 dark:border-violet-900/50",
    accentText: "text-violet-600 dark:text-violet-400",
    dotColor: "bg-violet-500",
  },
  {
    icon: MapPinned,
    title: "Easy Boarding Points",
    desc: "Pick your most convenient boarding and dropping locations during the booking process.",
    gradient: "from-orange-600 to-amber-500",
    glow: "group-hover:shadow-orange-500/20",
    softBg: "bg-orange-50 dark:bg-orange-950/40",
    softBorder: "border-orange-100 dark:border-orange-900/50",
    accentText: "text-orange-600 dark:text-orange-400",
    dotColor: "bg-orange-500",
  },
  {
    icon: RefreshCcw,
    title: "Easy Cancellation",
    desc: "Cancel eligible bookings hassle-free with transparent refund policies and quick processing.",
    gradient: "from-amber-600 to-yellow-500",
    glow: "group-hover:shadow-amber-500/20",
    softBg: "bg-amber-50 dark:bg-amber-950/40",
    softBorder: "border-amber-100 dark:border-amber-900/50",
    accentText: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  {
    icon: Headphones,
    title: "24×7 Customer Support",
    desc: "Our dedicated support team is always online to assist you — day or night, rain or shine.",
    gradient: "from-cyan-600 to-teal-500",
    glow: "group-hover:shadow-cyan-500/20",
    softBg: "bg-cyan-50 dark:bg-cyan-950/40",
    softBorder: "border-cyan-100 dark:border-cyan-900/50",
    accentText: "text-cyan-600 dark:text-cyan-400",
    dotColor: "bg-cyan-500",
  },
  {
    icon: BadgeCheck,
    title: "Trusted by Travellers",
    desc: "Thousands of happy travellers rely on TedBus for a smooth, reliable booking experience.",
    gradient: "from-pink-600 to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
    softBg: "bg-pink-50 dark:bg-pink-950/40",
    softBorder: "border-pink-100 dark:border-pink-900/50",
    accentText: "text-pink-600 dark:text-pink-400",
    dotColor: "bg-pink-500",
  },
];

const trustStats = [
  { value: "50+", label: "Routes covered" },
  { value: "24/7", label: "Live support" },
  { value: "4.8★", label: "Average rating" },
  { value: "99%", label: "On-time record" },
];

const Features = () => {
  return (
    <section className="relative isolate overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-slate-950 sm:py-20 lg:py-24">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-red-200/20 blur-3xl dark:bg-red-600/5" />

      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl dark:bg-orange-600/5" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_#0f172a_1px,_transparent_1px)] [background-size:28px_28px] dark:bg-[radial-gradient(circle_at_center,_#ffffff_1px,_transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-red-600 shadow-sm backdrop-blur dark:border-red-900/50 dark:bg-slate-900/80 dark:text-red-400 sm:text-xs">
            <Zap className="h-4 w-4" />
            Why choose TedBus
          </div>

          <h2 className="text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            Built for a
            <span className="mx-2 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              seamless
            </span>
            travel experience
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            From booking to boarding, every step is designed for your
            comfort, safety and complete peace of mind.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className={`group relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${feature.glow}`}
              >
                {/* Top gradient accent */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="p-4 sm:p-5">
                  {/* Icon and index */}
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${feature.softBg} ${feature.softBorder} ${feature.accentText} shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[9px] font-black text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black leading-5 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 min-h-[48px] text-xs font-medium leading-5 text-slate-500 dark:text-slate-400">
                    {feature.desc}
                  </p>

                  {/* Bottom tag */}
                  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${feature.dotColor}`}
                    />

                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.14em] ${feature.accentText}`}
                    >
                      TedBus verified
                    </span>
                  </div>
                </div>

                {/* Hover glow */}
                <div
                  className={`pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-10`}
                />
              </article>
            );
          })}
        </div>

        {/* Trust stats */}
        <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 to-slate-900 p-5 text-white shadow-2xl dark:border-slate-800 sm:p-6">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-44 w-44 rounded-full bg-orange-500/15 blur-3xl" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-red-400 backdrop-blur">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-red-400">
                  Traveller confidence
                </p>

                <h3 className="mt-1 text-lg font-black sm:text-xl">
                  Numbers that speak for themselves
                </h3>

                <p className="mt-1 max-w-lg text-xs font-medium leading-5 text-slate-400">
                  Every feature is backed by real traveller trust and consistent
                  performance across all routes.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {trustStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-center backdrop-blur"
                >
                  <p className="text-base font-black sm:text-lg">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 text-[7px] font-black uppercase tracking-wider text-slate-400 sm:text-[8px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            All operators verified
          </span>

          <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            Rated 4.8 by travellers
          </span>

          <span className="hidden h-4 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

          <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <Headphones className="h-4 w-4 text-cyan-500" />
            Support always online
          </span>
        </div>
      </div>
    </section>
  );
};

export default Features;