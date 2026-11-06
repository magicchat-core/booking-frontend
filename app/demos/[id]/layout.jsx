// app/demos/[id]/layout.jsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function DemoLayout({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}