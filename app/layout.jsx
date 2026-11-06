import './globals.css';
import Script from 'next/script';
import { AuthProvider } from '@/api/AuthContext';
import SageionBridge from '@/components/SageionBridge';

export const metadata = { title: 'Ref CRM' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        
        {/* 1. Socket.IO */}
        <Script 
          src="https://cdn.socket.io/4.1.2/socket.io.min.js" 
          strategy="beforeInteractive" 
        />
        
        {/* 2. Sageion bundle */}
        <Script 
          src="https://magicchat-core.github.io/prod-ssc-client-cdns/bundle.js" 
          strategy="beforeInteractive" 
        />

        {/* 3. Local config */}
        <Script 
          src="/config.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body>
        <AuthProvider>
          <SageionBridge />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}