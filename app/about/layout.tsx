import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dett.io - Who We Are & How We Stay Independent | Dett',
  description:
    'Dett.io is an independent set of mortgage calculators built by Skramco Holdings LLC. Learn who is behind the site, how we make money, and why we have no lead forms.',
  alternates: {
    canonical: 'https://dett.io/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
