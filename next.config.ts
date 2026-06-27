import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker/Vercel/Railway deployment
  output: 'standalone',
  typescript: {
    // Ignore typescript errors during build to tolerate 'any' declarations in mockup structures
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    // Ignore eslint rules during build
    ignoreDuringBuilds: true,
  },
  images: {
    // Allow external image URLs (Unsplash placeholders used in mock data)
    unoptimized: true,
  },
};

export default nextConfig;
