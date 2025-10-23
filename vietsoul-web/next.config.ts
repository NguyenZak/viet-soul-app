import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    staticGenerationRetryCount: 0,
  },
  // Vercel optimization
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Disable static optimization to prevent build issues
  generateBuildId: async () => {
    return 'vercel-build'
  },
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true
  },
};

export default nextConfig;
