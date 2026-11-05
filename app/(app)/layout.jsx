'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

export default function AuthedLayout({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
