import { useNavigate } from "react-router-dom";
import { ArrowRight, Quote, Star, Users } from "lucide-react";

const testimonials = [
  { name: "Rahul Sharma", role: "Business Traveler", review: "Amazing booking experience. Very fast and reliable. I book every month!", rating: 5, initial: "R" },
  { name: "Priya Singh", role: "Student", review: "Easy seat selection and smooth payment process. Best platform ever!", rating: 5, initial: "P" },
  { name: "Aman Verma", role: "Freelancer", review: "Best bus booking platform I have used. Great customer support too.", rating: 5, initial: "A" },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-900 transition-colors duration-300">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-red-100/60 blur-3xl dark:bg-red-900/10" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl dark:bg-orange-900/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-black text-red-600 dark:bg-slate-800 dark:border-red-900/30">
            <Users className="h-4 w-4" /> Trusted by 10,000+ travellers
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            What travellers say about <span className="block text-red-600">TedBus</span>
          </h2>
          <p className="mt-4 text-base font-medium leading-7 text-slate-600 dark:text-slate-400">Real reviews from happy customers who trust TedBus for their journeys across India.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 dark:bg-slate-950 dark:border-slate-800">
              <div className="absolute -right-4 -top-4 text-red-50 dark:text-slate-900 opacity-20 group-hover:opacity-40 transition-opacity">
                <Quote className="h-24 w-24" />
              </div>
              <div className="relative">
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-5 text-base font-medium leading-7 text-slate-700 dark:text-slate-300">“{item.review}”</p>
                <div className="my-6 h-px bg-slate-100 dark:bg-slate-800" />
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-500 text-lg font-black text-white">{item.initial}</div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;