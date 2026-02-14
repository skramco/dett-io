import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Guides | Dett.io',
  description: 'Plain-English mortgage guides — salary-based affordability, refinancing decisions, closing costs, PMI, and more. Free, no signup required.',
  openGraph: {
    title: 'Mortgage Guides | Dett.io',
    description: 'Plain-English mortgage guides — salary-based affordability, refinancing decisions, closing costs, PMI, and more.',
    url: 'https://dett.io/guides',
    siteName: 'Dett.io',
    type: 'website',
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
