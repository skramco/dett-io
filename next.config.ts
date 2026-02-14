import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'recharts', 'lucide-react'],
  },
};

export default nextConfig;
