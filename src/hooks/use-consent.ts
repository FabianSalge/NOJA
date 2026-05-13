import { useState, useEffect, useCallback } from 'react';

const CONSENT_STORAGE_KEY = 'noja-cookie-consent';
const CONSENT_VERSION = 2;

function getStoredAcknowledgement(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.version === CONSENT_VERSION;
    }
  } catch {
    // ignore corrupt data
  }
  return false;
}

function storeAcknowledgement(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  }));
}

export function useConsent() {
  const [hasConsented, setHasConsented] = useState<boolean>(() => getStoredAcknowledgement());

  useEffect(() => {
    setHasConsented(getStoredAcknowledgement());
  }, []);

  const acknowledge = useCallback(() => {
    storeAcknowledgement();
    setHasConsented(true);
  }, []);

  const resetConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
    setHasConsented(false);
  }, []);

  return { hasConsented, acknowledge, resetConsent };
}
