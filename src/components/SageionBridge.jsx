'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../api/AuthContext';

export default function SageionBridge() {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Poll to see if the script has loaded
    const checkReady = setInterval(async () => {
      // Check if the SDK is fully attached to the window
      if (window.sageion_os && window.__APP_CONFIG__) {
        clearInterval(checkReady); // Stop polling
        
        console.log("FIXING _LOAD: SDK found! Running setUp manually...");
        try {
          await window.sageion_os.setUp(
            window.__APP_CONFIG__.SAGEION_APP_ID,
            window.__APP_CONFIG__.SAGEION_API_KEY,
            window.__APP_CONFIG__.SAGEION_REGION,
            window.__APP_CONFIG__.ROOT_SAGEION_ID
          );
          console.log("FIXING _LOAD: setUp successful!");
          setIsReady(true); // Only NOW are we ready for initialize
        } catch (err) {
          console.error("FIXING _LOAD: setUp failed:", err);
        }
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, []);

  // 2. Run initialize ONLY after setUp has finished
  useEffect(() => {
    if (!isReady) return;
    
    console.log("FIXING _LOAD: Running initialize with user:", user);
    window.sageion_os
      .initialize(user ? { uid: String(user.user_id) } : {})
      .catch((err) => console.error('[Sageion] initialize failed:', err));
      
  }, [isReady, user]);

  return null;
}