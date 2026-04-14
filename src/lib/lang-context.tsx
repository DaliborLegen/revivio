"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { type Lang, translations } from "./translations";

type Translations = (typeof translations)[Lang];

type Theme = "dark" | "light";

type LangContextType = {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
  theme: Theme;
  toggleTheme: () => void;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("sl");
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleLang = useCallback(() => setLang((l) => (l === "sl" ? "en" : "sl")), []);
  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem("revivio-theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.className = document.documentElement.className.replace(/dark|light/, "") + " " + saved;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.className = document.documentElement.className.replace(/dark|light/, "") + " " + next;
      localStorage.setItem("revivio-theme", next);
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, t, toggleLang, theme, toggleTheme }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
