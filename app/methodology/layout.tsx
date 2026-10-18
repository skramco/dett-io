import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology & Data Sources | Dett',
  description:
    'How Dett.io calculators work: the exact formulas we use, where our rate tables and assumptions come from, and how often everything is reviewed.',
  alternates: {
    canonical: 'https://dett.io/methodology',
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
