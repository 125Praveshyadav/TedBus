import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Check,
  ChevronDown,
  Globe2,
  Languages,
  Sparkles,
} from "lucide-react";

const languages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    accent: "from-sky-600 to-blue-500",
    softBg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900/50",
  },
  {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    accent: "from-emerald-600 to-teal-500",
    softBg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/50",
  },
];

const getLanguageCode = (language = "") => {
  return String(language).split("-")[0];
};

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const currentCode = getLanguageCode(i18n.language);

  const currentLanguage =
    languages.find((language) => language.code === currentCode) ||
    languages[0];

  const changeLanguage = async (languageCode) => {
    await i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Premium selector button */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="group flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg active:translate-y-0 active:scale-[0.98] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-teal-900"
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${currentLanguage.accent} text-white shadow-md transition-transform duration-300 group-hover:scale-105`}
        >
          <Languages className="h-4 w-4" />
        </div>

        <div className="hidden min-w-0 text-left sm:block">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
            Language
          </p>

          <p className="text-xs font-black uppercase leading-none text-slate-800 dark:text-slate-100">
            {currentLanguage.code}
          </p>
        </div>

        <span className="text-sm leading-none sm:hidden">
          {currentLanguage.flag}
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-300 dark:text-slate-500 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-64 max-w-[calc(100vw-1rem)] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40"
        >
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-sky-600 p-4 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />

            <div className="pointer-events-none absolute -bottom-12 left-0 h-28 w-28 rounded-full bg-cyan-300/25 blur-2xl" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl">
                <Globe2 className="h-5 w-5" />
              </div>

              <div>
                <div className="mb-0.5 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em] text-white/80">
                  <Sparkles className="h-2.5 w-2.5" />
                  Translate
                </div>

                <h3 className="text-sm font-black">
                  Choose Language
                </h3>

                <p className="text-[10px] font-medium text-cyan-100/80">
                  Select your preferred language
                </p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-1 p-2">
            {languages.map((language) => {
              const active =
                language.code === currentLanguage.code;

              return (
                <button
                  key={language.code}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => changeLanguage(language.code)}
                  className={`group flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 active:scale-[0.98] ${
                    active
                      ? `${language.softBg} ${language.border}`
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-800/70"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg shadow-sm ${
                        active
                          ? `bg-gradient-to-br ${language.accent} text-white`
                          : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {language.flag}
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm font-black ${
                          active
                            ? language.text
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {language.nativeName}
                      </p>

                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {language.name}
                      </p>
                    </div>
                  </div>

                  {active ? (
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${language.accent} text-white shadow-md`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[4]" />
                    </span>
                  ) : (
                    <span className="h-6 w-6 shrink-0 rounded-full border border-slate-200 dark:border-slate-700" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
            <p className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
              Language preference is saved automatically
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;