// app/(app)/layout.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { getSageionApp } from '@/config/sageionDemos';
import { useAuth } from '@/api/AuthContext';

export default function AuthedLayout({ children }) {
  const { user, loaded } = useAuth();
  const [activeDemoId, setActiveDemoId] = useState(null);
  const handleRef = useRef(null);

  useEffect(() => {
    setActiveDemoId(localStorage.getItem('active_demo') || 'demo1');
  }, []);

  useEffect(() => {
    if (!activeDemoId || !loaded) return;
    const appConfig = getSageionApp(activeDemoId);
    if (!appConfig) return;

    // ⭐ THIS IS WHERE mount() IS CALLED.
    // Replaces the old SageionScripts + SageionBridge pair.
    const handle = window.sageion_os.mount({
      appId: appConfig.SAGEION_APP_ID,
      apiKey: appConfig.SAGEION_API_KEY,
      region: appConfig.SAGEION_REGION,
      rootId: appConfig.ROOT_SAGEION_ID || '',
      match: '/',
    });
    handleRef.current = handle;

    // Push the current uid so bringLive() calls initialize({ uid }).
    handle.updateUid(user?.user_id ?? null);

    return () => {
      handleRef.current = null;
      handle.unmount();
    };
  }, [activeDemoId, loaded]);

  useEffect(() => {
    if (handleRef.current && loaded) {
      handleRef.current.updateUid(user?.user_id ?? null);
    }
  }, [user?.user_id, loaded]);

  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}