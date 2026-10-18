import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dett.io - Who We Are & How We Stay Independent | Dett',
  description:
    'Dett.io is an independent set of mortgage calculators built by Knowe LLC. Learn who is behind the site, how we make money, and why we have no lead forms.',
  authors: [{ name: 'Knowe LLC', url: 'https://knowe.one' }],
  publisher: 'Knowe LLC',
  alternates: {
    canonical: 'https://dett.io/about',
  },
  openGraph: {
    title: 'About Dett.io - Who We Are & How We Stay Independent | Dett',
    description:
      'Dett.io is a Knowe LLC company. Independent mortgage calculators with documented math and no lead forms.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
