// app/(app)/layout.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import DemoGuide from '@/components/DemoGuide'; 
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

    const handle = window.sageion_os.mount({
      appId: appConfig.SAGEION_APP_ID,
      apiKey: appConfig.SAGEION_API_KEY,
      region: appConfig.SAGEION_REGION,
      rootId: appConfig.ROOT_SAGEION_ID || '',
      match: '/',
    });
    handleRef.current = handle;

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

  // ⭐ NEW: Listen for the "Use →" button click from DemoGuide
  useEffect(() => {
    const handleInjectPrompt = (e) => {
      const { prompt } = e.detail;
      
      // Sageion mounts to document.body, so we can query it directly.
      // We use a slight delay to ensure the chat input is fully rendered if the chat was just opened.
      setTimeout(() => {
        // Try to find the textarea (Sageion's chat input)
        const chatInput = document.querySelector('textarea[placeholder*="Type a message"]') || 
                          document.querySelector('textarea') || 
                          document.querySelector('input[type="text"]'); 
        
        if (chatInput) {
          chatInput.value = prompt;
          // React inputs need this native event to trigger their state change
          const event = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(event);
          chatInput.focus();
        } else {
          console.warn('[DemoGuide] Could not find Sageion chat input to inject prompt.');
        }
      }, 300); 
    };

    window.addEventListener('sageion_inject_prompt', handleInjectPrompt);
    return () => window.removeEventListener('sageion_inject_prompt', handleInjectPrompt);
  }, []);

  return (
    <ProtectedRoute>
      <Layout>
        {children}
      </Layout>
      <DemoGuide /> 
    </ProtectedRoute>
  );
}