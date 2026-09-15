import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { en } from "./en";
import { de } from "./de";
import { languageFromPath, localizedPath, type Language } from "@/lib/locale";
export type { Language } from "@/lib/locale";

// Use a more flexible type that allows different string values
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends readonly string[]
    ? readonly string[]
    : T[K] extends object
      ? DeepStringify<T[K]>
      : string;
};

export type Translations = DeepStringify<typeof en>;

const translations: Record<Language, Translations> = { en, de } as Record<
  Language,
  Translations
>;

type LanguageContextType = {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "noja-language";

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const language =
    initialLanguage ??
    languageFromPath(
      typeof window === "undefined" ? "/" : window.location.pathname,
    );
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* Storage is optional. */
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    window.location.assign(
      localizedPath(window.location.pathname, lang) +
        window.location.search +
        window.location.hash,
    );
  }, []);
  const toggleLanguage = useCallback(
    () => setLanguage(language === "en" ? "de" : "en"),
    [language, setLanguage],
  );

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      t: translations[language],
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

export { en, de };
