import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Embed Free Mortgage Calculators',
  description:
    'Embed any Dett.io mortgage calculator on your site for free. No signup, no API key, mobile-responsive, and always up to date. Operated by Knowe LLC.',
  alternates: {
    canonical: 'https://dett.io/embed',
  },
  openGraph: {
    title: 'Embed Free Mortgage Calculators | Dett.io',
    description:
      'Copy-paste a free, customizable mortgage calculator onto WordPress, Squarespace, Wix, Webflow, or plain HTML.',
    url: 'https://dett.io/embed',
  },
};

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
