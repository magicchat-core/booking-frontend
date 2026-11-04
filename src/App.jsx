import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './api/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import RunningTables from './pages/RunningTables';

// ============================================================
// Sageion — reference client integration.
//
// The SDK exposes two methods on window.sageion_os:
//
//   setUp()       — configuration. Call ONCE per page load.
//   initialize()  — auth state. Call whenever the user changes.
//
// Four rules a correct integration must honor:
//
//   1. setUp() runs once, awaited, before any initialize().
//   2. initialize() is called from exactly one place.
//   3. initialize() is gated on auth having SETTLED
//      (loading === false), not on user being non-null.
//   4. initialize() receives the current user, once per change.
//
// Two effects. Two concerns. No overlap. No state refs.
// ============================================================

function useSageionSetUp() {
  const [ready, setReady] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        await window.sageion_os.setUp(
          window.__APP_CONFIG__.SAGEION_APP_ID,
          window.__APP_CONFIG__.SAGEION_API_KEY,
          window.__APP_CONFIG__.SAGEION_REGION,
          window.__APP_CONFIG__.ROOT_SAGEION_ID,
        );
        setReady(true);
      } catch (err) {
        // The SDK renders its own user-facing error UI for
        // credential or network failures. Log and move on.
        console.error('[Sageion] setUp failed:', err);
      }
    })();
  }, []);

  return ready;
}

function useSageionInitialize(setUpReady) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Gate 1: setUp() must have resolved.
    if (!setUpReady) return;

    // Gate 2: AuthContext must have settled. Without this, the
    // effect fires while `user` is still null during the initial
    // auth check, producing an anonymous → authenticated
    // transition on every page load.
    if (loading) return;

    // The user's current identity. The SDK handles every
    // transition internally:
    //
    //   user set   → initialize({ uid })  → login / switch
    //   user null  → initialize({})       → logout → anonymous
    //
    // Same payload twice → no-op. Safe to call as often as this
    // effect fires.
    //
    // NOTE: the CRM's user object carries `user_id` (not `id`).
    window.sageion_os
      .initialize(user ? { uid: String(user.user_id) } : {})
      .catch((err) => console.error('[Sageion] initialize failed:', err));
  }, [setUpReady, loading, user]);
}

// Must be rendered INSIDE <AuthProvider> so useAuth() resolves
// to the correct context.
function SageionBridge() {
  const setUpReady = useSageionSetUp();
  useSageionInitialize(setUpReady);
  return null;
}

function Shell({ children }) {
  return <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <SageionBridge />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Owner home — lands here after login and on unknown routes */}
        <Route path="/owner"          element={<Shell><RunningTables /></Shell>} />

        <Route path="/"                element={<Shell><Dashboard /></Shell>} />
        <Route path="/menu"            element={<Shell><Menu /></Shell>} />
        <Route path="/inventory"       element={<Shell><Inventory /></Shell>} />
        <Route path="/purchase-orders" element={<Shell><PurchaseOrders /></Shell>} />
        <Route path="/orders"          element={<Shell><Orders /></Shell>} />
        <Route path="/customers"       element={<Shell><Customers /></Shell>} />

        <Route path="*" element={<Navigate to="/owner" replace />} />
      </Routes>
    </AuthProvider>
  );
}