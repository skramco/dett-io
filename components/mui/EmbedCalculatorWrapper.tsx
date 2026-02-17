'use client';

import dynamic from 'next/dynamic';

// Loading spinner shown while the client-only component loads.
// This is the ONLY thing rendered during SSR — the actual calculator
// is loaded entirely on the client via ssr:false, which avoids the
// Emotion <style> hydration mismatch caused by ThemeRegistry/CssBaseline.
const loadingSpinner = (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 12 }}>
    <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#196bc0', borderRadius: '50%', animation: 'dett-spin 0.8s linear infinite' }} />
    <style>{`@keyframes dett-spin { to { transform: rotate(360deg); } }`}</style>
    <span style={{ fontSize: 14, color: '#666' }}>Loading calculator...</span>
  </div>
);

// Client-only wrapper — never SSR'd, so no Emotion style mismatch
const EmbedClientOnly = dynamic(() => import('./EmbedClientOnly'), {
  ssr: false,
  loading: () => loadingSpinner,
});

export function EmbedCalculatorWrapper({ slug }: { slug: string }) {
  return <EmbedClientOnly slug={slug} />;
}
