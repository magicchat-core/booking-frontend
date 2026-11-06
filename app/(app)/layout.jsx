// app/(app)/layout.jsx
'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import SageionScripts from '@/components/SageionScripts';
import SageionBridge from '@/components/SageionBridge';
import { getSageionApp } from '@/config/sageionDemos';

export default function AuthedLayout({ children }) {
  // ⭐ Starts null so Sageion doesn't mount until we know WHICH app.
  // On a fresh page load this resolves in one tick.
  const [activeDemoId, setActiveDemoId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('active_demo');
    setActiveDemoId(stored || 'demo1'); // default to demo1 if none
  }, []);

  const sageionApp = activeDemoId ? getSageionApp(activeDemoId) : null;

  return (
    <ProtectedRoute>
      <Layout>
        {sageionApp && <SageionScripts appConfig={sageionApp} />}
        {sageionApp && <SageionBridge appConfig={sageionApp} />}
        {children}
      </Layout>
    </ProtectedRoute>
  );
}