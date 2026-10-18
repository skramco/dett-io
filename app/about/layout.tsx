import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dett.io - Who We Are & How We Stay Independent | Dett',
  description:
    'Dett.io is built by Knowe LLC, a team of 30+ year mortgage industry veterans. Learn who is behind the site, how we stay independent, and why we have no lead forms.',
  alternates: {
    canonical: 'https://dett.io/about',
  },
  openGraph: {
    title: 'About Dett.io — a Knowe LLC company',
    description:
      'Dett.io is built by Knowe LLC, a team of 30+ year mortgage industry veterans and mortgage technologists. Free calculators, no signup.',
    url: 'https://dett.io/about',
    siteName: 'Dett',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
