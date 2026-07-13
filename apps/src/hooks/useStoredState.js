import { useEffect, useState } from 'react';

export function readStoredState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

export function useStoredState(key, initialValue) {
  const [state, setState] = useState(() => readStoredState(key, initialValue));

  useEffect(() => {
    setState(readStoredState(key, initialValue));
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore persistence failures so the UI remains usable in private mode or restricted browsers.
    }
  }, [key, state]);

  return [state, setState];
}
