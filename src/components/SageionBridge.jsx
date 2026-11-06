// src/components/SageionBridge.jsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext';

export default function SageionBridge({ appConfig }) {
  const { user, loaded } = useAuth();
  const [isReady, setIsReady] = useState(false);

  const appId = appConfig?.SAGEION_APP_ID || appConfig?.appId;

  useEffect(() => {
    const handleSetupComplete = (e) => {
      // ⭐ Filter to OUR app id, in case two bridges ever coexist.
      if (!e.detail || !appId || e.detail.appId === appId) {
        console.log(
          '[SageionBridge] received sageion_setup_complete for',
          e.detail?.appId,
        );
        setIsReady(true);
      }
    };

    window.addEventListener('sageion_setup_complete', handleSetupComplete);

    // Fallback: event may have fired before we mounted.
    if (window.sageion_os && window.sageion_os._isSetupComplete) {
      setIsReady(true);
    }

    return () => {
      window.removeEventListener('sageion_setup_complete', handleSetupComplete);
    };
  }, [appId]);

  // ⭐ Only depend on user_id, not the whole user object.
  // AuthContext creates a fresh object on every login, so depending
  // on `user` would re-run initialize() even for the same user.
  const userId = user?.user_id;

  useEffect(() => {
    if (!isReady) return;
    if (!loaded) return; // ← don't boot in anonymous mode mid-hydration

    window.sageion_os
      .initialize(userId ? { uid: String(userId) } : {})
      .then(() => {
        // ⭐ Restore bubble visibility after initialize. SageionScripts
        // hides it on unmount; this flips it back when we re-enter the
        // authed tree.
        const bubble = document.querySelector('[id^="chat_modal_opener__"]');
        if (bubble) bubble.style.display = '';
      })
      .catch((err) => console.error('[Sageion] initialize failed:', err));
  }, [isReady, loaded, userId]);

  return null;
}