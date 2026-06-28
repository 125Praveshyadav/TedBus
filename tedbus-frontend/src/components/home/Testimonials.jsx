import { useNavigate } from "react-router-dom";
import { ArrowRight, Quote, Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Business Traveler",
    review:
      "Amazing booking experience. Very fast and reliable. I book every month!",
    rating: 5,
    initial: "R",
  },
  {
    name: "Priya Singh",
    role: "Student",
    review:
      "Easy seat selection and smooth payment process. Best platform ever!",
    rating: 5,
    initial: "P",
  },
  {
    name: "Aman Verma",
    role: "Freelancer",
    review:
      "Best bus booking platform I have used. Great customer support too.",
    rating: 5,
    initial: "A",
  },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20">
      {/* Background Accents */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-red-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-600 shadow-sm">
            <Users className="h-4 w-4" />
            Trusted by 10,000+ travellers
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            What travellers say about
            <span className="block text-red-600">TedBus</span>
          </h2>

          <p className="mt-4 text-base font-medium leading-7 text-slate-600">
            Real reviews from happy customers who trust TedBus for their
            journeys across India.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-100 hover:shadow-2xl hover:shadow-red-500/10"
            >
              {/* Quote Icon */}
              <div className="absolute -right-4 -top-4 text-red-50 transition group-hover:text-red-100">
                <Quote className="h-24 w-24" />
              </div>

              <div className="relative">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="mt-5 text-base font-medium leading-7 text-slate-700">
                  “{item.review}”
                </p>

                <div className="my-6 h-px bg-slate-100" />

                {/* User */}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-500 text-lg font-black text-white shadow-md shadow-red-500/25">
                    {item.initial}
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {item.name}
                    </h4>

                    <p className="text-xs font-semibold text-slate-500">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 overflow-hidden rounded-[2rem] border border-red-100 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-1 shadow-xl shadow-red-500/20">
          <div className="rounded-[1.8rem] bg-white p-8 text-center">
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Join thousands of happy travellers
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-7 text-slate-600">
              Experience the simplest, safest and most reliable bus booking
              platform in India.
            </p>

            <button
              type="button"
              onClick={() => navigate("/search-bus")}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-7 py-4 text-sm font-black text-white shadow-lg shadow-red-500/30 transition hover:bg-red-700 active:scale-95"
            >
              Book Your First Journey
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;