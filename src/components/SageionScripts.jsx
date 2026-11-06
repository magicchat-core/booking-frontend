'use client';

import { useEffect } from 'react';

export default function SageionScripts() {
  const isDev = process.env.NODE_ENV === 'development';
  const sageionScriptSrc = isDev 
    ? '/local-bundle/bundle.js' 
    : 'https://magicchat-core.github.io/prod-ssc-client-cdns/bundle.js';

  useEffect(() => {
    // 1. Load Socket.IO
    const socketScript = document.createElement('script');
    socketScript.src = 'https://cdn.socket.io/4.1.2/socket.io.min.js';
    socketScript.async = false;
    document.body.appendChild(socketScript);

    // 2. Load Config
    const configScript = document.createElement('script');
    configScript.src = '/config.js';
    configScript.async = false;
    document.body.appendChild(configScript);

    // 3. Load Sageion Bundle
    const bundleScript = document.createElement('script');
    bundleScript.src = sageionScriptSrc;
    bundleScript.async = false;

    // 4. Run setUp when the bundle loads
    bundleScript.onload = () => {
      console.log('FIXING _LOAD: Bundle loaded! Running setUp...');
      if (window.sageion_os && window.__APP_CONFIG__) {
        window.sageion_os.setUp(
          window.__APP_CONFIG__.SAGEION_APP_ID,
          window.__APP_CONFIG__.SAGEION_API_KEY,
          window.__APP_CONFIG__.SAGEION_REGION,
          window.__APP_CONFIG__.ROOT_SAGEION_ID
        )
        .then(() => {
          console.log('FIXING _LOAD: setUp successful!');
          // Dispatch event for SageionBridge to start initialize
          window.dispatchEvent(new Event('sageion_setup_complete'));
        })
        .catch((err) => console.error('FIXING _LOAD: setUp failed', err));
      }
    };

    document.body.appendChild(bundleScript);

    // Cleanup function (if user navigates away)
    return () => {
      // Optional: Remove scripts if you want, but usually it's fine to leave them
    };
  }, [sageionScriptSrc]);

  return null; // This component doesn't render any visible UI
}