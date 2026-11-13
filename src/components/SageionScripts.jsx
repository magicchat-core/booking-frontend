// src/components/SageionScripts.jsx
'use client';

import { useEffect } from 'react';

// Module-scope set of appIds we've bootstrapped on this page load.
// Prevents duplicate <script> tags and duplicate setUp() calls if
// the component remounts for the same app.
const BOOTSTRAPPED_APP_IDS = new Set();

export default function SageionScripts({ appConfig }) {
  useEffect(() => {
    const appId = appConfig?.SAGEION_APP_ID || appConfig?.appId;
    const apiKey = appConfig?.SAGEION_API_KEY || appConfig?.apiKey;
    const region = appConfig?.SAGEION_REGION || appConfig?.region || 'US';
    const rootId = appConfig?.ROOT_SAGEION_ID || appConfig?.rootId || '';

    if (!appId || !apiKey) {
      console.error(
        '[SageionScripts] missing SAGEION_APP_ID or SAGEION_API_KEY in appConfig',
        appConfig,
      );
      return;
    }

    // Idempotency guards.
    if (BOOTSTRAPPED_APP_IDS.has(appId)) {
      console.log('[SageionScripts] already bootstrapped for', appId);
      return;
    }
    if (BOOTSTRAPPED_APP_IDS.size > 0) {
      console.error(
        '[SageionScripts] a different Sageion app is already bootstrapped',
        Array.from(BOOTSTRAPPED_APP_IDS),
        '— refusing to hot-swap to',
        appId,
        '. A full page reload is required to switch apps.',
      );
      return;
    }
    BOOTSTRAPPED_APP_IDS.add(appId);

    // ⭐ Font Awesome stylesheet — added idempotently so a
    // remount doesn't stack duplicate <link> tags.
    if (!document.getElementById('sageion-font-awesome')) {
      const faLink = document.createElement('link');
      faLink.id = 'sageion-font-awesome';
      faLink.rel = 'stylesheet';
      faLink.href =
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
      document.head.appendChild(faLink);
    }

    const isDev = process.env.NODE_ENV === 'development';
    const bundleSrc = isDev
      ? '/local-bundle/bundle.js'
      : 'https://magicchat-core.github.io/prod-ssc-client-cdns/bundle.js';

    // 1. socket.io
    const socketScript = document.createElement('script');
    socketScript.src = 'https://cdn.socket.io/4.1.2/socket.io.min.js';
    socketScript.async = false;
    document.body.appendChild(socketScript);

    // 2. bundle
    const bundleScript = document.createElement('script');
    bundleScript.src = bundleSrc;
    bundleScript.async = false;

    bundleScript.onload = async () => {
      console.log('[SageionScripts] bundle loaded for', appId);

      if (!window.sageion_os) {
        console.error('[SageionScripts] window.sageion_os not present after bundle load');
        return;
      }

      try {
        await window.sageion_os.setUp(appId, apiKey, region, rootId);
        console.log('[SageionScripts] setUp complete for', appId);

        window.dispatchEvent(
          new CustomEvent('sageion_setup_complete', {
            detail: { appId },
          }),
        );
      } catch (err) {
        console.error('[SageionScripts] setUp failed for', appId, err);
      }
    };

    document.body.appendChild(bundleScript);

    // Cleanup: hide the floating bubble when this component unmounts.
    return () => {
      try {
        const bubble = document.querySelector('[id^="chat_modal_opener__"]');
        if (bubble) bubble.style.display = 'none';
        const modal = document.querySelector('[class^="chat_modal__"]');
        if (modal) modal.style.display = 'none';
      } catch (_) {
        /* no-op */
      }
    };
  }, [appConfig]);

  return null;
}