'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext';

export default function SageionBridge() {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Listen for the custom event dispatched by SageionScripts
    const handleSetupComplete = () => {
      console.log('FIXING _LOAD: Received setup_complete event. Ready to initialize.');
      setIsReady(true);
    };

    window.addEventListener('sageion_setup_complete', handleSetupComplete);

    // Fallback: In case the event fired before this component mounted
    if (window.sageion_os && window.sageion_os._isSetupComplete) {
        setIsReady(true);
    }

    return () => {
      window.removeEventListener('sageion_setup_complete', handleSetupComplete);
    };
  }, []);

  // Run initialize ONLY after setUp has finished
  useEffect(() => {
    if (!isReady) return;
    
    console.log("FIXING _LOAD: Running initialize with user:", user);
    window.sageion_os
      .initialize(user ? { uid: String(user.user_id) } : {})
      .catch((err) => console.error('[Sageion] initialize failed:', err));
      
  }, [isReady, user]);

  return null;
}