'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/api/AuthContext';
import api from '@/api/client'; // ⭐ Needed for OTP endpoints

function LoginForm() {
  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ⭐ Grab the redirect URL from the query params
  const redirectUrl = searchParams.get('redirect') || '/owner/inventory';

  // Modes: 'password', 'register', 'otp-email', 'otp-verify'
  const [mode, setMode] = useState('password'); 
  const [email, setEmail] = useState('admin@crm.local');
  const [password, setPassword] = useState('secret123');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submitPassword(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      if (mode === 'password') await login(email, password);
      else await register(email, password);
      
      router.push(redirectUrl);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function requestOtp(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      await api.post('/auth/send-otp', { email });
      setMode('otp-verify');
      setMsg('OTP sent to your email!');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function submitOtp(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      // The backend returns the JWT if successful
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      // Save the session manually (since AuthContext.login only handles password)
      localStorage.setItem('crm_token', data.token);
      localStorage.setItem('crm_user', JSON.stringify({ 
        user_id: data.user_id, email: data.email, role: data.role 
      }));
      
      // Force a hard reload to pick up the new auth state and go to the redirect URL
      window.location.href = redirectUrl;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  const resetView = () => {
    setMode('password');
    setOtp('');
    setError('');
    setMsg('');
  };

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={
        mode === 'otp-email' ? requestOtp : 
        mode === 'otp-verify' ? submitOtp : 
        submitPassword
      }>
        <h1>🍛 Ref CRM</h1>
        
        {mode === 'password' && <p className="muted">Sign in to continue</p>}
        {mode === 'register' && <p className="muted">Create a new account</p>}
        {mode === 'otp-email' && <p className="muted">Enter your email for an OTP</p>}
        {mode === 'otp-verify' && <p className="muted">Enter the 6-digit code sent to {email}</p>}

        {/* Email Input (always visible except in verify mode) */}
        {mode !== 'otp-verify' && (
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
        )}

        {/* Password Input (visible for password & register) */}
        {(mode === 'password' || mode === 'register') && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'password' ? 'current-password' : 'new-password'}
              required
            />
          </label>
        )}

        {/* OTP Input (visible for verify) */}
        {mode === 'otp-verify' && (
          <label>
            One-Time Password
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              required
            />
          </label>
        )}
        
        {error && <div className="alert error">{error}</div>}
        {msg && <div className="alert info">{msg}</div>}
        
        <button className="btn btn-primary" disabled={busy}>
          {busy ? '…' : 
           mode === 'otp-email' ? 'Send OTP' :
           mode === 'otp-verify' ? 'Verify & Login' :
           mode === 'register' ? 'Create account' : 'Sign in'}
        </button>

        {/* Toggle Buttons */}
        <div style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(mode === 'password' || mode === 'register') && (
            <>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setMode(mode === 'password' ? 'register' : 'password')}
              >
                {mode === 'password' ? 'Need an account? Register' : 'Have an account? Sign in'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { setMode('otp-email'); setError(''); setMsg(''); }}
                style={{ color: '#3b82f6' }}
              >
                Sign in with OTP instead →
              </button>
            </>
          )}

          {(mode === 'otp-email' || mode === 'otp-verify') && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={resetView}
            >
              ← Back to Password Login
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ⭐ Next.js 14 requires useSearchParams to be wrapped in Suspense
export default function Login() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}