import './globals.css';
import { AuthProvider } from '@/api/AuthContext';
import SageionScripts from './SageionScripts'; // <-- Import the new component
import SageionBridge from '@/components/SageionBridge'; // <-- Keep this for initialize()

export const metadata = { title: 'Ref CRM' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        {/* Render the scripts here */}
        <SageionScripts />
      </head>
      <body>
        <AuthProvider>
          {/* Keep the bridge for the user-specific initialize() call */}
          <SageionBridge /> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}