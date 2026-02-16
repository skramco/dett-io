import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Dett.io',
  description: 'Terms of Use for Dett.io — the legal agreement governing your use of our free mortgage calculators and educational content. Operated by Skramco Holdings LLC.',
  alternates: {
    canonical: 'https://dett.io/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
