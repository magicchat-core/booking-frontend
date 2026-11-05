'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../api/AuthContext';

function useSageionSetUp() {
  const [ready, setReady] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        await window.sageion_os.setUp(
          window.__APP_CONFIG__.SAGEION_APP_ID,
          window.__APP_CONFIG__.SAGEION_API_KEY,
          window.__APP_CONFIG__.SAGEION_REGION,
          window.__APP_CONFIG__.ROOT_SAGEION_ID,
        );
        setReady(true);
      } catch (err) {
        console.error('[Sageion] setUp failed:', err);
      }
    })();
  }, []);

  return ready;
}

function useSageionInitialize(setUpReady) {
  const { user } = useAuth();

  useEffect(() => {
    if (!setUpReady) return;
    // NOTE: with the lazy useEffect-driven user hydration,
    // there is an initial `user === null` tick. That's equivalent
    // to your original `loading === false && user === null` case.
    // The SDK's initialize({}) is idempotent.
    window.sageion_os
      .initialize(user ? { uid: String(user.user_id) } : {})
      .catch((err) => console.error('[Sageion] initialize failed:', err));
  }, [setUpReady, user]);
}

export default function SageionBridge() {
  const setUpReady = useSageionSetUp();
  useSageionInitialize(setUpReady);
  return null;
}