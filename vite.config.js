import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND = 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy the CRM routes + auth + health to the Node backend
      '/auth':             BACKEND,
      '/menu':             BACKEND,
      '/inventory':        BACKEND,
      '/purchase-orders':  BACKEND,
      '/customers':        BACKEND,
      '/orders':           BACKEND,
      '/support-notes':    BACKEND,
      '/health':           BACKEND,
    },
  },
});
