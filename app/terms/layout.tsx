import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Dett.io',
  description: 'Terms of Use for Dett.io — the legal agreement governing your use of our free mortgage calculators and educational content. Operated by Knowe LLC.',
  alternates: {
    canonical: 'https://dett.io/terms',
  },
  openGraph: {
    title: 'Terms of Use | Dett.io',
    description: 'Terms of Use for Dett.io — the legal agreement governing your use of our free mortgage calculators and educational content. Operated by Knowe LLC.',
    url: 'https://dett.io/terms',
    siteName: 'Dett',
    type: 'website',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
