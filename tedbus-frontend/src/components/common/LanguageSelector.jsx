import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown, Check } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  // Outside click handle karne ke liye
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔘 Selector Button (Claymorphism Style) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-slate-100 rounded-2xl shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] hover:border-red-200 transition-all active:scale-95"
      >
        <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
          <Languages size={16} />
        </div>
        <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
          {currentLanguage.code}
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* 📂 Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-40 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[1.5rem] shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 space-y-1">
            {languages.map((lng) => (
              <button
                key={lng.code}
                onClick={() => changeLanguage(lng.code)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  i18n.language === lng.code
                    ? "bg-red-50 text-red-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-red-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{lng.flag}</span>
                  <span>{lng.name}</span>
                </div>
                {i18n.language === lng.code && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;