'use client';

import Link from 'next/link';

// Static demo data. Replace with an API call later if you need to.
const DEMOS = [
  {
    id: 'demo1',
    name: 'Demo 1 — Inventory & Purchase Orders',
    description: 'Walk through: view stock → raise a PO → approve → stock updates.',
    tables: 12,
    status: 'active',
  },
  {
    id: 'demo2',
    name: 'Demo 2 — Cloud Kitchen',
    description: 'Delivery-only kitchen with order dispatch.',
    tables: 0,
    status: 'active',
  },
  {
    id: 'demo3',
    name: 'Demo 3 — Café',
    description: 'Quick-serve café with menu availability.',
    tables: 6,
    status: 'paused',
  },
];

export default function Demos() {
  return (
    <div>
      <h1>Demos</h1>
      <p className="muted">Pick a demo to open its details. Then open the Owner CRM for that demo.</p>

      <div className="grid">
        {DEMOS.map((d) => (
          <Link
            key={d.id}
            href={`/demos/${d.id}`}
            className="card stat"
            style={{ textDecoration: 'none' }}
          >
            <span className="stat-num">{d.name.split('—')[0].trim()}</span>
            <span className="stat-label">{d.description}</span>
            <span className={`pill ${d.status === 'active' ? 'ok' : 'off'}`} style={{ marginTop: 8 }}>
              {d.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
