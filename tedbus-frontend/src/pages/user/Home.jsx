import { Suspense, lazy } from "react";

import Hero from "../../components/home/Hero";
import Footer from "../../components/common/Footer";

const Offers = lazy(() => import("../../components/home/Offers"));
const Features = lazy(() => import("../../components/home/Features"));
const PopularRoutes = lazy(() => import("../../components/home/PopularRoutes"));
const Testimonials = lazy(() => import("../../components/home/Testimonials"));

const SectionLoader = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="mx-auto h-6 w-48 rounded-full bg-slate-200" />
        <div className="mx-auto h-10 w-80 max-w-full rounded-full bg-slate-200" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-44 rounded-3xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="h-full rounded-3xl bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Above the fold */}
      <Hero />

      {/* Below the fold sections */}
      <Suspense fallback={<SectionLoader />}>
        <Offers />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PopularRoutes />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Footer />
    </main>
  );
};

export default Home;