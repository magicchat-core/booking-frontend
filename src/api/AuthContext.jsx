'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { currentUser, saveSession, clearSession } from './client';
import api from './client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy init reads localStorage — must be client-only. Keep the
  // same lazy-init pattern so SSR doesn't try to read localStorage.
  const [user, setUser] = useState(null);

  // Hydrate from localStorage on mount (browser only)
  useEffect(() => {
    setUser(currentUser());
  }, []);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
    setUser({ user_id: data.user_id, email: data.email, role: data.role });
    return data;
  }

  async function register(email, password, role = 'staff') {
    const { data } = await api.post('/auth/register', { email, password, role });
    saveSession(data);
    setUser({ user_id: data.user_id, email: data.email, role: data.role });
    return data;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}