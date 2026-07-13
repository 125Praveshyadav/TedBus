import { useEffect, useState, useRef } from "react";
import { Languages, ChevronDown, Check, Globe } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", name: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "ગુજરાતી", flag: "🇮🇳" },
  { code: "pa", name: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "తెలుగు", flag: "🇮🇳" },
];

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const dropdownRef = useRef(null);

  useEffect(() => {
    // 1. Google Script load karna
    const addScript = () => {
      if (document.getElementById("google_translate_script")) return;
      
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,mr,gu,pa,ta,te", // Sirf zaroori languages
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };

      const script = document.createElement("script");
      script.id = "google_translate_script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    addScript();

    // 2. Click outside logic
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (langCode, langName) => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change")); // Force trigger Google Translate
      setSelectedLang(langName);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🛠️ Hidden Google Widget (Humein iska data chahiye par look nahi) */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* 🎨 Custom Premium Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] dark:shadow-none transition-all hover:border-red-200 active:scale-95"
      >
        <div className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
          <Globe size={16} />
        </div>
        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
          {selectedLang}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 📂 Premium Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[1.8rem] shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 max-h-72 overflow-y-auto scrollbar-hide">
            {languages.map((lng) => (
              <button
                key={lng.code}
                onClick={() => changeLanguage(lng.code, lng.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedLang === lng.name
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lng.flag}</span>
                  <span>{lng.name}</span>
                </div>
                {selectedLang === lng.name && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;