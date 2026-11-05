'use client';

import { useEffect, useState, useRef } from 'react';
import api from '../api/client';

export default function RunningTables() {
  const [tables, setTables] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);   // chat transcript for the active table
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const endRef = useRef(null);

  async function loadTables() {
    try {
      const { data } = await api.get('/tables');
      setTables(data);
      if (data.length && !activeId) setActiveId(data[0].table_id);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    }
  }
  useEffect(() => { loadTables(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const active = tables.find((t) => t.table_id === activeId) || null;

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || !active) return;
    const text = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true); setErr('');

    try {
      // Very small intent matcher — the demo uses two verbs:
      //   "apply the <tag> discount to <table>"  → POST /tables/:id/discount
      //   anything else                          → POST /tables/:id/ask
      const lower = text.toLowerCase();
      const applyMatch = lower.match(/apply\s+(?:the\s+)?(\w+)\s+discount/);

      if (applyMatch) {
        const tag = applyMatch[1];
        const { data } = await api.post(`/tables/${active.table_id}/discount`, { tag });
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            text:
              `Applied ${data.tag} ${data.pct}% discount.\n` +
              `Discountable items:\n` +
              data.breakdown.map((b) => `  • ${b.name} ₹${b.line_total.toFixed(2)} → ₹${b.discount.toFixed(2)} off`).join('\n') +
              (data.excluded.length
                ? `\nExcluded:\n` + data.excluded.map((x) => `  • ${x.name} ₹${x.line_total.toFixed(2)} (${x.reason})`).join('\n')
                : '') +
              `\nNew running amount: ₹${data.new_running_total.toFixed(2)}`,
          },
        ]);
        await loadTables();
      } else {
        const { data } = await api.post(`/tables/${active.table_id}/ask`, { question: text });
        setMessages((m) => [...m, { role: 'assistant', text: data.answer }]);
      }
    } catch (e) {
      const msg = e.response?.data?.error || e.message;
      setMessages((m) => [...m, { role: 'assistant', text: `⚠ ${msg}` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1>Running Tables</h1>
      <p className="muted">Owner view. Open tables are listed on the left; each one has a chat box. Try: <code>apply the Friends discount to T6</code>.</p>
      {err && <div className="alert error">{err}</div>}

      <div className="tables-grid">
        {/* Left column: table list */}
        <div className="card tables-list">
          <h3>Open tables</h3>
          {tables.length === 0 && <p className="muted">No open tables.</p>}
          {tables.map((t) => (
            <button
              key={t.table_id}
              className={`table-row ${t.table_id === activeId ? 'active' : ''}`}
              onClick={() => { setActiveId(t.table_id); setMessages([]); }}
            >
              <div className="row-between">
                <strong>{t.table_id}</strong>
                <span className="mono">₹{t.running_total.toFixed(2)}</span>
              </div>
              <div className="muted small">
                {t.items.length} item{t.items.length === 1 ? '' : 's'}
                {t.customer_id ? ` · ${t.customer_id}` : ' · walk-in'}
              </div>
            </button>
          ))}
        </div>

        {/* Right column: active table detail + chat */}
        <div className="card">
          {active ? (
            <>
              <h2>{active.table_id} <span className="muted mono small">{active.customer_id || 'walk-in'}</span></h2>

              <table className="table">
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Line</th><th></th></tr>
                </thead>
                <tbody>
                  {active.items.map((it) => (
                    <tr key={it.line_id}>
                      <td>{it.name}</td>
                      <td>{it.qty}</td>
                      <td>₹{it.unit_price.toFixed(2)}</td>
                      <td>₹{it.line_total.toFixed(2)}</td>
                      <td>
                        {it.ignore_discount && <span className="pill off">no discount</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="row-between totals">
                <span>Subtotal</span>
                <span className="mono">₹{active.subtotal.toFixed(2)}</span>
              </div>
              {active.last_discount && (
                <div className="row-between totals">
                  <span>{active.last_discount.tag} ({active.last_discount.pct}%)</span>
                  <span className="mono">−₹{Number(active.last_discount.amount).toFixed(2)}</span>
                </div>
              )}
              <div className="row-between totals grand">
                <span>Running total</span>
                <span className="mono">₹{active.running_total.toFixed(2)}</span>
              </div>

              <hr />
              <h3>Chat</h3>
              <div className="chat-log">
                {messages.length === 0 && (
                  <p className="muted small">
                    Try: <code>apply the Friends discount to {active.table_id}</code>, or <code>what was excluded?</code>
                  </p>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={`chat-msg ${m.role}`}>
                    <div className="chat-role">{m.role}</div>
                    <pre className="chat-text">{m.text}</pre>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
              <form className="inline-form" onSubmit={handleSend}>
                <input
                  style={{ flex: 1 }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Type a command…`}
                  disabled={busy}
                />
                <button className="btn btn-primary" disabled={busy || !input.trim()}>
                  {busy ? '…' : 'Send'}
                </button>
              </form>
            </>
          ) : (
            <p className="muted">Select a table to see its order and chat.</p>
          )}
        </div>
      </div>
    </div>
  );
}