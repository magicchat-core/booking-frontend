/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // trailingSlash: true,  <-- REMOVE OR COMMENT THIS OUT
};

export default nextConfig;