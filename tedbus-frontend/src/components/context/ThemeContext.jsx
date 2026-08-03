import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔑 FIX: Backend theme SIRF tab apply karo jab localStorage KHALI ho
  // (matlab naya device/browser hai). localStorage hamesha priority.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (isAuthenticated && user?.theme && !savedTheme) {
      setTheme(user.theme);
    }
  }, [isAuthenticated, user?.theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    if (isAuthenticated) {
      try {
        await api.put("/users/update-profile", { theme: newTheme });
      } catch (err) {
        console.error("Theme sync to backend failed:", err.message);
      }
    }
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};