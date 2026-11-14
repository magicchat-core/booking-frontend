import axios from 'axios';
import { SAGEION_DEMO_APPS } from '@/config/sageionDemos';

export const TOKEN_KEY = 'crm_token';
export const USER_KEY = 'crm_user';

// ⭐ Resolve the currently active demo id. Set by DemoDetail.jsx's
// "Try Me" button before it navigates to /owner, so by the time any
// API call fires, this reflects the demo the visitor is exploring.
//
// Defaults to 'demo1' when no demo is set (e.g., a direct /owner
// visit, or a fresh page load before "Try Me" has run). That's a
// sensible fallback — demo1 is the canonical starting point.
function getActiveDemoId() {
  if (typeof window === 'undefined') return 'demo1';
  try {
    return localStorage.getItem('active_demo') || 'demo1';
  } catch {
    return 'demo1';
  }
}

// ⭐ Resolve the API base URL from SAGEION_DEMO_APPS[active_demo].
//
// Resolution order:
//   1. active demo's API_BASE_full_URL
//   2. NEXT_PUBLIC_API_BASE_full_URL env var
//   3. any demo's API_BASE_full_URL (guards against a demo entry
//      that omitted the field by mistake)
//   4. hardcoded fallback
//
// Because active_demo can change mid-session (only via a full page
// reload, per our design), this is re-evaluated on every request
// from the interceptor below.
function currentBaseUrl() {
  const activeDemoId = getActiveDemoId();
  const appConfig = SAGEION_DEMO_APPS[activeDemoId];
  if (appConfig?.API_BASE_full_URL) {
    return appConfig.API_BASE_full_URL;
  }

  if (process.env.NEXT_PUBLIC_API_BASE_full_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_full_URL;
  }

  const firstDemo = Object.values(SAGEION_DEMO_APPS)[0];
  if (firstDemo?.API_BASE_full_URL) {
    return firstDemo.API_BASE_full_URL;
  }

  return 'http://122.160.157.99:3001';
}

const api = axios.create({
  // Base URL applied at create time — the interceptor re-resolves
  // it per request in case active_demo changes.
  baseURL: currentBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  // Re-resolve on every request.
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