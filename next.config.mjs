/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This prevents Next.js from treating files in src/pages as routes
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'], 
  webpack: (config) => {
    // This is a hacky way to tell Next.js to ignore src/pages for routing
    config.resolve.alias['@/pages'] = require('path').resolve(__dirname, 'src/pages');
    return config;
  }
};

export default nextConfig;