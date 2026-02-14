import { ImageResponse } from 'next/og';
import { calculatorSeoConfigs } from '@/lib/seo/calculatorSeo';

export const runtime = 'edge';
export const alt = 'Dett.io Calculator';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = calculatorSeoConfigs[slug];
  const title = config?.jsonLd?.name || 'Mortgage Calculator';
  const description = config?.description?.slice(0, 120) || 'Free mortgage calculator on Dett.io';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 32,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="12" fill="#2563eb" />
            <path d="M20 12h8c13.255 0 24 10.745 24 24S41.255 60 28 60h-8V12z" fill="#1d4ed8" />
            <path d="M24 20v24l20-12L24 20z" fill="white" />
          </svg>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#1e293b' }}>
            dett<span style={{ color: '#2563eb' }}>.io</span>
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#2563eb',
              background: '#dbeafe',
              padding: '4px 12px',
              borderRadius: 20,
            }}
          >
            FREE CALCULATOR
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: '900px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 22,
            color: '#64748b',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          {description}
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 80,
            fontSize: 16,
            color: '#94a3b8',
          }}
        >
          dett.io/calculators/{slug} • No signup required
        </div>
      </div>
    ),
    { ...size }
  );
}
