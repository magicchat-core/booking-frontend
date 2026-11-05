/** @type {import('next').NextConfig} */
const BACKEND = 'http://122.160.157.99:3001';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/auth/:path*',            destination: `${BACKEND}/auth/:path*` },
      { source: '/menu/:path*',            destination: `${BACKEND}/menu/:path*` },
      { source: '/inventory/:path*',       destination: `${BACKEND}/inventory/:path*` },
      { source: '/purchase-orders/:path*', destination: `${BACKEND}/purchase-orders/:path*` },
      { source: '/customers/:path*',       destination: `${BACKEND}/customers/:path*` },
      { source: '/orders/:path*',          destination: `${BACKEND}/orders/:path*` },
      { source: '/tables/:path*',          destination: `${BACKEND}/tables/:path*` },
      { source: '/support-notes/:path*',   destination: `${BACKEND}/support-notes/:path*` },
      { source: '/health/:path*',          destination: `${BACKEND}/health/:path*` },
    ];
  },
};

export default nextConfig;
