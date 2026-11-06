import './globals.css';
import { AuthProvider } from '@/api/AuthContext';

export const metadata = { title: 'Ref CRM' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}