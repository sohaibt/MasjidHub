"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Language } from "./types";
import { masjidConfig } from "../../masjid.config";

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLanguage: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(masjidConfig.DEFAULT_LANGUAGE);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  }, []);

  const isRTL = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} lang={lang} className={isRTL ? "font-amiri" : "font-inter"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
