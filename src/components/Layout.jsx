'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/api/AuthContext';

const nav = [
  { to: '/demos', label: 'Demos' },
  { to: '/owner',           label: 'Running Tables' },
  { to: '/',                label: 'Dashboard' },
  { to: '/menu',            label: 'Menu' },
  { to: '/inventory',       label: 'Inventory' },
  { to: '/purchase-orders', label: 'Purchase Orders' },
  { to: '/orders',          label: 'Orders' },
  { to: '/customers',       label: 'Customers' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">🍛 Ref&nbsp;CRM</div>
        <nav>
          {nav.map((n) => {
            const active = n.to === '/' ? pathname === '/' : pathname.startsWith(n.to);
            return (
              <Link key={n.to} href={n.to} className={active ? 'nav-link active' : 'nav-link'}>
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <span className="who">{user?.email} <em>({user?.role})</em></span>
          <button className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
