'use client';

import Script from 'next/script';

export default function SageionScripts() {
  console.log("FIXING _LOAD: SageionScripts component rendered (Server or Client)");
  
  const isDev = process.env.NODE_ENV === 'development';
  const sageionScriptSrc = isDev 
    ? '/local-bundle/bundle.js' 
    : 'https://magicchat-core.github.io/prod-ssc-client-cdns/bundle.js';

  console.log("FIXING _LOAD: isDev =", isDev);
  console.log("FIXING _LOAD: sageionScriptSrc =", sageionScriptSrc);

  return (
    <>
      <Script 
        src="https://cdn.socket.io/4.1.2/socket.io.min.js" 
        strategy="beforeInteractive" 
        onLoad={() => console.log("FIXING _LOAD: Socket.IO script loaded!")}
      />
      
      <Script 
        src="/config.js" 
        strategy="beforeInteractive" 
        onLoad={() => console.log("FIXING _LOAD: config.js script loaded!")}
      />

      <Script 
        src={sageionScriptSrc} 
        strategy="beforeInteractive" 
        onLoad={() => {
          console.log('FIXING _LOAD: Sageion bundle script loaded! Starting setUp...');
          console.log('FIXING _LOAD: window.sageion_os exists?', !!window.sageion_os);
          console.log('FIXING _LOAD: window.__APP_CONFIG__ exists?', !!window.__APP_CONFIG__);
          
          if (window.sageion_os && window.__APP_CONFIG__) {
            console.log('FIXING _LOAD: Calling window.sageion_os.setUp() with:', {
              appId: window.__APP_CONFIG__.SAGEION_APP_ID,
              region: window.__APP_CONFIG__.SAGEION_REGION,
            });

            window.sageion_os.setUp(
              window.__APP_CONFIG__.SAGEION_APP_ID,
              window.__APP_CONFIG__.SAGEION_API_KEY,
              window.__APP_CONFIG__.SAGEION_REGION,
              window.__APP_CONFIG__.ROOT_SAGEION_ID
            )
            .then(() => {
              console.log('FIXING _LOAD: [Sageion] SetUp successful!');
            })
            .catch((err) => {
              console.error('FIXING _LOAD: [Sageion] SetUp failed:', err);
            });
          } else {
            console.error('FIXING _LOAD: window.sageion_os or config is missing!');
            console.log('FIXING _LOAD: window.sageion_os =', window.sageion_os);
            console.log('FIXING _LOAD: window.__APP_CONFIG__ =', window.__APP_CONFIG__);
          }
        }}
        onError={(e) => console.error('FIXING _LOAD: Script failed to load (onError)', e)}
      />
    </>
  );
}