import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { en } from './en';
import { de } from './de';

export type Language = 'en' | 'de';

// Use a more flexible type that allows different string values
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends readonly string[] ? readonly string[] : T[K] extends object ? DeepStringify<T[K]> : string;
};

export type Translations = DeepStringify<typeof en>;

const translations: Record<Language, Translations> = { en, de } as Record<Language, Translations>;

type LanguageContextType = {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'noja-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'de') return stored;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'en' ? 'de' : 'en'));
  }, []);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    t: translations[language],
    setLanguage,
    toggleLanguage,
  }), [language, setLanguage, toggleLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

export { en, de };

