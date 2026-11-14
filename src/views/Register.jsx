'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/api/AuthContext';

export default function Register() {
  const { sendOtp } = useAuth();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      // Trigger the OTP email from the backend
      await sendOtp(email);
      // Move to the OTP verification screen, passing the email in the URL
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
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

        <Link href="/login" className="btn btn-ghost" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: 10 }}>
          ← Back to Sign in
        </Link>
      </form>
    </div>
  );
}