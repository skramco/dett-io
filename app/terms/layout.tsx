import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use | Dett.io',
  description: 'Terms of Use for Dett.io — the legal agreement governing your use of our free mortgage calculators and educational content. Operated by Knowe LLC.',
  authors: [{ name: 'Knowe LLC', url: 'https://knowe.one' }],
  publisher: 'Knowe LLC',
  alternates: {
    canonical: 'https://dett.io/terms',
  },
  openGraph: {
    title: 'Terms of Use | Dett.io',
    description: 'Terms of Use for Dett.io — the legal agreement governing your use of our free mortgage calculators and educational content. Operated by Knowe LLC.',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
