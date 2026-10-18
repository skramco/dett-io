'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { EmbedProvider } from '@/lib/embedContext';
import { parseEmbedOptions, type EmbedWidgetOptions } from '@/lib/embed/options';
import { referringDomainFrom } from '@/lib/embed/referrer';
import { trackEvent } from '@/lib/analytics';
import { EmbedThemeProvider } from './EmbedThemeProvider';

const calculatorImports: Record<string, () => Promise<{ default: ComponentType }>> = {
  'mortgage-cost': () => import('@/app/calculators/mortgage-cost/page'),
  affordability: () => import('@/app/calculators/affordability/page'),
  'down-payment': () => import('@/app/calculators/down-payment/page'),
  'rent-vs-buy': () => import('@/app/calculators/rent-vs-buy/page'),
  refinance: () => import('@/app/calculators/refinance/page'),
  'cash-out-refi': () => import('@/app/calculators/cash-out-refi/page'),
  'recast-vs-refi': () => import('@/app/calculators/recast-vs-refi/page'),
  'points-buydown': () => import('@/app/calculators/points-buydown/page'),
  'arm-vs-fixed': () => import('@/app/calculators/arm-vs-fixed/page'),
  'timeline-simulator': () => import('@/app/calculators/timeline-simulator/page'),
  'extra-payment': () => import('@/app/calculators/extra-payment/page'),
  acceleration: () => import('@/app/calculators/acceleration/page'),
  biweekly: () => import('@/app/calculators/biweekly/page'),
  'interest-sensitivity': () => import('@/app/calculators/interest-sensitivity/page'),
  amortization: () => import('@/app/calculators/amortization/page'),
  dti: () => import('@/app/calculators/dti/page'),
  'closing-costs': () => import('@/app/calculators/closing-costs/page'),
  pmi: () => import('@/app/calculators/pmi/page'),
  fha: () => import('@/app/calculators/fha/page'),
  va: () => import('@/app/calculators/va/page'),
};

function postResize() {
  if (typeof window === 'undefined' || window.parent === window) return;
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0
  );
  window.parent.postMessage(
    { source: 'dett-embed', type: 'resize', height },
    '*'
  );
}

function recordEmbedLoad(slug: string) {
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  const domain = referringDomainFrom(referrer);
  trackEvent('embed_load', {
    calculator_slug: slug,
    referring_domain: domain ?? 'direct',
  });
  if (!domain) return;
  void fetch('/api/embed-hit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, referrer }),
    keepalive: true,
  }).catch(() => {
    /* never block the widget on analytics */
  });
}

function LoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 240,
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: '3px solid #e0e0e0',
          borderTopColor: '#196bc0',
          borderRadius: '50%',
          animation: 'dett-spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes dett-spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: 14, color: '#666' }}>Loading calculator...</span>
    </div>
  );
}

export default function EmbedClientOnly({ slug }: { slug: string }) {
  const [Calculator, setCalculator] = useState<ComponentType | null>(null);
  const [options] = useState<EmbedWidgetOptions>(() =>
    typeof window === 'undefined'
      ? parseEmbedOptions('')
      : parseEmbedOptions(window.location.search)
  );

  useEffect(() => {
    const loader = calculatorImports[slug];
    if (loader) {
      loader().then((mod) => setCalculator(() => mod.default));
    }
  }, [slug]);

  useEffect(() => {
    recordEmbedLoad(slug);
  }, [slug]);

  useEffect(() => {
    postResize();
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(postResize);
    });
    observer.observe(document.documentElement);
    if (document.body) observer.observe(document.body);
    window.addEventListener('load', postResize);
    const interval = window.setInterval(postResize, 1500);
    return () => {
      observer.disconnect();
      window.removeEventListener('load', postResize);
      window.clearInterval(interval);
    };
  }, [Calculator, options]);

  if (!Calculator) {
    return <LoadingState />;
  }

  return (
    <EmbedThemeProvider options={options}>
      <EmbedProvider options={options}>
        <Calculator />
      </EmbedProvider>
    </EmbedThemeProvider>
  );
}
