'use client';

import SageionScripts from '@/components/SageionScripts';
import SageionBridge from '@/components/SageionBridge';

export default function OwnerLayout({ children }) {
  return (
    <>
      <SageionScripts />
      <SageionBridge />
      {children}
    </>
  );
}