
'use client';

import { useState, useEffect, useCallback } from 'react';

// A function to determine if the code is running in a browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // This function will be used to lazily initialize state, so it's only called once.
  const readValue = useCallback((): T => {
    if (!isBrowser()) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // Use a lazy initializer for useState to read from localStorage only on the first render.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // This effect runs once on the client to sync the state with localStorage.
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const setValue = (value: T | ((val: T) => T)) => {
    if (!isBrowser()) {
      console.warn(
        `Tried setting localStorage key “${key}” even though environment is not a client`
      );
      return;
    }

    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      // This custom event is used to sync state across different hooks using the same key.

      window.dispatchEvent(new CustomEvent("local-storage", { detail: { key } }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  };


  useEffect(() => {
    const handleStorageChange = (event: StorageEvent | CustomEvent) => {
      if (event instanceof StorageEvent && event.key !== key) return;
      if (event instanceof CustomEvent && event.detail?.key !== key) return;

      setStoredValue(readValue());
    };

    if (isBrowser()) {
      // Listen for changes from other tabs
      window.addEventListener("storage", handleStorageChange);
      // Listen for changes from the same tab (custom event)
      window.addEventListener("local-storage", handleStorageChange as EventListener);
    }

    return () => {
      if (isBrowser()) {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("local-storage", handleStorageChange as EventListener);
      }
    };
  }, [readValue]);


  return [storedValue, setValue];
}

export default useLocalStorage;
