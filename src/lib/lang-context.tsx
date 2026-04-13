"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { type Lang, translations } from "./translations";

type Translations = (typeof translations)[Lang];

type LangContextType = {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextType | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("sl");
  const toggleLang = useCallback(() => setLang((l) => (l === "sl" ? "en" : "sl")), []);
  const t = translations[lang];

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
