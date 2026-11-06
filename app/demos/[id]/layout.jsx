// app/demos/[id]/layout.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import SageionScripts from '@/components/SageionScripts';
import SageionBridge from '@/components/SageionBridge';
import { getSageionApp } from '@/config/sageionDemos';

// ============================================================
// Demo layout — scopes the Sageion widget to this demo page.
//
// Responsibilities:
//   1. Look up the Sageion app config for this demo id.
//   2. If found, mount <SageionScripts> + <SageionBridge> so the
//      bubble bootstraps on this page.
//   3. If not found, render children with NO Sageion scaffolding
//      (the page itself shows "Demo not found").
//   4. Guard against soft-nav between demos, which the SDK
//      cannot support (singleton, no hot-swap). Any change in
//      `id` after mount forces a full page reload so the previous
//      demo's Sageion instance is torn down cleanly.
//
// What it does NOT do:
//   - It does not fetch Sageion credentials. They live in
//     src/config/sageionDemos.js and are static per build.
//   - It does not tear down Sageion on unmount. The SDK has no
//     destroy() API. The only clean teardown is a page reload,
//     which the reloadDocument links in <Demos /> and <DemoDetail />
//     trigger, and which the soft-nav guard below enforces as a
//     fallback.
// ============================================================

export default function DemoLayout({ children, params }) {
  // `params` is a Promise in Next 15+ and a plain object in Next
  // 14 and earlier. Handle both without a React version check.
  // On 14.x, `params` is `{ id: 'demo1' }`. On 15.x, it's a
  // Promise that resolves to `{ id: 'demo1' }`.
  //
  // We deliberately avoid `use(params)` because on 14.x React
  // throws "An unsupported type was passed to use()" when given a
  // plain object.
  const resolvedParams =
    params && typeof params.then === 'function' ? usePromise(params) : params;
  const { id } = resolvedParams;

  const sageionApp = getSageionApp(id);

  // ------------------------------------------------------------
  // Soft-nav guard: if the demo id changes *without* a page reload,
  // the current Sageion instance (bound to the previous demo's
  // app) is still alive in window.sageion_os. The SDK cannot
  // hot-swap apps — setUp() will reject with "Wrong api_key" because
  // tezkit_app_data in storage belongs to the old app.
  //
  // So if we ever detect a change in `id` after this layout has
  // mounted, we force a hard reload. This makes the reload behaviour
  // consistent even if a caller forgets `reloadDocument` on a link.
  //
  // We capture the FIRST id in a ref so subsequent changes can be
  // detected on a per-instance basis. If the layout unmounts and a
  // fresh one mounts for a new id (the normal Next.js route-change
  // flow), the ref resets and no reload fires — that only happens
  // when Next.js soft-navigates *within the same [id] segment*,
  // which shouldn't happen for this route tree, but defensive.
  // ------------------------------------------------------------
  const mountedIdRef = useRef(id);
  const router = useRouter();

  useEffect(() => {
    if (mountedIdRef.current !== id) {
      console.warn(
        `[DemoLayout] Demo changed ${mountedIdRef.current} → ${id} via soft nav. ` +
          `Sageion cannot hot-swap apps. Forcing a hard reload.`,
      );
      // We can't just call router.refresh() — that re-renders React
      // but keeps the page alive, and the old Sageion socket +
      // bubble + ChatCore instance would persist. window.location.reload()
      // is the only reliable way to drop everything.
      window.location.reload();
    }
  }, [id, router]);

  // ------------------------------------------------------------
  // No Sageion app configured for this demo id.
  //
  // The demo page (`DemoDetail.jsx`) already handles "Demo not found"
  // by rendering its own fallback. We just render the children with
  // the standard auth gate so the UX is consistent with a demo that
  // DOES exist — no blank screen, no missing ProtectedRoute.
  // ------------------------------------------------------------
  if (!sageionApp) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  // ------------------------------------------------------------
  // Normal path: this demo has a Sageion app.
  //
  // <SageionScripts> appends three <script> tags (socket.io, bundle,
  // config-inlined) to document.body. On its bundle-load, it calls
  // setUp(appId, apiKey, region, rootId) and dispatches a
  // `sageion_setup_complete` CustomEvent carrying the appId.
  //
  // <SageionBridge> listens for that event (filtered to its own
  // appId), then calls initialize({ uid }) once auth has hydrated.
  //
  // Both are app-scoped — if you ever mount two demos' bridges
  // accidentally, each reacts only to its own setup event.
  // ------------------------------------------------------------
  return (
    <ProtectedRoute>
      <SageionScripts appConfig={sageionApp} />
      <SageionBridge appConfig={sageionApp} />
      {children}
    </ProtectedRoute>
  );
}