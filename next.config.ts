import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'recharts', 'lucide-react'],
  },
  async headers() {
    return [
      {
        // Allow /embed routes to be iframed on any domain
        source: '/embed/:path*',
        headers: [
          // Remove X-Frame-Options entirely — ALLOWALL is non-standard and
          // browsers only recognize DENY/SAMEORIGIN. Use CSP frame-ancestors instead.
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
          // Explicitly unset X-Frame-Options in case the hosting platform injects one
          { key: 'X-Frame-Options', value: '' },
          // Allow cross-origin embedding (needed when embedder uses COEP: require-corp)
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
