import { useState, useEffect } from 'react';

export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const raw = localStorage.getItem(key);
    if (!raw) return initialValue;
    try {
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`Failed to parse localStorage key "${key}"`, error);
      localStorage.removeItem(key);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set localStorage key "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
