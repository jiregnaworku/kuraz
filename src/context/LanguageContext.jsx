import { createContext, useContext, useEffect, useMemo, useState } from "react";

import translations from "../i18n/amharic";

const LanguageContext = createContext(null);

function readStoredLanguage() {
  const stored = localStorage.getItem("kuraz-language");

  return stored === "en" ? "en" : "am";
}

function resolvePath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(readStoredLanguage);

  useEffect(() => {
    localStorage.setItem("kuraz-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      t: (path) =>
        resolvePath(translations[language], path) ??
        resolvePath(translations.en, path) ??
        path,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
