import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Dett.io - Who We Are & How We Stay Independent | Dett',
  description:
    'Dett.io is built by Knowe LLC, a team of 30+ year mortgage industry veterans and mortgage technologists. Free calculators, no signup.',
  alternates: {
    canonical: 'https://dett.io/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
