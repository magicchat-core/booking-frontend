'use client';
import Link from 'next/link';
import { useAuth } from '@/api/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export default function PublicHeader() {
  const { user, logout, loaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show this header on the actual login page
  if (!loaded || pathname === '/login') return null;

  return (
    <header style={{ 
      padding: '16px 32px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      borderBottom: '1px solid #334155',
      background: '#0f172a' // Matches your dark theme
    }}>
      <Link href="/" style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', textDecoration: 'none' }}>
        🍛 Ref CRM
      </Link>
      <div>
        {user ? (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>{user.email}</span>
            <button 
              onClick={() => { logout(); router.push('/login'); }}
              style={{ 
                background: 'transparent', border: '1px solid #334155', 
                color: '#f8fafc', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer',
                fontWeight: '500', fontSize: '14px'
              }}
            >
              Log out
            </button>
            <Link 
              href="/owner/inventory" 
              style={{ 
                background: '#3b82f6', color: 'white', padding: '6px 16px', 
                borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' 
              }}
            >
              Go to CRM →
            </Link>
          </div>
        ) : (
          <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: '600' }}>
            Sign In →
          </Link>
        )}
      </div>
    </header>
  );
}