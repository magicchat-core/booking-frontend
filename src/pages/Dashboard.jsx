'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/api/client';

export default function Dashboard() {
  const [counts, setCounts] = useState({ menu: 0, lowStock: 0, pendingPOs: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [menu, low, pos] = await Promise.all([
        api.get('/menu'),
        api.get('/inventory/low-stock'),
        api.get('/purchase-orders'),
      ]);
      if (cancelled) return;
      setCounts({
        menu: menu.data.length,
        lowStock: low.data.length,
        pendingPOs: pos.data.filter((p) => p.status === 'pending_supplier').length,
      });
    })().catch(console.error);
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">One restaurant, one kitchen. Five workflows.</p>
      <div className="grid">
        <Link href="/menu" className="card stat">
          <span className="stat-num">{counts.menu}</span>
          <span className="stat-label">Menu items</span>
        </Link>
        <Link href="/inventory" className="card stat">
          <span className="stat-num warn">{counts.lowStock}</span>
          <span className="stat-label">Low-stock materials</span>
        </Link>
        <Link href="/purchase-orders" className="card stat">
          <span className="stat-num">{counts.pendingPOs}</span>
          <span className="stat-label">Pending POs</span>
        </Link>
        <Link href="/orders" className="card stat">
          <span className="stat-num">→</span>
          <span className="stat-label">Look up an order</span>
        </Link>
        <Link href="/customers" className="card stat">
          <span className="stat-num">→</span>
          <span className="stat-label">Look up a customer</span>
        </Link>
      </div>
      <div className="card tip">
        <strong>Demo tip:</strong> try workflow 5 — go to Customers, search phone&nbsp;
        <code>+911111111111</code>, add 100 loyalty points.
      </div>
    </div>
  );
}
