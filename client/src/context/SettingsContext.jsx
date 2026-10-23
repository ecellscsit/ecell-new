import { createContext, useContext, useEffect, useState } from 'react';
import http from '../api/http.js';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  useEffect(() => { http.get('/settings').then((r) => setSettings(r.data)).catch(() => {}); }, []);
  return <SettingsContext.Provider value={{ settings, setSettings }}>{children}</SettingsContext.Provider>;
}
