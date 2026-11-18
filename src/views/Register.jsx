'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/api/AuthContext';
import api from '@/api/client';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/owner/inventory';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      // Assuming sendOtp is handled via API directly, or you can add it to AuthContext
      await api.post('/auth/send-otp', { email });
      
      // Move to OTP screen, passing email AND redirect
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>🍛 Create Account</h1>
        <p className="muted">Register to start using the CRM</p>

        <label>
          Email
          <input 
            type="email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            autoComplete="username" 
            placeholder="you@example.com"
            required 
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="At least 6 characters"
          />
        </label>
        
        {error && <div className="alert error">{error}</div>}
        
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Sending Code…' : 'Send Verification Code'}
        </button>

        <Link 
          href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} 
          className="btn btn-ghost" 
          style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: 10 }}
        >
          ← Back to Sign in
        </Link>
      </form>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}