import axios from 'axios';

export const TOKEN_KEY = 'crm_token';
export const USER_KEY  = 'crm_user';

// Resolve baseURL on every request (not once at module load).
// This survives config.js loading after the client bundle.
function currentBaseUrl() {
  if (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_full_URL) {
    return window.__APP_CONFIG__.API_BASE_full_URL;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_full_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_full_URL;
  }
  return '';  // empty = relative URL = Next rewrite handles it
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    config.baseURL = currentBaseUrl();
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (typeof window !== 'undefined' && err.response?.status === 401) {
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
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ user_id, email, role }));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function currentUser() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch { return null; }
}

export default api;
