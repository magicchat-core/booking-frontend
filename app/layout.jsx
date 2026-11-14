import './globals.css';
import { AuthProvider } from '@/api/AuthContext';
import Script from 'next/script';

export const metadata = { title: 'Ref CRM' };

export default function RootLayout({ children }) {
  const isDev = process.env.NODE_ENV === 'development';
  console.log("Arewrwhrwerwe?",isDev)
  const bundleSrc = isDev
    ? '/local-bundle/bundle.js'
    : 'https://magicchat-core.github.io/dev-ssc-client-cdns/bundle.js';

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>

        {/* ⭐ Sageion bundle — loads ONCE for the whole app.
            Loaded beforeInteractive so it's ready by the time
            any page calls window.sageion_os.mount(). */}
        <Script
          src="https://cdn.socket.io/4.1.2/socket.io.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src={bundleSrc}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}