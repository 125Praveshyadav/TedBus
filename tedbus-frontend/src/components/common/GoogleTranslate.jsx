import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Globe,
  Languages,
  Loader2,
} from "lucide-react";

const languages = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
];

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
  const [ready, setReady] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const addScript = () => {
      if (document.getElementById("google_translate_script")) {
        // Script already loaded — check if combo exists
        if (document.querySelector(".goog-te-combo")) {
          setReady(true);
        }
        return;
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr,gu,pa,ta,te",
            autoDisplay: false,
          },
          "google_translate_element",
        );

        // Wait a tick for combo to appear
        const checkCombo = setInterval(() => {
          if (document.querySelector(".goog-te-combo")) {
            setReady(true);
            clearInterval(checkCombo);
          }
        }, 100);

        // Safety timeout
        setTimeout(() => clearInterval(checkCombo), 5000);
      };

      const script = document.createElement("script");
      script.id = "google_translate_script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    addScript();

    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeLanguage = (lang) => {
    const select = document.querySelector(".goog-te-combo");

    if (!select) {
      // Retry after short delay if Google widget not ready
      setTimeout(() => {
        const retrySelect =
          document.querySelector(".goog-te-combo");
        if (retrySelect) {
          retrySelect.value = lang.code;
          retrySelect.dispatchEvent(new Event("change"));
          setSelectedLang(lang);
          setIsOpen(false);
        }
      }, 300);
      return;
    }

    select.value = lang.code;
    select.dispatchEvent(new Event("change"));
    setSelectedLang(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden Google widget */}
      <div
        id="google_translate_element"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`group flex items-center gap-2 rounded-xl border px-2.5 py-2 transition-all duration-200 active:scale-95 ${
          isOpen
            ? "border-sky-300 bg-sky-50 shadow-md shadow-sky-500/10 dark:border-sky-800 dark:bg-sky-950/40"
            : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/60 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-800 dark:hover:bg-sky-950/30"
        }`}
      >
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
            isOpen
              ? "bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm shadow-sky-500/30"
              : "bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400"
          }`}
        >
          {!ready ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Globe className="h-3.5 w-3.5" />
          )}
        </div>

        {/* Desktop: language name */}
        <span className="hidden max-w-[72px] truncate text-xs font-black text-slate-700 dark:text-slate-300 sm:inline">
          {selectedLang.name}
        </span>

        {/* Mobile: flag */}
        <span className="text-sm sm:hidden">
          {selectedLang.flag}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 dark:text-slate-500 ${
            isOpen ? "rotate-180 text-sky-500" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full z-[100] mt-2 w-52 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40"
        >
          {/* Header */}
          <div className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
            <div className="relative bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 px-3.5 py-3 text-white">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
              <div className="pointer-events-none absolute -bottom-6 left-0 h-16 w-16 rounded-full bg-teal-300/20 blur-xl" />

              <div className="relative flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-white/10 backdrop-blur">
                  <Languages className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-xs font-black">
                    Translate Page
                  </p>
                  <p className="text-[9px] font-bold text-sky-100/80">
                    Powered by Google
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Language list */}
          <div className="max-h-64 space-y-0.5 overflow-y-auto p-2 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.4)_transparent]">
            {languages.map((lng) => {
              const isActive =
                selectedLang.code === lng.code;

              return (
                <button
                  key={lng.code}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => changeLanguage(lng)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 shadow-sm dark:from-sky-950/50 dark:to-cyan-950/40 dark:text-sky-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-base transition-transform duration-300 group-hover:scale-110 ${
                        isActive
                          ? "bg-white shadow-sm dark:bg-slate-800"
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {lng.flag}
                    </span>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-black ${
                          isActive
                            ? "text-sky-700 dark:text-sky-300"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {lng.nativeName}
                      </p>

                      <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {lng.name}
                      </p>
                    </div>
                  </div>

                  {isActive && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm shadow-sky-500/30">
                      <Check
                        className="h-3 w-3"
                        strokeWidth={3}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-3 py-2 dark:border-slate-800">
            <p className="text-center text-[9px] font-bold text-slate-400 dark:text-slate-500">
              {selectedLang.flag}{" "}
              {selectedLang.nativeName} selected
            </p>
          </div>
        </div>
      )}

      {/* Hide Google Translate default UI globally */}
      <style>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default GoogleTranslate;