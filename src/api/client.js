import axios from 'axios';

export const TOKEN_KEY = 'crm_token';
export const USER_KEY  = 'crm_user';

// 1. Define the fallback based on the window object
// If the window object exists and has the config, use it.
// Otherwise, hardcode the URL so it NEVER falls back to localhost:5173.
const FALLBACK_API_URL = 
  (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_full_URL) 
    ? window.__APP_CONFIG__.API_BASE_full_URL 
    : 'http://122.160.157.99:3001';

function currentBaseUrl() {
  // Always re-check window in case the script loaded after this file was imported
  if (typeof window !== 'undefined' && window.__APP_CONFIG__?.API_BASE_full_URL) {
    return window.__APP_CONFIG__.API_BASE_full_URL;
  }
  // Fallback to the environment variable
  if (process.env.NEXT_PUBLIC_API_BASE_full_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_full_URL;
  }
  // Final fallback
  return FALLBACK_API_URL;
}

const api = axios.create({
  // Set the baseURL right away so it's applied to the instance
  baseURL: FALLBACK_API_URL, 
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  // Ensure the baseURL is set correctly for every request
  config.baseURL = currentBaseUrl();
  
  // Attach token
  if (typeof window !== 'undefined') {
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

export function saveSession(data) {
  if (typeof window === 'undefined') return;
  const token = data.token;
  const user_id = data.user_id || data.user?.id;
  const email = data.email || data.user?.email;
  const role = data.role || data.user?.role;
  
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
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { return null; }
}

export default api;