import { useState, useEffect, useCallback } from 'react';

export type ConsentPreferences = {
  essential: boolean; // Always true, required for site functionality
  analytics: boolean; // Vercel Analytics, Speed Insights
};

type ConsentState = {
  hasConsented: boolean;
  preferences: ConsentPreferences;
};

const CONSENT_STORAGE_KEY = 'noja-cookie-consent';

const defaultPreferences: ConsentPreferences = {
  essential: true,
  analytics: false,
};

function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        hasConsented: true,
        preferences: {
          essential: true, // Always true
          analytics: parsed.analytics ?? false,
        },
      };
    }
  } catch {
    // Invalid stored data, ignore
  }
  return null;
}

function storeConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
    analytics: preferences.analytics,
    timestamp: new Date().toISOString(),
  }));
}

export function useConsent() {
  const [state, setState] = useState<ConsentState>(() => {
    const stored = getStoredConsent();
    return stored ?? { hasConsented: false, preferences: defaultPreferences };
  });

  // Check for stored consent on mount (handles SSR)
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setState(stored);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: true,
    };
    storeConsent(preferences);
    setState({ hasConsented: true, preferences });
  }, []);

  const declineOptional = useCallback(() => {
    const preferences: ConsentPreferences = {
      essential: true,
      analytics: false,
    };
    storeConsent(preferences);
    setState({ hasConsented: true, preferences });
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<ConsentPreferences>) => {
    setState((prev) => {
      const preferences: ConsentPreferences = {
        essential: true, // Always true
        analytics: newPreferences.analytics ?? prev.preferences.analytics,
      };
      storeConsent(preferences);
      return { hasConsented: true, preferences };
    });
  }, []);

  const resetConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
    setState({ hasConsented: false, preferences: defaultPreferences });
  }, []);

  return {
    hasConsented: state.hasConsented,
    preferences: state.preferences,
    acceptAll,
    declineOptional,
    updatePreferences,
    resetConsent,
  };
}
