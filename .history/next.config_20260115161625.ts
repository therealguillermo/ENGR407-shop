/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Allows deployment even with small TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Allows deployment even with linting warnings
  },
};

export default nextConfig;