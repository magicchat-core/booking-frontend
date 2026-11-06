'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ⭐ Only redirect once auth has actually hydrated. Before `loaded`
    // flips, `user === null` is ambiguous — it means "haven't checked
    // localStorage yet", not "logged out".
    if (loaded && !user) {
      router.replace('/login');
    }
  }, [loaded, user, router]);

  // ⭐ Render nothing while auth is hydrating. One frame in practice.
  if (!loaded) return null;

  // ⭐ After hydration with no user — the redirect effect above is
  // queued. Return null so we don't flash protected content.
  if (!user) return null;

  return children;
}