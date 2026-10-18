import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'recharts', 'lucide-react'],
  },
  async redirects() {
    // Consolidated calculators (ENG-345): the three payoff tools merged into
    // /calculators/payoff and the three rate/structure tools merged into
    // /calculators/loan-timeline. Permanent redirects (308) preserve ranking
    // equity from the old URLs. /partners redirects to the ENG-361 embed builder.
    const calculatorMerges: Array<[string, string]> = [
      ['extra-payment', 'payoff'],
      ['acceleration', 'payoff'],
      ['biweekly', 'payoff'],
      ['points-buydown', 'loan-timeline'],
      ['timeline-simulator', 'loan-timeline'],
      ['arm-vs-fixed', 'loan-timeline'],
    ];
    return [
      {
        source: '/partners',
        destination: '/embed',
        permanent: true,
      },
      ...calculatorMerges.flatMap(([oldSlug, newSlug]) => [
        {
          source: `/calculators/${oldSlug}`,
          destination: `/calculators/${newSlug}`,
          permanent: true,
        },
        {
          source: `/embed/${oldSlug}`,
          destination: `/embed/${newSlug}`,
          permanent: true,
        },
      ]),
    ];
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
