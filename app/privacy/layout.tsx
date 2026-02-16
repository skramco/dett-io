import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dett.io',
  description: 'Privacy Policy for Dett.io — how we collect, use, and protect your information. Operated by Skramco Holdings LLC.',
  alternates: {
    canonical: 'https://dett.io/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
