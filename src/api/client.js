import axios from 'axios';

export const TOKEN_KEY = 'crm_token';
export const USER_KEY  = 'crm_user';

// Priority:
//   1. Runtime config injected via public/config.js  (works without rebuild)
//   2. Build-time env var VITE_API_BASE_full_URL          (baked in at build)
//   3. '/' (same origin — relies on dev proxy / prod reverse proxy)
const BASE_URL =
  window.__APP_CONFIG__?.API_BASE_full_URL ||
  import.meta.env.VITE_API_BASE_full_URL ||
  '/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export function saveSession({ token, user_id, email, role }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ user_id, email, role }));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch { return null; }
}

export default api;