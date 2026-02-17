'use client';

import { useState, useEffect, type ComponentType } from 'react';
import { EmbedProvider } from '@/lib/embedContext';

const calculatorImports: Record<string, () => Promise<{ default: ComponentType }>> = {
  'mortgage-cost': () => import('@/app/calculators/mortgage-cost/page'),
  'affordability': () => import('@/app/calculators/affordability/page'),
  'down-payment': () => import('@/app/calculators/down-payment/page'),
  'rent-vs-buy': () => import('@/app/calculators/rent-vs-buy/page'),
  'refinance': () => import('@/app/calculators/refinance/page'),
  'cash-out-refi': () => import('@/app/calculators/cash-out-refi/page'),
  'recast-vs-refi': () => import('@/app/calculators/recast-vs-refi/page'),
  'points-buydown': () => import('@/app/calculators/points-buydown/page'),
  'arm-vs-fixed': () => import('@/app/calculators/arm-vs-fixed/page'),
  'timeline-simulator': () => import('@/app/calculators/timeline-simulator/page'),
  'extra-payment': () => import('@/app/calculators/extra-payment/page'),
  'acceleration': () => import('@/app/calculators/acceleration/page'),
  'biweekly': () => import('@/app/calculators/biweekly/page'),
  'interest-sensitivity': () => import('@/app/calculators/interest-sensitivity/page'),
  'amortization': () => import('@/app/calculators/amortization/page'),
  'dti': () => import('@/app/calculators/dti/page'),
  'closing-costs': () => import('@/app/calculators/closing-costs/page'),
  'pmi': () => import('@/app/calculators/pmi/page'),
  'fha': () => import('@/app/calculators/fha/page'),
  'va': () => import('@/app/calculators/va/page'),
};

export default function EmbedClientOnly({ slug }: { slug: string }) {
  const [Calculator, setCalculator] = useState<ComponentType | null>(null);

  useEffect(() => {
    const loader = calculatorImports[slug];
    if (loader) {
      loader().then((mod) => setCalculator(() => mod.default));
    }
  }, [slug]);

  if (!Calculator) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 12 }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e0e0e0', borderTopColor: '#196bc0', borderRadius: '50%', animation: 'dett-spin 0.8s linear infinite' }} />
        <style>{`@keyframes dett-spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: 14, color: '#666' }}>Loading calculator...</span>
      </div>
    );
  }

  return (
    <EmbedProvider>
      <Calculator />
    </EmbedProvider>
  );
}
