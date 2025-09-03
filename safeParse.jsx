export default function safeParse(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}"`, error);
    localStorage.removeItem(key);
    return defaultValue;
  }
}
