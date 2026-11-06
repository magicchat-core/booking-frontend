// src/config/sageionDemos.js
//
// Single source of truth for "which Sageion app does each demo mount".
//
// Every entry is exactly the shape that window.sageion_os.setUp() needs:
//
//   setUp(appId, apiKey, region, rootId, version?)
//
// rootId:
//   - "" (empty string) → the SDK falls back to document.body and mounts
//     the floating chat bubble bottom-right of the viewport. This is what
//     you want for a full-page demo.
//   - a DOM id string → the SDK mounts the bubble inside that element.
//     Use this only if the demo page has a dedicated container.
//
// version: leave off unless a specific demo pins to a non-V2 backend.
//
// ⚠️ These keys are public — they ship to the browser inside the JS
// bundle, exactly like the old /config.js did. That is expected: the
// Sageion api_key is designed to be client-visible and the backend
// validates by tenant + origin allowlist. Do NOT put any server-only
// secret here.

export const SAGEION_DEMO_APPS = {
  demo1: {
    SAGEION_APP_NAME: "demo_booking2",
    SAGEION_APP_ID: "APP-mw5bc7im-h5xvwm",
    SAGEION_API_KEY: "dGVuYW50Nl9fU0VQUkFUT1JfX2RlbW9fYm9va2luZzI=",
    SAGEION_REGION: "US",
    // API_BASE_URL: "https://booking-backend-1-qgrd.onrender.com/api",
    API_BASE_URL: "http://122.160.157.99:3001/api",
    API_BASE_full_URL: "http://122.160.157.99:3001",
    // API_BASE_full_URL: "https://booking-backend-1-qgrd.onrender.com",
  },
   demo2: {
    SAGEION_APP_NAME: "demo_booking23",
    SAGEION_APP_ID: "APP-mw5fl0li-t6zpzo",
    SAGEION_API_KEY: "dGVuYW50Nl9fU0VQUkFUT1JfX2RlbW9fYm9va2luZzIz",
    SAGEION_REGION: "US",
    // API_BASE_URL: "https://booking-backend-1-qgrd.onrender.com/api",
    API_BASE_URL: "http://122.160.157.99:3001/api",
    API_BASE_full_URL: "http://122.160.157.99:3001",
    // API_BASE_full_URL: "https://booking-backend-1-qgrd.onrender.com",
  }
};

// Convenience: is there a Sageion app configured for this demo id?
export function hasSageionApp(demoId) {
  return Boolean(SAGEION_DEMO_APPS[demoId]);
}

// Convenience: safe getter, returns null for unknown ids.
export function getSageionApp(demoId) {
  return SAGEION_DEMO_APPS[demoId] || null;
}