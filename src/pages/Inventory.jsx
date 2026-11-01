import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/inventory');
      setItems(data);
    } catch (err) { setError(err.response?.data?.error || err.message); }
  }
  useEffect(() => { load(); }, []);

  async function adjust(item) {
    const raw = prompt(`Adjust ${item.name} by (e.g. -2 or 5):`, '1');
    if (raw === null) return;
    const n = Number(raw);
    if (!Number.isFinite(n)) return alert('Not a number');
    try {
      const { data } = await api.patch(`/inventory/${item.material_id}`, {
        adjust_qty: n, reason: 'manual adjust from UI',
      });
      setItems((prev) => prev.map((i) => i.material_id === item.material_id
        ? { ...i, current_qty: data.new_qty } : i));
    } catch (err) { alert(err.response?.data?.error || err.message); }
  }

  return (
    <div>
      <h1>Inventory</h1>
      <p className="muted">Materials below threshold are highlighted. Adjust quantity to correct stock manually.</p>
      {error && <div className="alert error">{error}</div>}
      <table className="table">
        <thead>
          <tr><th>Material</th><th>Qty</th><th>Unit</th><th>Low threshold</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((i) => {
            const low = i.current_qty < i.low_threshold;
            return (
              <tr key={i.material_id} className={low ? 'row-warn' : ''}>
                <td><strong>{i.name}</strong><br/><span className="mono muted">{i.material_id}</span></td>
                <td className={low ? 'warn' : ''}>{i.current_qty}</td>
                <td>{i.unit}</td>
                <td>{i.low_threshold}</td>
                <td><button className="btn btn-small" onClick={() => adjust(i)}>Adjust</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
