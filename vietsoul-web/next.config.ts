import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Vercel optimization
  output: 'standalone',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  // Image optimization
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: true
  },
};

export default nextConfig;
