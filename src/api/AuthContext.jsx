'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { currentUser, saveSession, clearSession } from './client';
import api from './client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ⭐ Distinguishes "no user" (logged out) from "not hydrated yet".
  // Without this, ProtectedRoute fires router.replace('/login') on the
  // very first render, before the hydrate effect below runs, and the
  // user sees a spurious redirect on every page reload.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUser(currentUser());
    setLoaded(true); // ← hydration complete
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

  const value = useMemo(
    () => ({ user, loaded, login, register, logout }),
    [user, loaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}