import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [counts, setCounts] = useState({ menu: 0, lowStock: 0, pendingPOs: 0, customers: 0, orders: 0 });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [menu, low, pos, cust, ords] = await Promise.all([
        api.get('/menu'),
        api.get('/inventory/low-stock'),
        api.get('/purchase-orders'),
        api.get('/customers?phone=__none__').catch(() => ({ data: null })),
        Promise.resolve({ data: null }), // no GET /orders listing endpoint — placeholder
      ]);
      if (cancelled) return;
      setCounts({
        menu: menu.data.length,
        lowStock: low.data.length,
        pendingPOs: pos.data.filter((p) => p.status === 'pending_supplier').length,
        customers: '—',
        orders: '—',
      });
    }
    load().catch(console.error);
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p className="muted">One restaurant, one kitchen. Five workflows.</p>
      <div className="grid">
        <Link to="/menu" className="card stat">
          <span className="stat-num">{counts.menu}</span>
          <span className="stat-label">Menu items</span>
        </Link>
        <Link to="/inventory" className="card stat">
          <span className="stat-num warn">{counts.lowStock}</span>
          <span className="stat-label">Low-stock materials</span>
        </Link>
        <Link to="/purchase-orders" className="card stat">
          <span className="stat-num">{counts.pendingPOs}</span>
          <span className="stat-label">Pending POs</span>
        </Link>
        <Link to="/orders" className="card stat">
          <span className="stat-num">→</span>
          <span className="stat-label">Look up an order</span>
        </Link>
        <Link to="/customers" className="card stat">
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
