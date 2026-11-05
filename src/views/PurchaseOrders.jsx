'use client';

import { useEffect, useState } from 'react';
import api from '../api/client';

export default function PurchaseOrders() {
  const [pos, setPOs] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [form, setForm] = useState({ supplier: 'FreshMeat', material_id: 'chicken', qty: 10, unit: 'kg' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [p, inv] = await Promise.all([api.get('/purchase-orders'), api.get('/inventory')]);
      setPOs(p.data);
      setMaterials(inv.data);
      if (inv.data.length && !inv.data.some((m) => m.material_id === form.material_id)) {
        setForm((f) => ({ ...f, material_id: inv.data[0].material_id, unit: inv.data[0].unit }));
      }
    } catch (err) { setError(err.response?.data?.error || err.message); }
  }
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function create(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      await api.post('/purchase-orders', { ...form, qty: Number(form.qty) });
      await load();
    } catch (err) { setError(err.response?.data?.error || err.message); }
    finally { setBusy(false); }
  }

  async function approve(po, approved) {
    try {
      const { data } = await api.patch(`/purchase-orders/${po.po_id}/approve`, { approved });
      await load();
      if (approved) {
        alert(`Approved. Inventory updated: ${data.inventory_updated ? 'yes' : 'no (already processed)'}`);
      }
    } catch (err) { alert(err.response?.data?.error || err.message); }
  }

  function pickMaterial(id) {
    const m = materials.find((x) => x.material_id === id);
    setForm((f) => ({ ...f, material_id: id, unit: m?.unit || f.unit }));
  }

  return (
    <div>
      <h1>Purchase Orders</h1>
      <p className="muted">Create a PO, then approve it — inventory is credited atomically (Workflows 2 &amp; 3).</p>
      {error && <div className="alert error">{error}</div>}

      <form className="card inline-form" onSubmit={create}>
        <label>Supplier
          <input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
        </label>
        <label>Material
          <select value={form.material_id} onChange={(e) => pickMaterial(e.target.value)}>
            {materials.map((m) => (
              <option key={m.material_id} value={m.material_id}>{m.name} ({m.material_id})</option>
            ))}
          </select>
        </label>
        <label>Qty
          <input type="number" step="0.01" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
        </label>
        <label>Unit
          <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? '…' : 'Create PO'}</button>
      </form>

      <table className="table">
        <thead>
          <tr><th>PO</th><th>Supplier</th><th>Material</th><th>Qty</th><th>Status</th><th>Actions</th></tr>
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
                  <>
                    <button className="btn btn-small btn-primary" onClick={() => approve(p, true)}>Approve</button>{' '}
                    <button className="btn btn-small btn-danger" onClick={() => approve(p, false)}>Reject</button>
                  </>
                ) : <span className="muted">—</span>}
              </td>
            </tr>
          ))}
          {pos.length === 0 && (
            <tr><td colSpan="6" className="muted">No purchase orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}