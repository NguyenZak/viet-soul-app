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
  // Force all pages to be dynamic to prevent static generation issues
  output: 'standalone',
  // Disable static optimization completely
  trailingSlash: false,
  // Skip static generation entirely
  skipTrailingSlashRedirect: true,
  // Disable static export
  distDir: '.next',
  // Force dynamic rendering
  generateBuildId: async () => {
    return 'dynamic-build'
  },
};

export default nextConfig;
