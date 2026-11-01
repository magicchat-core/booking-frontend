import { useState } from 'react';
import api from '../api/client';

export default function Customers() {
  const [phone, setPhone] = useState('+911111111111');
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState('');
  const [newCust, setNewCust] = useState({ name: '', phone: '' });
  const [createMode, setCreateMode] = useState(false);
  const [delta, setDelta] = useState(100);
  const [reason, setReason] = useState('birthday');
  const [msg, setMsg] = useState('');

  async function search(e) {
    if (e) e.preventDefault();
    setError(''); setMsg(''); setCustomer(null); setCreateMode(false);
    try {
      const { data } = await api.get(`/customers?phone=${encodeURIComponent(phone)}`);
      setCustomer(data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setCreateMode(true);
        setNewCust({ name: '', phone });
        setMsg('No customer with this phone — fill in a name to register.');
      } else {
        setError(err.response?.data?.error || err.message);
      }
    }
  }

  async function create(e) {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const { data } = await api.post('/customers', newCust);
      setCustomer(data);
      setCreateMode(false);
      setMsg(`Created ${data.customer_id}.`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  async function adjustPoints(e) {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const { data } = await api.patch(`/customers/${customer.customer_id}/loyalty-points`, {
        delta: Number(delta),
        reason,
      });
      setCustomer({ ...customer, loyalty_points: data.new_total });
      setMsg(`Points updated to ${data.new_total}.`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h1>Customers</h1>
      <p className="muted">Search by phone. If not found, register, then add loyalty points (Workflow 5).</p>

      <form className="inline-form" onSubmit={search}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+911111111111" />
        <button className="btn btn-primary">Search</button>
      </form>

      {error && <div className="alert error">{error}</div>}
      {msg && <div className="alert info">{msg}</div>}

      {createMode && (
        <form className="card" onSubmit={create}>
          <h3>Register new customer</h3>
          <label>Name
            <input value={newCust.name} onChange={(e) => setNewCust({ ...newCust, name: e.target.value })} required />
          </label>
          <label>Phone
            <input value={newCust.phone} onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })} required />
          </label>
          <button className="btn btn-primary">Create</button>
        </form>
      )}

      {customer && (
        <div className="card">
          <h2>{customer.name}</h2>
          <p className="mono muted">{customer.customer_id} · {customer.phone}</p>
          <p className="stat-num">{customer.loyalty_points} <span className="stat-label">loyalty points</span></p>
          <form className="inline-form" onSubmit={adjustPoints}>
            <label>Delta
              <input type="number" value={delta} onChange={(e) => setDelta(e.target.value)} />
            </label>
            <label>Reason
              <input value={reason} onChange={(e) => setReason(e.target.value)} />
            </label>
            <button className="btn btn-primary">Adjust points</button>
          </form>
        </div>
      )}
    </div>
  );
}
