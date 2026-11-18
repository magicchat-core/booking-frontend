'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // ⭐ Added usePathname
import { useAuth } from '@/api/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // ⭐ Get the current path

  useEffect(() => {
    if (loaded && !user) {
      // ⭐ Pass the intended path so we can redirect after login
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loaded, user, router, pathname]);

  if (!loaded) return null;
  if (!user) return null;

  return children;
}