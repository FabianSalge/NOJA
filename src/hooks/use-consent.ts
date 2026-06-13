import { useState, useEffect, useCallback } from 'react';

const CONSENT_STORAGE_KEY = 'noja-cookie-consent';
const CONSENT_VERSION = 2;

// Module-level subscribers so every useConsent() instance stays in sync.
// Without this, the banner and the analytics gate hold independent state and
// acknowledging in one would not load GA in the other until a full reload.
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

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
    const sync = () => setHasConsented(getStoredAcknowledgement());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resync from storage on mount in case it changed before this instance subscribed
    sync();
    listeners.add(sync);
    // Keep consent consistent across tabs.
    window.addEventListener('storage', sync);
    return () => {
      listeners.delete(sync);
      window.removeEventListener('storage', sync);
    };
  }, []);


  const acknowledge = useCallback(() => {
    storeAcknowledgement();
    setHasConsented(true);
    notify();
  }, []);

  const resetConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    }
    setHasConsented(false);
    notify();
  }, []);

  return { hasConsented, acknowledge, resetConsent };
}
