import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bus,
  // GithubIcon,
  Headphones,
  // Instagram,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
 
} from "lucide-react";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Blog", to: "/blog" },
];

const supportLinks = [
  { label: "Help Center", to: "/contact" },
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
];

// const socialLinks = [
//   { label: "GithubIcon", icon: GithubIcon },
//   { label: "Twitter", icon: Twitter },
//   { label: "Instagram", icon: Instagram },
// ];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Background Accent */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Top CTA Strip */}
      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-1 shadow-2xl shadow-red-500/20">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[1.8rem] bg-slate-950 p-8 md:flex-row">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white sm:text-3xl">
                Plan your next bus journey with TedBus
              </h3>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
                Book buses easily. Pay securely. Travel comfortably.
              </p>
            </div>

            <Link
              to="/search-bus"
              className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-500/30 transition hover:bg-red-700 active:scale-95"
            >
              Search Buses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/30">
                <Bus className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-white">
                  TedBus
                </h1>
                <p className="-mt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Book. Ride. Relax.
                </p>
              </div>
            </Link>

            <p className="mt-5 text-sm font-medium leading-6 text-slate-400">
              Your trusted partner for safe, secure and comfortable bus travel
              across India.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-black text-green-400">
              <ShieldCheck className="h-4 w-4" />
              100% Secure Booking
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-wider text-white">
              Quick Links
            </h4>

            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-wider text-white">
              Support
            </h4>

            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-3 text-sm font-medium text-slate-400">
              <a
                href="mailto:support@tedbus.com"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="h-4 w-4" />
                support@tedbus.com
              </a>

              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>

              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                New Delhi, India
              </p>
            </div>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-wider text-white">
              Stay Connected
            </h4>

            <p className="text-sm font-medium leading-6 text-slate-400">
              Get latest offers and travel deals straight in your inbox.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-500 focus:border-red-500 focus:bg-white/10"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-500/30 transition hover:bg-red-700 active:scale-95"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              {/* {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-500/30 hover:bg-red-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })} */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs font-semibold text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} TedBus. All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-red-500" />
            Support available 24×7
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;