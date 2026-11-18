'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/api/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectUrl = searchParams.get('redirect') || '/owner/inventory';

  const [email, setEmail] = useState('admin@crm.local');
  const [password, setPassword] = useState('secret123');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await login(email, password);
      router.push(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>🍛 Ref CRM</h1>
        <p className="muted">Sign in to continue</p>

        <label>
          Email
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="username" 
            required 
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        
        {error && <div className="alert error">{error}</div>}
        
        <button className="btn btn-primary" disabled={busy}>
          {busy ? '…' : 'Sign in'}
        </button>

        {/* ⭐ Link to dedicated register page, passing the redirect param */}
        <Link 
          href={`/register?redirect=${encodeURIComponent(redirectUrl)}`} 
          className="btn btn-ghost" 
          style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: 10 }}
        >
          Need an account? Register
        </Link>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}