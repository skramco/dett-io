import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Dett.io - Free Mortgage Calculators & Decision Tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 60px',
            maxWidth: '900px',
          }}
        >
          {/* Logo: icon + text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <svg width="72" height="72" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="12" fill="#2563eb" />
              <path d="M20 12h8c13.255 0 24 10.745 24 24S41.255 60 28 60h-8V12z" fill="#1d4ed8" />
              <path d="M24 20v24l20-12L24 20z" fill="white" />
            </svg>
            <div style={{ fontSize: 64, fontWeight: 800, color: '#1e293b' }}>
              dett<span style={{ color: '#2563eb' }}>.io</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: '#0f172a',
              textAlign: 'center',
              lineHeight: 1.3,
              marginBottom: 24,
            }}
          >
            Free Mortgage Calculators & Decision Tools
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#64748b',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            No ads. No lead capture. No signup. Just honest math.
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            gap: 32,
            fontSize: 16,
            color: '#94a3b8',
          }}
        >
          <span>20 Calculators</span>
          <span>•</span>
          <span>19 Guides</span>
          <span>•</span>
          <span>100% Free</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
