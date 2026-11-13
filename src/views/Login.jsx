'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/api/AuthContext';
import api, { saveSession } from '@/api/client';

export default function Login() {
  const { login, register } = useAuth();
  const router = useRouter();
  
  // Modes: 'login', 'register', 'otp-send', 'otp-verify'
  const [mode, setMode] = useState('login');
  
  const [email, setEmail] = useState('admin@crm.local');
  const [password, setPassword] = useState('secret123');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  // Standard Password Login / Register
  async function submitPassword(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else                  await register(email, password);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  // Request OTP
  async function sendOtp(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      await api.post('/auth/send-otp', { email });
      setMode('otp-verify');
      setMsg('We sent a 6-digit code to your email.');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  // Verify OTP
  async function verifyOtp(e) {
    e.preventDefault();
    setError(''); setMsg(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      
      // Backend returns user_id, but NO token in the current verify-otp route.
      // We need to issue a token. If your backend doesn't return one, we mock it
      // or you need to update the backend /verify-otp to return a real JWT.
      // For now, let's assume we have a token or we log them in via password.
      
      if (data.token) {
          saveSession(data);
          router.push('/');
      } else {
          // Fallback: if backend didn't send a token, we can't fully auth.
          setError("OTP verified, but backend didn't return a token. (Update backend to return JWT).");
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setBusy(false);
    }
  }

  // UI Helpers
  const isPasswordMode = mode === 'login' || mode === 'register';
  const isOtpMode = mode === 'otp-send' || mode === 'otp-verify';

  return (
    <div className="login-wrap">
      <form 
        className="card login-card" 
        onSubmit={
          mode === 'login' || mode === 'register' ? submitPassword :
          mode === 'otp-send' ? sendOtp : verifyOtp
        }
      >
        <h1>🍛 Ref CRM</h1>
        
        {/* TABS */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button 
            type="button" 
            className={`btn ${isPasswordMode ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setMode('login'); setError(''); setMsg(''); }}
            style={{ flex: 1, padding: '8px' }}
          >
            Password
          </button>
          <button 
            type="button" 
            className={`btn ${isOtpMode ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setMode('otp-send'); setError(''); setMsg(''); }}
            style={{ flex: 1, padding: '8px' }}
          >
            Email OTP
          </button>
        </div>

        <p className="muted">
          {mode === 'login' && 'Sign in to continue'}
          {mode === 'register' && 'Create a staff account'}
          {mode === 'otp-send' && 'Enter your email to receive a login code'}
          {mode === 'otp-verify' && 'Enter the 6-digit code we sent you'}
        </p>

        {/* DEMO NOTICE */}
        <div style={{ background: '#eef4ff', border: '1px solid #cddfff', color: '#1e3a8a', padding: '10px 12px', borderRadius: 6, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          <strong>Demo mode.</strong> Any email and password will work.
        </div>

        {/* EMAIL INPUT (Always visible except in verify step) */}
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

        {/* PASSWORD INPUT */}
        {isPasswordMode && (
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </label>
        )}

        {/* OTP INPUT */}
        {mode === 'otp-verify' && (
          <label>
            OTP Code (6 digits)
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
              style={{ letterSpacing: 4, fontSize: 18, textAlign: 'center' }}
              required
            />
          </label>
        )}

        {error && <div className="alert error">{error}</div>}
        {msg && <div className="alert info">{msg}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy ? '…' : 
           mode === 'login' ? 'Sign in' : 
           mode === 'register' ? 'Create account' :
           mode === 'otp-send' ? 'Send Code' : 'Verify Code'}
        </button>

        {/* SWITCHERS */}
        {mode === 'login' && (
          <button type="button" className="btn btn-ghost" onClick={() => setMode('register')}>
            Need an account? Register
          </button>
        )}
        {mode === 'register' && (
          <button type="button" className="btn btn-ghost" onClick={() => setMode('login')}>
            Have an account? Sign in
          </button>
        )}
        {mode === 'otp-verify' && (
          <button type="button" className="btn btn-ghost" onClick={() => setMode('otp-send')}>
            Didn't get it? Try another email
          </button>
        )}
      </form>
    </div>
  );
}