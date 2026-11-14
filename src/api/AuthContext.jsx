'use client';

import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { currentUser, saveSession, clearSession } from './client';
import api from './client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // ⭐ Distinguishes "no user" (logged out) from "not hydrated yet".
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

  // ⭐ NEW: Request OTP for signup (used by Register.jsx)
  async function sendOtp(email) {
    const { data } = await api.post('/auth/send-otp', { email, purpose: 'signup' });
    return data;
  }

  // ⭐ UPDATED: Register now requires the OTP (used by VerifyOtp.jsx)
  async function register(email, password, otp) {
    const { data } = await api.post('/auth/register', { email, password, otp });
    saveSession(data);
    setUser({ user_id: data.user_id, email: data.email, role: data.role });
    return data;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, loaded, login, register, sendOtp, logout }),
    [user, loaded],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}