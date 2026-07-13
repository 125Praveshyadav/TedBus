import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bus,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const Footer = () => {
  const { t } = useTranslation("common");

  const quickLinks = [
    { label: t("footer.aboutUs"), to: "/about" },
    { label: t("footer.careers"), to: "/careers" },
    { label: t("footer.blog"), to: "/blog" },
  ];

  const supportLinks = [
    { label: t("footer.helpCenter"), to: "/contact" },
    { label: t("footer.contactUs"), to: "/contact" },
    { label: t("footer.privacyPolicy"), to: "/privacy" },
  ];

  return (
    <footer className="relative overflow-hidden bg-white text-slate-600 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-300">
      {/* Background Accents */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-red-600/5 blur-3xl dark:bg-red-600/10" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl dark:bg-orange-500/10" />

      {/* Main Footer Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          
          {/* Brand — mobile pe full width (col-span-2) */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-500/30 sm:h-12 sm:w-12">
                <Bus className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white sm:text-2xl">
                  TedBus
                </h1>
                <p className="-mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 sm:text-[11px]">
                  {t("footer.slogan")}
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
              {t("footer.brandDesc")}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs font-black text-green-600 dark:bg-green-500/10 dark:text-green-400">
              <ShieldCheck className="h-4 w-4" />
              {t("footer.secureBooking")}
            </div>
          </div>

          {/* Quick Links — mobile pe left column */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white sm:mb-5 sm:text-sm">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — mobile pe right column */}
          <div>
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white sm:mb-5 sm:text-sm">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info — mobile pe full width neeche */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white sm:mb-5 sm:text-sm">
              {t("footer.contactUs")}
            </h4>

            <div className="flex flex-col gap-3 text-sm font-medium text-slate-500 dark:text-slate-400 sm:gap-3">
              <a
                href="mailto:support@tedbus.com"
                className="flex items-center gap-2.5 transition hover:text-red-600 dark:hover:text-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <Mail className="h-4 w-4" />
                </span>
                support@tedbus.com
              </a>

              <a
                href="tel:+919838035860"
                className="flex items-center gap-2.5 transition hover:text-red-600 dark:hover:text-white"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <Phone className="h-4 w-4" />
                </span>
                +91 9838035860
              </a>

              <p className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  <MapPin className="h-4 w-4" />
                </span>
                New Delhi, India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-100 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs font-semibold text-slate-400 sm:flex-row sm:gap-3 sm:px-6 sm:py-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} TedBus. {t("footer.allRights")}
          </p>
          <p className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-red-500" />
            {t("footer.support247")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;