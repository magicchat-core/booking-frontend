import { useState } from 'react';
import api from '../api/client';

export default function Orders() {
  const [orderId, setOrderId] = useState('ORD-1234');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [noteMsg, setNoteMsg] = useState('');

  async function lookup(e) {
    if (e) e.preventDefault();
    setError(''); setOrder(null); setNoteMsg('');
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  async function cancel() {
    setError(''); setNoteMsg('');
    try {
      const { data } = await api.post(`/orders/${orderId}/cancel`);
      setOrder({ ...order, status: data.status });
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      if (status === 409) {
        // Branch: log a support note
        try {
          await api.post('/support-notes', {
            order_id: orderId,
            note: `Cancel rejected (${msg}). Customer informed; escalation logged.`,
          });
          setNoteMsg('Cancellation was rejected — a support note was logged automatically.');
        } catch (noteErr) {
          setNoteMsg('Could not log support note: ' + noteErr.message);
        }
      }
    }
  }

  async function addNote(e) {
    e.preventDefault();
    setNoteMsg('');
    try {
      await api.post('/support-notes', { order_id: orderId, note });
      setNoteMsg('Support note added.');
      setNote('');
    } catch (err) {
      setNoteMsg(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h1>Orders</h1>
      <p className="muted">Look up an order and try cancelling. Shipped orders return 409 and auto-log a support note (Workflow 4).</p>

      <form className="inline-form" onSubmit={lookup}>
        <input
          className="mono"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="ORD-1234"
        />
        <button className="btn btn-primary">Look up</button>
        <span className="muted small">Try <code>ORD-1234</code> (placed) or <code>ORD-1235</code> (shipped).</span>
      </form>

      {error && <div className="alert error">{error}</div>}
      {noteMsg && <div className="alert info">{noteMsg}</div>}

      {order && (
        <div className="card">
          <h2 className="mono">{order.order_id}</h2>
          <p>Customer: <strong className="mono">{order.customer_id}</strong> &nbsp;·&nbsp; Status: <span className={`pill ${order.status}`}>{order.status}</span></p>
          <h3>Items</h3>
          <ul>
            {(order.items || []).map((it, i) => (
              <li key={i}><code>{it.item_id}</code> × {it.qty}</li>
            ))}
          </ul>
          <div className="row">
            <button className="btn btn-danger" onClick={cancel}>Cancel order</button>
          </div>
          <hr />
          <h3>Add support note</h3>
          <form className="inline-form" onSubmit={addNote}>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Customer called…"
              style={{ minWidth: '22rem' }}
            />
            <button className="btn" disabled={!note.trim()}>Add note</button>
          </form>
        </div>
      )}
    </div>
  );
}
