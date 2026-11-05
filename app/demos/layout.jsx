'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function DemosLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
