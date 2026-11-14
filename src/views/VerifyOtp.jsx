'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/api/AuthContext';

// Next.js requires useSearchParams to be wrapped in Suspense
function VerifyOtpContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email') || '';
  
  const [password, setPassword] = useState(''); // We need the password again to create the account
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // If someone lands here directly without an email, kick them back to register
  useEffect(() => {
    if (!email) router.replace('/register');
  }, [email, router]);

  async function submit(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      await register(email, password, otp);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>🍛 Verify Email</h1>
        <p className="muted">We sent a 6-digit code to <strong>{email}</strong></p>

        <label>
          Verification Code
          <input 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            placeholder="000000" 
            maxLength={6}
            autoFocus
            required
            style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.2em', fontFamily: 'monospace' }}
          />
        </label>

        <label>
          Confirm Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            minLength={6}
          />
        </label>
        
        {error && <div className="alert error">{error}</div>}
        
        <button className="btn btn-primary" disabled={busy || otp.length !== 6 || !password}>
          {busy ? 'Verifying…' : 'Verify & Create Account'}
        </button>

        <button 
          type="button" 
          className="btn btn-ghost" 
          onClick={() => router.push('/register')}
          style={{ marginTop: 10 }}
        >
          Didn't get a code? Go back
        </button>
      </form>
    </div>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="login-wrap">Loading…</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}