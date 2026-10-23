import { createContext, useContext, useEffect, useState } from 'react';
import http from '../api/http.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore session on page load
  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    http.get('/auth/me').then((r) => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await http.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };

  return <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>{children}</AuthContext.Provider>;
}
