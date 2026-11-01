import { createContext, useContext, useMemo, useState } from 'react';
import { currentUser, saveSession, clearSession } from './client';
import api from './client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser());

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
