'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

const DEMOS = {
  demo1: {
    id: 'demo1',
    name: 'Demo 1 — Inventory & Purchase Orders',
    description: 'Walk through: view stock → raise a PO → approve → stock updates.',
    status: 'active',
  },
  demo2: {
    id: 'demo2',
    name: 'Demo 2 — Cloud Kitchen',
    description: 'Delivery-only kitchen with order dispatch.',
    status: 'active',
  },
  demo3: {
    id: 'demo3',
    name: 'Demo 3 — Café',
    description: 'Quick-serve café with menu availability.',
    status: 'paused',
  },
};

// ---------- Hardcoded inventory data ----------
const INITIAL_INVENTORY = [
  { material_id: 'chicken',  name: 'Chicken',        unit: 'kg',  current_qty: 3,   low_threshold: 5 },
  { material_id: 'rice',     name: 'Basmati Rice',   unit: 'kg',  current_qty: 20,  low_threshold: 10 },
  { material_id: 'tomato',   name: 'Tomato',         unit: 'kg',  current_qty: 8,   low_threshold: 6 },
  { material_id: 'paneer',   name: 'Paneer',         unit: 'kg',  current_qty: 2,   low_threshold: 4 },
  { material_id: 'oil',      name: 'Cooking Oil',    unit: 'L',   current_qty: 15,  low_threshold: 5 },
];

const INITIAL_POS = [
  { po_id: 'PO-1001', supplier: 'FreshMeat',  material_id: 'chicken', qty: 10, unit: 'kg', status: 'pending_supplier' },
  { po_id: 'PO-1002', supplier: 'GrainCo',    material_id: 'rice',    qty: 25, unit: 'kg', status: 'approved' },
];

