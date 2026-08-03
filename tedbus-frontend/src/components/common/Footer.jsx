import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BusFront,
  
  Headphones,

  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation("common");

  const quickLinks = [
    { label: t("footer.aboutUs", "About Us"), to: "/about" },
    { label: t("footer.careers", "Careers"), to: "/careers" },
    { label: t("footer.blog", "Blog"), to: "/blog" },
    { label: "Partner with us", to: "/partner" },
  ];

  const supportLinks = [
    { label: t("footer.helpCenter", "Help Center"), to: "/contact" },
    { label: t("footer.contactUs", "Contact Us"), to: "/contact" },
    { label: t("footer.privacyPolicy", "Privacy Policy"), to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ];

  // const socialLinks = [
  //   { icon: Facebook, href: "#", label: "Facebook" },
  //   { icon: Twitter, href: "#", label: "Twitter" },
  //   { icon: Instagram, href: "#", label: "Instagram" },
  //   { icon: Youtube, href: "#", label: "YouTube" },
  // ];

  return (
    <footer className="relative isolate overflow-hidden bg-slate-950 pt-16 transition-colors duration-300 dark:bg-[#050A15] sm:pt-20 lg:pt-24">
      {/* Premium Background Effects */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-red-600/10 blur-[128px] dark:bg-red-600/10" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[128px] dark:bg-orange-500/10" />
      
      {/* Subtle Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-30">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Section: Newsletter & Trust */}
      

        {/* Main Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg shadow-red-500/20">
                <BusFront className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  TedBus
                </h1>
                <p className="-mt-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400">
                  {t("footer.slogan", "Travel with comfort")}
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm font-medium leading-6 text-slate-400">
              {t(
                "footer.brandDesc",
                "Your trusted partner for safe, comfortable, and affordable bus journeys across the country. Experience travel like never before."
              )}
            </p>

            {/* Social Links
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div> */}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-white">
              {t("footer.quickLinks", "Company")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    <span className="mr-2 h-px w-0 bg-red-500 transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-white">
              {t("footer.support", "Support")}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
                  >
                    <span className="mr-2 h-px w-0 bg-red-500 transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-white">
              {t("footer.contactUs", "Contact Us")}
            </h4>

            <div className="flex flex-col gap-4 text-sm font-medium text-slate-400">
              <a
                href="mailto:support@tedbus.com"
                className="group flex items-center gap-3 transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition group-hover:border-red-500/30 group-hover:bg-red-500/10 group-hover:text-red-400">
                  <Mail className="h-4 w-4" />
                </span>
                support@tedbus.com
              </a>

              <a
                href="tel:+919838035860"
                className="group flex items-center gap-3 transition hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition group-hover:border-red-500/30 group-hover:bg-red-500/10 group-hover:text-red-400">
                  <Phone className="h-4 w-4" />
                </span>
                +91 9838035860
              </a>

              <div className="group flex items-center gap-3 transition hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition group-hover:border-red-500/30 group-hover:bg-red-500/10 group-hover:text-red-400">
                  <MapPin className="h-4 w-4" />
                </span>
                New Delhi, India
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mt-16 border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs font-semibold text-slate-500">
            © {new Date().getFullYear()} TedBus. {t("footer.allRights", "All rights reserved.")}
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Secure
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Headphones className="h-3.5 w-3.5 text-red-500" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;