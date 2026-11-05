/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add trailing slash so GitHub pages handles routes properly
  trailingSlash: true, 
};

export default nextConfig;