// ============================================================
// Inventory Demo — pure frontend, all state local.
// Mirrors the real workflows without touching the backend.
// ============================================================
function InventoryDemo() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [pos, setPos] = useState(INITIAL_POS);
  const [step, setStep] = useState(1);           // 1=inspect, 2=create PO, 3=approve, 4=done
  const [form, setForm] = useState({
    supplier: 'FreshMeat',
    material_id: 'chicken',
    qty: 10,
    unit: 'kg',
  });
  const [feedback, setFeedback] = useState('');

  function createPO(e) {
    e.preventDefault();
    const po = {
      po_id: `PO-${1000 + pos.length + 1}`,
      supplier: form.supplier,
      material_id: form.material_id,
      qty: Number(form.qty),
      unit: form.unit,
      status: 'pending_supplier',
    };
    setPos((prev) => [po, ...prev]);
    setFeedback(`Created ${po.po_id} — awaiting approval.`);
    setStep(3);
  }

  function approvePO(po) {
    const mat = inventory.find((m) => m.material_id === po.material_id);
    if (!mat) return;
    setInventory((prev) =>
      prev.map((m) =>
        m.material_id === po.material_id
          ? { ...m, current_qty: m.current_qty + po.qty }
          : m
      )
    );
    setPos((prev) =>
      prev.map((p) => (p.po_id === po.po_id ? { ...p, status: 'approved' } : p))
    );
    setFeedback(`Approved ${po.po_id} — ${mat.name} +${po.qty} ${po.unit}. Inventory updated.`);
    setStep(4);
  }

  function resetDemo() {
    setInventory(INITIAL_INVENTORY);
    setPos(INITIAL_POS);
    setStep(1);
    setFeedback('');
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
        {[
          { n: 1, label: 'Inspect stock' },
          { n: 2, label: 'Raise PO' },
          { n: 3, label: 'Approve PO' },
          { n: 4, label: 'Verify stock' },
        ].map((s) => (
          <span
            key={s.n}
            className={`pill ${step >= s.n ? 'ok' : 'off'}`}
            style={{ padding: '6px 12px' }}
          >
            {s.n}. {s.label}
          </span>
        ))}
        <button className="btn btn-ghost btn-small" style={{ marginLeft: 'auto' }} onClick={resetDemo}>
          Reset demo
        </button>
      </div>

      {feedback && <div className="alert info">{feedback}</div>}

      {/* Current inventory */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Current inventory</h2>
        <table className="table">
          <thead>
            <tr><th>Material</th><th>Qty</th><th>Unit</th><th>Low threshold</th><th>Status</th></tr>
          </thead>
          <tbody>
            {inventory.map((m) => {
              const low = m.current_qty < m.low_threshold;
              return (
                <tr key={m.material_id} className={low ? 'row-warn' : ''}>
                  <td><strong>{m.name}</strong><br /><span className="mono muted">{m.material_id}</span></td>
                  <td className={low ? 'warn' : ''}>{m.current_qty}</td>
                  <td>{m.unit}</td>
                  <td>{m.low_threshold}</td>
                  <td>
                    <span className={`pill ${low ? 'off' : 'ok'}`}>
                      {low ? 'Low stock' : 'OK'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="muted small">
          Notice <code>chicken</code> and <code>paneer</code> are below threshold. Approving a PO will fix that.
        </p>
      </div>

      {/* Create PO form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Raise a purchase order</h2>
        <form className="inline-form" onSubmit={createPO}>
          <label>Supplier
            <input
              value={form.supplier}
              onChange={(e) => setForm({ ...form, supplier: e.target.value })}
            />
          </label>
          <label>Material
            <select
              value={form.material_id}
              onChange={(e) => {
                const mat = inventory.find((m) => m.material_id === e.target.value);
                setForm({ ...form, material_id: e.target.value, unit: mat?.unit || form.unit });
              }}
            >
              {inventory.map((m) => (
                <option key={m.material_id} value={m.material_id}>
                  {m.name} ({m.material_id})
                </option>
              ))}
            </select>
          </label>
          <label>Qty
            <input
              type="number"
              step="0.01"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: e.target.value })}
            />
          </label>
          <label>Unit
            <input
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
            />
          </label>
          <button className="btn btn-primary" disabled={form.qty <= 0}>
            Create PO
          </button>
        </form>
      </div>

      {/* PO list */}
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Purchase orders</h2>
        <table className="table">
          <thead>
            <tr><th>PO</th><th>Supplier</th><th>Material</th><th>Qty</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {pos.map((p) => (
              <tr key={p.po_id}>
                <td className="mono">{p.po_id}</td>
                <td>{p.supplier}</td>
                <td>{p.material_id}</td>
                <td>{p.qty} {p.unit}</td>
                <td><span className={`pill ${p.status}`}>{p.status}</span></td>
                <td>
                  {p.status === 'pending_supplier' ? (
                    <button className="btn btn-small btn-primary" onClick={() => approvePO(p)}>
                      Approve
                    </button>
                  ) : <span className="muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// Demo detail wrapper
// ============================================================
export default function DemoDetail() {
  const { id } = useParams();
  const router = useRouter();
  const demo = DEMOS[id];

  if (!demo) {
    return (
      <div>
        <h1>Demo not found</h1>
        <p className="muted">No demo with id <code>{id}</code>.</p>
        <Link href="/demos" className="btn btn-ghost">← Back to demos</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="row-between" style={{ marginBottom: 12 }}>
        <h1 style={{ margin: 0 }}>{demo.name}</h1>
        <Link href="/demos" className="btn btn-ghost">← All demos</Link>
      </div>

      <p className="muted" style={{ marginTop: 0 }}>{demo.description}</p>

      {id === 'demo1' ? (
        <InventoryDemo />
      ) : (
        <div className="card">
          <p>{demo.description}</p>
          <p className="muted">This demo is coming soon. Try <Link href="/demos/demo1">Demo 1</Link>.</p>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-primary" onClick={() => router.push('/owner')}>
          Owner CRM →
        </button>
      </div>
    </div>
  );
}
