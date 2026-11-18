// app/(public)/layout.jsx
import PublicHeader from '@/components/PublicHeader';

export default function PublicLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}