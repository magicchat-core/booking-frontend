'use client';
import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Menu() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  async function load() {
    try {
      const { data } = await api.get('/menu');
      // Guard: if backend returns {items:[…]}, {data:[…]}, or a non-array,
      // extract the array instead of feeding the raw payload into .map.
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setItems(list);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setItems([]);  // never leave a non-array in state
    }
  }
  useEffect(() => { load(); }, []);

  async function toggle(item) {
    try {
      await api.patch(`/menu/${item.item_id}/availability`, { in_stock: !item.in_stock });
      setItems((prev) =>
        (Array.isArray(prev) ? prev : []).map((i) =>
          i.item_id === item.item_id ? { ...i, in_stock: !i.in_stock } : i
        )
      );
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h1>Menu</h1>
      <p className="muted">Flip availability to run <strong>Workflow 1</strong>.</p>
      {error && <div className="alert error">{error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Item</th><th>Category</th><th>Price</th><th>Recipe</th><th>In stock</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.item_id}>
              <td><strong>{i.name}</strong><br/><span className="mono muted">{i.item_id}</span></td>
              <td>{i.category}</td>
              <td>₹{Number(i.price).toFixed(2)}</td>
              <td className="mono small">
                {(i.recipe || []).map((r) => `${r.material_id}×${r.qty}`).join(', ') || '—'}
              </td>
              <td>
                <span className={i.in_stock ? 'pill ok' : 'pill off'}>
                  {i.in_stock ? 'In stock' : 'Out'}
                </span>
              </td>
              <td>
                <button className="btn btn-small" onClick={() => toggle(i)}>
                  Mark {i.in_stock ? 'out' : 'in'}
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && !error && (
            <tr><td colSpan="6" className="muted">No menu items loaded.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
