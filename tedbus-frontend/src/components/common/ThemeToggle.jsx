
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff] transition-all hover:border-red-200 active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-slate-600 transition-all duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300 animate-pulse" />
      )}
      
      {/* 🔴 TedBus Red Indicator */}
      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-600"></span>
    </button>
  );
};

export default ThemeToggle;