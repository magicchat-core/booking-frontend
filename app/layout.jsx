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
      </head>
      <body>
        <Script src="/config.js" strategy="beforeInteractive" />
        <AuthProvider>
          <SageionBridge />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}