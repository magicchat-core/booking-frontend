'use client';

import { useState } from 'react';
import { useAuth } from '@/api/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('demo@sageion.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    // ⭐ DEMO AUTH — accept any credentials, no server verification.
    //
    // This site is a demo of an AI agent that lives inside a
    // SaaS-style product. A real product would gate its features
    // behind login, so this site mimics that flow: the visitor
    // "signs in" and only then sees the full demo (the CRM
    // interfaces + the AI agent widget).
    //
    // There is no server round-trip, no email, no account
    // provisioning — but there IS a session, because the rest of
    // the site (ProtectedRoute, Layout, SageionBridge) needs one
    // to treat the visitor as signed in.
    //
    // We persist a minimal identity to localStorage. The shape
    // matches what `saveSession()` in `api/client.js` produces,
    // so downstream code reads it identically to a real login.
    try {
      const fakeUserId = `demo_${Date.now()}`;
      const fakeSession = {
        user_id: fakeUserId,
        email,
        role: 'staff',
      };
      localStorage.setItem('crm_user', JSON.stringify(fakeSession));
      // Deliberately no `crm_token` — the backend isn't involved.
    } catch (err) {
      console.warn('[Login demo] failed to persist session:', err);
      setError('Could not start the demo session. Please try again.');
      setBusy(false);
      return;
    }

    // Brief pause so the button shows its busy state, then
    // hard-navigate. The hard nav is important: AuthProvider
    // re-hydrates from localStorage on load, so /demos sees a
    // signed-in user with no flash of "not logged in".
    setTimeout(() => {
      window.location.assign('/');
    }, 300);
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>🍛 Ref CRM</h1>
        <p className="muted">
          {mode === 'login' ? 'Sign in to continue' : 'Create a staff account'}
        </p>

        {/* ⭐ Demo notice — explains the "why" honestly. */}
        <div
          role="note"
          style={{
            background: '#eef4ff',
            border: '1px solid #cddfff',
            color: '#1e3a8a',
            padding: '10px 12px',
            borderRadius: 6,
            fontSize: 13,
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          <strong>Demo mode.</strong> Any email and password will work.
          Real SaaS products usually gate their features behind
          sign-in, so this site does too — we've added a login screen
          so the demo feels like the real thing. Credentials are
          accepted as-is; no verification is performed.
        </div>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </label>

        {error && <div className="alert error">{error}</div>}

        <button className="btn btn-primary" disabled={busy}>
          {busy
            ? '…'
            : mode === 'login'
              ? 'Sign in (demo)'
              : 'Create account (demo)'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login'
            ? 'Need an account? Register'
            : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}