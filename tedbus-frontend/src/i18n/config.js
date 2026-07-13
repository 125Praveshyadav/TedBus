import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enAuth from "./locales/en/auth.json";
import enBooking from "./locales/en/booking.json";
import enCommunity from "./locales/en/community.json";
import enNotification from "./locales/en/notification.json";
import enErrors from "./locales/en/errors.json";
import enOffers from "./locales/en/offers.json";

import hiCommon from "./locales/hi/common.json";
import hiHome from "./locales/hi/home.json";
import hiAuth from "./locales/hi/auth.json";
import hiBooking from "./locales/hi/booking.json";
import hiCommunity from "./locales/hi/community.json";
import hiNotification from "./locales/hi/notification.json";
import hiErrors from "./locales/hi/errors.json";
import hiOffers from "./locales/hi/offers.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    auth: enAuth,
    booking: enBooking,
    community: enCommunity,
    notification: enNotification,
    errors: enErrors,
    offers: enOffers,
  },
  hi: {
    common: hiCommon,
    home: hiHome,
    auth: hiAuth,
    booking: hiBooking,
    community: hiCommunity,
    notification: hiNotification,
    errors: hiErrors,
    offers: hiOffers,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "home", "auth", "booking", "community", "notification", "errors" , "offers"],

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "tedbus_language",
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;